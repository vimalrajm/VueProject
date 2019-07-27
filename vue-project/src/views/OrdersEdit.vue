<template>
  <div class="hero is-small">
    <Header :currUser="currUser"> </Header>
    <div class="hero-body">
      <div class="columns">
        <div class="column is-2">
          <Menu :currentPage="currentPage"></Menu>
        </div>
        <div class="column is-10">
          <nav class="breadcrumb">
            <ul>
              <li>
                <router-link
                  :to="{
                    name: 'orders',
                    params: { currPageNumber: 1 }
                  }"
                  class="has-text-weight-semibold"
                  >Orders</router-link
                >
              </li>
              <li class="is-active">
                <a href="#">Edit order</a>
              </li>
            </ul>
          </nav>
          <form>
            <div class="columns">
              <div class="column">
                <div class="field">
                  <h1 class="subtitle is-3">
                    <span class="has-text-grey-light">Order</span>
                    <strong>&nbsp;{{ orderId }}</strong>
                  </h1>
                </div>
              </div>
            </div>
            <div class="columns is-desktop">
              <div class="column is-3-desktop is-3-widescreen">
                <p class="heading">
                  <strong>DATE</strong>
                </p>
                <p class="content">
                  {{ orderDate }}
                </p>
                <p class="heading">
                  <strong>Status</strong>
                </p>
                <div class="buttons">
                  <button class="is-warning is-small button">
                    In Progress
                  </button>
                  <button class="is-success is-outlined is-small button">
                    Successful
                  </button>
                  <button class="is-danger is-outlined is-small button">
                    Failed
                  </button>
                </div>
                <p class="heading">
                  <strong>Customer</strong>
                </p>
                <p class="content">
                  <strong>
                    <a href="edit-customer.html">Vimal Raj</a>
                  </strong>
                  <br />
                  <code>vimalraj@gmail.com</code>
                  <br />
                  55 Long Bridge road
                  <br />
                  78170 Los Angeles
                  <br />Uinted States
                </p>
                <br />
              </div>
              <div class="column">
                <p class="heading">
                  <strong>Books</strong>
                </p>
                <table class="table is-bordered is-fullwidth">
                  <thead>
                    <tr>
                      <th class="is-narrow">Cover</th>
                      <th>Title</th>
                      <th class="has-text-right is-narrow">Price</th>
                      <th class="has-text-right is-narrow">Amount</th>
                      <th class="has-text-right is-narrow">Total</th>
                    </tr>
                  </thead>
                  <tfoot>
                    <tr>
                      <th colspan="5" class="has-text-right">$42.98</th>
                    </tr>
                  </tfoot>
                  <tbody>
                    <tr>
                      <td>
                        <!-- <img src="./images/transflow.jpg" width="40" /> -->
                      </td>
                      <td>
                        <a href="new-book.html"
                          ><strong
                            >TensorFlow For Machine Intelligence</strong
                          ></a
                        >
                      </td>
                      <td class="has-text-right">$22.99</td>
                      <td class="has-text-right">
                        <input
                          type="number"
                          value="1"
                          maxlength="2"
                          class="input is-small"
                          max="2"
                        />
                      </td>
                      <td class="has-text-right">$22.99</td>
                    </tr>
                    <tr>
                      <td>
                        <!-- <img src="./images/js.jpg" width="40" /> -->
                      </td>
                      <td>
                        <a href="new-book.html"
                          ><strong>Choosing a Javascript Framework</strong></a
                        >
                      </td>
                      <td class="has-text-right">$19.99</td>
                      <td class="has-text-right">
                        <input
                          type="number"
                          value="1"
                          maxlength="2"
                          class="input is-small"
                          max="2"
                        />
                      </td>
                      <td class="has-text-right">$19.99</td>
                    </tr>
                    <tr>
                      <td colspan="5">
                        <div class="field is-grouped is-grouped-right">
                          <div class="control">
                            <div class="select is-small">
                              <select>
                                <option class="is-capitalized"
                                  >TensorFlow For Machine Intelligence</option
                                >
                                <option class="is-capitalized"
                                  >Docker In Production</option
                                >
                                <option class="is-capitalized"
                                  >Developing A Gulp.js Edge</option
                                >
                                <option class="is-capitalized"
                                  >Learning Swift</option
                                >
                                <option class="is-capitalized"
                                  >Choosing A Javascript Framework
                                </option>
                                <option class="is-capitalized"
                                  >Deconstructing Google Cardboard Apps</option
                                >
                              </select>
                            </div>
                          </div>
                          <div class="control">
                            <input
                              type="number"
                              value="1"
                              maxlength="2"
                              class="input is-small"
                              max="2"
                              placeholder="Amount"
                            />
                          </div>
                          <div class="control">
                            <a class="button is-small is-link">Add book</a>
                          </div>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Header from "@/components/Header";
import Menu from "@/components/Menu";
import { toastMixin } from "@/toastMixin";
import { mapState } from "vuex";
import orders from "@/services/orders";
// import _ from "lodash";

export default {
  data() {
    return {
      orderData: {},
      orderDate: ""
    };
  },
  async created() {
    try {
      this.orderData = await orders.getOrder(Number(this.orderId));
      const date = this.orderData.data.date;
      var months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
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
      this.orderDate = dateFormat;
    } catch (e) {
      console.log(e);
    }
  },
  mixins: [toastMixin],
  props: {
    orderId: {
      type: [Number, String],
      required: true
    }
  },
  components: {
    Header,
    Menu
  },
  computed: {
    ...mapState(["currUser", "currentPage", "noOfCustomers", "custOrderLimit"]),
    curPageNum() {
      return Math.ceil(Number(this.noOfCustomers) / this.custOrderLimit);
    },
    btnLoad() {
      return this.btnLoading;
    }
  },
  methods: {}
};
</script>

<style lang="scss" scoped></style>
