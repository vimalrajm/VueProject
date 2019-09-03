<template>
  <div class="column is-10">
    <nav class="level">
      <div class="level-left">
        <div class="level-item">
          <p class="subtitle is-3">
            <span class="has-text-grey-light">Hello </span>
            <strong class="is-capitalized">{{ currUser.name }}</strong>
          </p>
        </div>
      </div>
    </nav>
    <div class="columns">
      <div class="column is-3-widescreen">
        <div class="notification is-link has-text">
          <p class="title is-1">
            {{ ordersCount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") }}
          </p>
          <p class="subtitle is-4">Orders</p>
        </div>
      </div>
      <div class="column is-3-widescreen">
        <div class="notification is-info has-text">
          <p class="title is-1">
            ${{
              revenu
                .toFixed(0)
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            }}
          </p>
          <p class="subtitle is-4">Revenu</p>
        </div>
      </div>
      <div class="column is-3-widescreen">
        <div class="notification is-primary has-text">
          <p class="title is-1">
            {{
              customersCount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            }}
          </p>
          <p class="subtitle is-4">Customers</p>
        </div>
      </div>
      <div class="column is-3-widescreen">
        <div class="notification is-success has-text">
          <p class="title is-1">
            {{ viewers.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") }}
          </p>
          <p class="subtitle is-4">Viewers</p>
        </div>
      </div>
    </div>
    <div class="columns">
      <LatestOrders></LatestOrders>
      <PopularBooks></PopularBooks>
      <LoyalCustomers></LoyalCustomers>
    </div>
  </div>
</template>

<script>
import orders from "@/services/orders";
import customers from "@/services/customers";
import LatestOrders from "@/components/LatestOrders";
import PopularBooks from "@/components/PopularBooks";
import LoyalCustomers from "@/components/LoyalCustomers";
import nProgress from "nprogress";
export default {
  props: {
    currUser: {
      required: true,
      type: Object
    }
  },
  components: {
    LatestOrders,
    PopularBooks,
    LoyalCustomers
  },
  data() {
    return {
      ordersCount: 0,
      ordersData: [],
      revenu: 0,
      customersCount: 0,
      customersData: [],
      viewers: 0
    };
  },
  async created() {
    nProgress.start();
    ({ data: this.ordersData } = await orders.getAllOrders());
    this.ordersCount = this.ordersData.length;
    for (let order of this.ordersData) {
      this.revenu += order.totalCost;
    }
    ({ data: this.customersData } = await customers.getAllCustomers());
    this.customersCount = this.customersData.length;
    const res = await customers.getViews();
    this.viewers = res.data[0].viewers;
    nProgress.done();
  }
};
</script>

<style lang="scss" scoped></style>
