<template>
  <div class="column is-4-desktop">
    <div class="card animate">
      <div class="card-content">
        <h2 class="title is-4">
          Latest orders
        </h2>
        <div class="level" v-for="order in lastThreeOrders" :key="order.id">
          <div class="level-left">
            <div>
              <p class="title is-6 is-marginless">
                <router-link
                  v-if="
                    currUser.role === 'admin' || order.custId === currUser.id
                  "
                  :to="{ name: 'orderEdit', params: { orderId: order.id } }"
                >
                  {{ order.id }}
                </router-link>
                <label v-else class="not-allowed has-text-link">
                  {{ order.id }}
                </label>
              </p>
              <small>
                {{ getDate(order.date) }}
                <router-link
                  v-if="
                    currUser.role === 'admin' || order.custId === currUser.id
                  "
                  :to="{
                    name: 'addCustomer',
                    params: { customerDetail: order.custId }
                  }"
                  class="is-capitalized"
                >
                  {{ order.custName }}
                </router-link>
                <label v-else class="not-allowed has-text-link is-capitalized">
                  {{ order.custName }}
                </label>
              </small>
            </div>
          </div>
          <div class="level-right">
            <div class="has-text-right">
              <p class="title is-6 is-marginless">
                ${{ order.totalCost.toFixed(2) }}
              </p>
              <span
                v-if="order.status === 'In Progress'"
                class="tag is-warning"
              >
                {{ order.status }}
              </span>
              <span
                v-else-if="order.status === 'Successful'"
                class="tag is-success"
              >
                {{ order.status }}
              </span>
              <span v-else class="tag is-danger">
                {{ order.status }}
              </span>
            </div>
          </div>
        </div>
        <router-link
          :to="{ name: 'orders', params: { currPageNumber: 1 } }"
          class="button is-link is-outlined"
          >View all orders</router-link
        >
      </div>
    </div>
  </div>
</template>

<script>
import orders from "@/services/orders";
import customers from "@/services/customers";
import { mapState } from "vuex";

export default {
  data() {
    return {
      lastThreeOrders: [],
      orderData: []
    };
  },
  async created() {
    let custData;
    ({ data: this.orderData } = await orders.getAllOrders());
    for (
      let i = this.orderData.length - 1;
      i > this.orderData.length - 4;
      i--
    ) {
      ({ data: custData } = await customers.getCustomer(
        this.orderData[i].custId
      ));
      this.orderData[i].custName = custData.name;
      this.lastThreeOrders.push(this.orderData[i]);
    }
  },
  methods: {
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
    ...mapState(["currUser"])
  }
};
</script>
<style lang="scss" scoped></style>
