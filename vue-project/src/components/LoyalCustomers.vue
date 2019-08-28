<template>
  <div class="column is-4-desktop">
    <div class="card">
      <div class="card-content">
        <h2 class="title is-4">
          Most loyal customers
        </h2>
        <div
          v-for="(customer, index) in topThreeCustomers"
          :key="customer.id"
          class="media"
        >
          <div class="media-left is-marginless">
            <p class="number">{{ index + 1 }}</p>
          </div>
          <div class="media-content">
            <p class="title is-6 is-spaced is-marginless is-capitalized">
              <router-link
                v-if="currUser.role === 'admin' || currUser.id === customer.id"
                :to="{
                  name: 'addCustomer',
                  params: { customerDetail: customer.id }
                }"
              >
                {{ customer.name }}
              </router-link>
              <label v-else class="not-allowed has-text-link">
                {{ customer.name }}
              </label>
            </p>
            <p class="subtitle is-6">
              {{ customer.country }}
            </p>
          </div>
          <div class="media-right">{{ customer.orders }} orders</div>
        </div>
        <router-link
          :to="{ name: 'customers', params: { currPageNumber: 1 } }"
          class="button is-link is-outlined"
          >View all Customers</router-link
        >
      </div>
    </div>
  </div>
</template>

<script>
import customers from "@/services/customers";
import { mapState } from "vuex";
import orders from "@/services/orders";

export default {
  data() {
    return {
      custData: [],
      topThreeCustomers: []
    };
  },
  async created() {
    let customersData, order;
    ({ data: customersData } = await customers.getAllCustomers());
    customersData.forEach(customerData => {
      this.custData.push({
        id: customerData.id,
        orders: 0,
        name: customerData.name,
        country: customerData.country
      });
    });
    ({ data: order } = await orders.getAllOrders());
    order.forEach(orderData => {
      this.custData.forEach(cust => {
        if (cust.id === orderData.custId) {
          cust.orders += 1;
        }
      });
    });
    this.custData.sort((a, b) => {
      return a.orders - b.orders;
    });
    for (let i = this.custData.length - 1; i > this.custData.length - 4; i--) {
      this.topThreeCustomers.push(this.custData[i]);
    }
  },
  computed: {
    ...mapState(["currUser"])
  }
};
</script>
<style lang="scss" scoped></style>
