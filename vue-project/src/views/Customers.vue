<template>
  <div class="hero is-small">
    <Header :currUser="currUser"></Header>
    <div class="hero-body">
      <div class="columns">
        <div class="column is-2">
          <Menu :currentPage="currentPage"></Menu>
        </div>
        <div class="column is-10">
          <h1 class="title">Customers</h1>
          <CustomersNavBar
            :count="noOfCustomers"
            :placeHolder="placeholder"
            :currentPage="currentPage"
          ></CustomersNavBar>
          <VueTable
            ref="vuetable"
            :api-mode="false"
            :fields="headers"
            :data="customerData"
            @vuetable:checkbox-toggled="checked"
            @vuetable:checkbox-toggled-all="checked"
          >
            <div slot="name" slot-scope="props">
              <router-link
                :to="{
                  name: 'addCustomer',
                  params: { customerDetail: props.rowData.id }
                }"
                v-if="
                  currUser.role === 'admin' || currUser.id === props.rowData.id
                "
              >
                <strong class="has-text-link is-capitalized">
                  {{ props.rowData.name }}
                </strong>
              </router-link>
              <strong v-else class="has-text-link is-capitalized not-allowed">{{
                props.rowData.name
              }}</strong>
            </div>
            <div slot="email" slot-scope="props">
              <code> {{ props.rowData.email }} </code>
            </div>
            <div slot="orders" slot-scope="props">
              <router-link
                :to="{
                  name: 'orders',
                  params: { currPageNumber: 1 }
                }"
                >{{ props.rowData.orders }}
              </router-link>
            </div>
            <div
              v-if="currUser.role === 'admin'"
              slot="actions"
              slot-scope="props"
            >
              <div class="buttons">
                <router-link
                  :to="{
                    name: 'addCustomer',
                    params: { customerDetail: props.rowData.id }
                  }"
                  class="button is-small is-warning"
                >
                  Edit
                </router-link>
                <p
                  class="button is-small is-danger"
                  @click="deleteCustomer(props.rowData)"
                >
                  Delete
                </p>
              </div>
            </div>
            <div v-else slot="actions" slot-scope="props">
              <div class="buttons">
                <router-link
                  :to="
                    props.rowData.id === currUser.id
                      ? {
                          name: 'addCustomer',
                          params: { customerDetail: props.rowData.id }
                        }
                      : ''
                  "
                  class="button is-small is-warning"
                  :disabled="props.rowData.id === currUser.id ? false : true"
                >
                  Edit
                </router-link>
                <p class="button is-small is-danger" disabled>Delete</p>
              </div>
            </div>
          </VueTable>
          <hr />
          <Pagination
            v-show="noOfCustomers"
            :pageLimit="custOrderLimit"
            :count="noOfCustomers"
            :currPageNumber="currPageNumber"
            :currentPage="currentPage"
          ></Pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Header from "@/components/Header.vue";
import Menu from "@/components/Menu.vue";
import CustomersNavBar from "@/components/NavBar.vue";
import Pagination from "@/components/Pagination.vue";
import VueTable from "vuetable-2";
import VuetableFieldCheckbox from "vuetable-2/src/components/VuetableFieldCheckbox.vue";
import { mapState } from "vuex";
import customers from "@/services/customers";
import { toastMixin } from "@/toastMixin";
import orders from "@/services/orders";

export default {
  mixins: [toastMixin],
  props: {
    currPageNumber: {
      require: true,
      type: [Number, String]
    }
  },
  components: {
    Header,
    Menu,
    CustomersNavBar,
    Pagination,
    VueTable
  },
  computed: {
    ...mapState(["currUser", "currentPage", "noOfCustomers", "custOrderLimit"])
  },
  async created() {
    this.$store.dispatch("setCurrPage", "Customers");
    this.$store.dispatch("setCustAndOrderLimit", 7);
    try {
      await customers
        .getCustomers(this.currPageNumber, this.custOrderLimit)
        .then(res => {
          this.customerData = res;
          this.$store.dispatch(
            "setNoOfCustomers",
            res.headers["x-total-count"]
          );
        });
    } catch (e) {
      console.log(e);
    }
  },
  data() {
    return {
      deleteItems: [],
      placeholder: "Name, Email...",
      headers: [
        {
          name: VuetableFieldCheckbox,
          width: "3%"
        },
        {
          name: "name",
          title: "Name",
          width: "16.5%"
        },
        {
          name: "email",
          title: "Email",
          width: "30.5%"
        },
        {
          name: "country",
          title: "Country",
          width: "14.7%"
        },
        {
          name: "orders",
          title: "Orders",
          width: "13%"
        },
        {
          name: "actions",
          title: "Actions",
          width: "22%"
        }
      ],
      customerData: []
    };
  },
  methods: {
    async multiRemove() {
      let data = Array.from(this.deleteItems);
      for (let i in data) {
        await this.delete(data[i], 0);
      }
      this.toast("is-success", "Customer's removed successfully", "is-top");
    },
    checked() {
      this.deleteItems = this.$refs.vuetable.selectedTo;
      console.log(Array.from(this.deleteItems));
    },
    deleteCustomer(customer) {
      if (Array.from(this.deleteItems).length !== 0) {
        this.$dialog.confirm({
          title: "Remove customer",
          message: `Are you sure you want to remove selected books?.`,
          confirmText: "Delete",
          type: "is-danger",
          iconPack: "fa",
          icon: "exclamation-triangle",
          size: "is-small",
          hasIcon: true,
          onConfirm: () => {
            this.multiRemove();
          }
        });
      } else {
        this.$dialog.confirm({
          title: "Remove customer",
          message: `Are you sure you want to remove <b>${customer.name}</b>.`,
          confirmText: "Delete",
          type: "is-danger",
          iconPack: "fa",
          icon: "exclamation-triangle",
          size: "is-small",
          hasIcon: true,
          onConfirm: () => {
            this.delete(customer.id, 1);
          }
        });
      }
    },
    async delete(id, count) {
      try {
        console.log(id, count);
        let ordersData;
        ({ data: ordersData } = await orders.getAllOrders());
        console.log(">>>", ordersData);
        for (let order of ordersData) {
          if (order.custId === id) {
            await orders.removeOrder(order.id);
          }
        }
        await customers.deleteCustomer(id).then(res => {
          if (res.status === 200) {
            if (count) {
              this.toast(
                "is-success",
                "Customer removed successfully",
                "is-top"
              );
            }
            if (
              this.customerData.data.length === 1 &&
              this.currPageNumber !== 1
            ) {
              this.$router.push({
                name: "customers",
                params: {
                  currPageNumber: this.currPageNumber - 1
                }
              });
            } else {
              this.customerData = this.customerData.data.filter(data => {
                return data.id !== id;
              });
              this.$store.dispatch("setNoOfCustomers", this.noOfCustomers - 1);
            }
          }
        });
        await customers
          .getCustomers(this.currPageNumber, this.custOrderLimit)
          .then(res => {
            this.customerData = res;
            this.$store.dispatch(
              "setNoOfCustomers",
              res.headers["x-total-count"]
            );
          });
      } catch (e) {
        console.log(e);
        this.toast("is-danger", "Some thing went wrong", "is-top");
      }
    }
  }
};
</script>

<style lang="scss" scoped></style>
