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
      <div class="column is-4-desktop">
        <div class="card">
          <div class="card-content">
            <h2 class="title is-4">
              Most loyal customers
            </h2>
            <div class="media">
              <div class="media-left is-marginless">
                <p class="number">1</p>
              </div>
              <div class="media-content">
                <p class="title is-6 is-spaced is-marginless">
                  <a href="edit-customer.html">John Miller</a>
                </p>
                <p class="subtitle is-6">
                  United States
                </p>
              </div>
              <div class="media-right">
                7 orders
              </div>
            </div>
            <div class="media">
              <div class="media-left is-marginless">
                <p class="number">2</p>
              </div>
              <div class="media-content">
                <p class="title is-6 is-spaced is-marginless">
                  <a href="edit-customer.html">Samantha Rogers</a>
                </p>
                <p class="subtitle is-6">
                  United Kingdom
                </p>
              </div>
              <div class="media-right">
                5 orders
              </div>
            </div>
            <div class="media">
              <div class="media-left is-marginless">
                <p class="number">3</p>
              </div>
              <div class="media-content">
                <p class="title is-6 is-spaced is-marginless">
                  <a href="edit-customer.html">Paul Jacques</a>
                </p>
                <p class="subtitle is-6">
                  Canada
                </p>
              </div>
              <div class="media-right">
                2 orders
              </div>
            </div>
            <a href="customers.html" class="button is-link is-outlined"
              >View all Customers</a
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import orders from "@/services/orders";
import customers from "@/services/customers";
import LatestOrders from "@/components/LatestOrders";
import PopularBooks from "@/components/PopularBooks";

export default {
  props: {
    currUser: {
      required: true,
      type: Object
    }
  },
  components: {
    LatestOrders,
    PopularBooks
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
    ({ data: this.ordersData } = await orders.getAllOrders());
    this.ordersCount = this.ordersData.length;
    // this.ordersData.forEach(order => {
    //   this.revenu += order.totalCost;
    // });
    for (let order of this.ordersData) {
      this.revenu += order.totalCost;
    }
    ({ data: this.customersData } = await customers.getAllCustomers());
    this.customersCount = this.customersData.length;
    const res = await customers.getViews();
    this.viewers = res.data[0].viewers;
  }
};
</script>

<style lang="scss" scoped></style>
