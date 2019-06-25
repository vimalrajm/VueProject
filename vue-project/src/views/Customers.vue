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
            :api-mode="false"
            :fields="headers"
            :data="customerData"
            :line-numbers="true"
          >
            <div slot="name" slot-scope="props">
              <router-link
                :to="{
                  name: 'editOrCreateCustomer',
                  params: { id: props.rowData.id }
                }"
              >
                <strong class="has-text-link">
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
                  name: 'customer-orders',
                  params: { id: props.rowData.id }
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
                <p class="button is-small is-primary">Edit</p>
                <p class="button is-small is-danger">Delete</p>
              </div>
            </div>
            <div v-else slot="actions" slot-scope="props">
              <div class="buttons">
                <p class="button is-small is-primary" disabled>Edit</p>
                <p class="button is-small is-danger" disabled>Delete</p>
              </div>
            </div>
          </VueTable>
          <pagination
            v-show="noOfCustomers"
            :pageLimit="custLimit"
            :count="noOfCustomers"
            :currPageNumber="currPageNumber"
            :currentPage="currentPage"
          ></pagination>
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

export default {
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
    ...mapState(["currUser", "currentPage", "noOfCustomers", "custLimit"])
  },
  async created() {
    this.$store.dispatch("setCurrPage", "Customers");
    try {
      await customers
        .getCustomers(this.currPageNumber, this.custLimit)
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
  }
};
</script>

<style lang="scss" scoped></style>
