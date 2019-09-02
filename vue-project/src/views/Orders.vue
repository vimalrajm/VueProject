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
            :data="orderData"
            @vuetable:checkbox-toggled="checked"
            @vuetable:checkbox-toggled-all="checked"
          >
            <div slot="id" slot-scope="data">
              <router-link
                v-if="
                  currUser.id === data.rowData.custId ||
                    currUser.role === 'admin'
                "
                :to="{
                  name: 'orderEdit',
                  params: { orderId: data.rowData.id }
                }"
                class="has-text-weight-bold"
                >{{ data.rowData.id }}</router-link
              >
              <div
                v-else
                class="has-text-link has-text-weight-bold not-allowed"
              >
                {{ data.rowData.id }}
              </div>
            </div>
            <div slot="custName" slot-scope="data">
              <router-link
                v-if="
                  currUser.id === data.rowData.custId ||
                    currUser.role === 'admin'
                "
                :to="{
                  name: 'addCustomer',
                  params: { customerDetail: data.rowData.custId }
                }"
                class="is-capitalized"
                >{{ data.rowData.custName }}</router-link
              >
              <div v-else class="has-text-link is-capitalized not-allowed">
                {{ data.rowData.custName }}
              </div>
            </div>
            <div slot="date" slot-scope="data">
              {{ getDate(data.rowData.date) }}
            </div>
            <div
              slot="status"
              slot-scope="data"
              class="tag"
              :class="getColor(data.rowData.status)"
            >
              {{ data.rowData.status }}
            </div>
            <div slot="totalCost" slot-scope="data" class="has-text-right">
              ${{ Number(data.rowData.totalCost).toFixed(2) }}
            </div>
          </VueTable>
          <hr />
          <Pagination
            v-show="noOfOrders"
            :pageLimit="custOrderLimit"
            :count="noOfOrders"
            :currPageNumber="currPageNumber"
            :currentPage="currentPage"
          ></Pagination>
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
import orders from "@/services/orders";
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
          name: "id",
          title: "Order #",
          width: "14%"
        },
        {
          title: "Customer",
          name: "custName",
          width: "16.6%"
        },
        {
          name: "date",
          title: "Date",
          width: "21.5%"
        },
        {
          name: "numberOfBooks",
          title: "Books",
          width: "12%"
        },
        {
          name: "status",
          title: "Status",
          width: "22%"
        },
        {
          name: "totalCost",
          title: "Total",
          titleClass: "has-text-right",
          width: "0%"
        }
      ],
      orderData: []
    };
  },
  methods: {
    getColor(status) {
      if (status === "In Progress") {
        return "is-warning";
      } else if (status === "Successful") {
        return "is-success";
      } else {
        return "is-danger";
      }
    },
    checked() {
      this.deleteItems = this.$refs.vuetable.selectedTo;
    },
    getDate(date) {
      var months = [
        "Jan",
        "Feb",
        "March",
        "April",
        "May",
        "June",
        "July",
        "Aug",
        "Sept",
        "Oct",
        "Nov",
        "Dec"
      ];
      let dateFormat = "";
      dateFormat = months[new Date(date).getMonth()];
      dateFormat =
        dateFormat.toUpperCase() +
        " " +
        new Date(date).getDate() +
        " " +
        new Date(date).getFullYear();
      dateFormat =
        dateFormat +
        ", " +
        new Date(date).getHours() +
        ":" +
        new Date(date).getMinutes();
      return dateFormat;
    }
  },
  computed: {
    ...mapState(["currUser", "currentPage", "noOfOrders", "custOrderLimit"])
  },
  async created() {
    let res;
    this.$store.dispatch("setCurrPage", "Orders");
    this.$store.dispatch("setCustAndOrderLimit", 7);
    try {
      let temp = [];
      res = await orders.getOrders(this.currPageNumber, this.custOrderLimit);
      this.orderData = res.data;
      this.$store.dispatch("setNumOfOrders", res.headers["x-total-count"]);
      for (let data of this.orderData) {
        let res = await customers.getCustomer(data.custId);
        data.custName = await res.data.name;
        temp.push(data);
      }
      this.orderData = temp;
    } catch (e) {
      console.log(e);
    }
  }
};
</script>

<style lang="scss" scoped></style>
