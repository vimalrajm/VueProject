<template>
  <div class="hero is-small">
    <Header :currUser="currUser"></Header>
    <div class="hero-body">
      <div class="columns">
        <div class="column is-2">
          <Menu :currentPage="currentPage"></Menu>
        </div>
        <div class="column is-10">
          <h1 class="title">Orders</h1>
          <OrdersNavBar
            :count="noOfOrders"
            :placeHolder="placeholder"
            :currentPage="currentPage"
          ></OrdersNavBar>
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
              >
                <strong class="has-text-link is-capitalized">
                  {{ props.rowData.name }}
                </strong>
              </router-link>
            </div>
            <div slot="email" slot-scope="props">
              <code> {{ props.rowData.email }} </code>
            </div>
            <div slot="orders" slot-scope="props">
              <router-link
                :to="{
                  name: 'addCustomer',
                  params: { customerDetail: props.rowData.id }
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
          <pagination
            v-show="noOfOrders"
            :pageLimit="custOrderLimit"
            :count="noOfOrders"
            :currPageNumber="currPageNumber"
            :currentPage="currentPage"
          ></pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Header from "@/components/Header";
import Menu from "@/components/Menu";
import { mapState } from "vuex";
import VueTable from "vuetable-2";
import VuetableFieldCheckbox from "vuetable-2/src/components/VuetableFieldCheckbox.vue";
import customers from "@/services/customers";
import OrdersNavBar from "@/components/NavBar.vue";
import Pagination from "@/components/Pagination.vue";

export default {
  components: {
    Header,
    Menu,
    VueTable,
    OrdersNavBar,
    Pagination
  },
  props: {
    currPageNumber: {
      require: true,
      type: [Number, String]
    }
  },
  data() {
    return {
      placeholder: "Order #, customer...",
      headers: [
        {
          name: VuetableFieldCheckbox,
          width: "3%"
        },
        {
          name: "orderId",
          title: "Order #",
          width: "14%"
        },
        {
          title: "Customer",
          name: "customer",
          width: "16.6%"
        },
        {
          name: "date",
          title: "Date",
          width: "21.5%"
        },
        {
          name: "books",
          title: "Books",
          width: "12%"
        },
        {
          name: "status",
          title: "Status",
          width: "22%"
        },
        {
          name: "total",
          title: "Total",
          titleClass: "has-text-right",
          width: "0%"
        }
      ],
      customerData: []
    };
  },
  methods: {
    checked() {
      this.deleteItems = this.$refs.vuetable.selectedTo;
      console.log(Array.from(this.deleteItems));
    }
  },
  computed: {
    ...mapState(["currUser", "currentPage", "noOfOrders", "custOrderLimit"])
  },
  async created() {
    this.$store.dispatch("setCurrPage", "Orders");
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
  }
};
</script>

<style lang="scss" scoped></style>
