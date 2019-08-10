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
                  <button
                    class="is-warning is-small button"
                    :class="
                      orderData.status === 'In Progress' ? '' : 'is-outlined'
                    "
                  >
                    In Progress
                  </button>
                  <button
                    class="is-success is-small button"
                    :class="
                      orderData.status === 'Successful' ? '' : 'is-outlined'
                    "
                  >
                    Successful
                  </button>
                  <button
                    class="is-danger is-small button"
                    :class="orderData.status === 'Failed' ? '' : 'is-outlined'"
                  >
                    Failed
                  </button>
                </div>
                <p class="heading">
                  <strong>Customer</strong>
                </p>
                <p class="content">
                  <strong>
                    <router-link
                      :to="{
                        name: 'addCustomer',
                        params: { customerDetail: orderedBy.id }
                      }"
                      class="is-capitalized"
                      >{{ orderedBy.name }}</router-link
                    >
                  </strong>
                  <br />
                  <code>{{ orderedBy.email }}</code>
                  <br />
                  <span v-for="address in orderedBy.address" :key="address"
                    >{{ address }},
                  </span>
                  <br />
                  {{ orderedBy.city }}, {{ orderedBy.zipcode }},
                  <br />
                  {{ orderedBy.country }}.
                </p>
                <br />
              </div>
              <div class="column">
                <p class="heading">
                  <strong>Books</strong>
                </p>
                <VueTable :api-mode="false" :fields="headers" :data="books">
                  <div slot="image" slot-scope="props">
                    <img
                      :src="require(`@/assets/${props.rowData.image}`)"
                      :alt="props.rowData.image"
                      width="40"
                    />
                  </div>
                  <div slot="bookName" slot-scope="props" disabled>
                    <router-link
                      :to="{
                        name: 'addCustomer',
                        params: { customerDetail: props.rowData.id }
                      }"
                      :event="currUser.role === 'customer' ? '' : 'click'"
                      >{{ props.rowData.bookName }}</router-link
                    >
                  </div>
                  <div slot="total" slot-scope="props">
                    {{
                      (
                        Number(props.rowData.qty) *
                        Number(props.rowData.bookPrice)
                      ).toFixed(2)
                    }}
                  </div>
                </VueTable>
                <table class="tableBorder">
                  <tr>
                    <td class="has-text-centered ">
                      <MultiSelect
                        class="select is-small"
                        style="min-width: 200px;max-width: 350px"
                        v-model="bookSelected"
                        :options="bookList"
                        :clear-on-select="false"
                        :close-on-select="true"
                        :allow-empty="false"
                        label="bookName"
                        track-by="id"
                        :hide-selected="true"
                      >
                      </MultiSelect>
                      <span class="control ">
                        <input
                          type="number"
                          value="1"
                          maxlength="2"
                          class="input is-small"
                          max="5"
                          placeholder="Amount"
                          style="width: 60px; height: 38px; margin-right: -190px; margin-left: 30px"
                        />
                      </span>
                      <span class="control is-pulled-right">
                        <span
                          class="button is-small is-link"
                          style="width: 80px; height: 38px;"
                        >
                          Add Book
                        </span>
                      </span>
                    </td>
                  </tr>
                </table>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>

<script>
import Header from "@/components/Header";
import Menu from "@/components/Menu";
import { toastMixin } from "@/toastMixin";
import { mapState } from "vuex";
import orders from "@/services/orders";
import customers from "@/services/customers";
import books from "@/services/books";
import VueTable from "vuetable-2";
import MultiSelect from "vue-multiselect";
// import _ from "lodash";

export default {
  data() {
    return {
      orderData: {},
      orderDate: "",
      orderedBy: {},
      books: [],
      allBooks: [],
      bookSelected: [],
      bookList: [],
      headers: [
        {
          name: "image",
          title: "Cover",
          width: "10%"
        },
        {
          name: "bookName",
          title: "Title",
          width: "40%"
        },
        {
          name: "bookPrice",
          title: "Price",
          width: "10%"
        },
        {
          name: "qty",
          title: "Amount",
          width: "10%"
        },
        {
          name: "total",
          title: "Total",
          width: "5%"
        }
      ]
    };
  },
  async created() {
    try {
      ({ data: this.orderData } = await orders.getOrder(Number(this.orderId)));
      ({ data: this.bookList } = await books.getAllBooks());
      console.log("after destructuring", JSON.stringify(this.orderData));
      this.bookSelected.push(this.bookList[0]);
      console.log("boook", this.bookSelected);
      const date = this.orderData.date;
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
      ({ data: this.orderedBy } = await customers.getCustomer(
        this.orderData.custId
      ));
      console.log(JSON.stringify(this.orderedBy.data));
      let book = [];
      console.log("this.orderData.bookIdQty", this.orderData.bookIdQty);
      for (let data of this.orderData.bookIdQty) {
        book = await books.getABook(data.bookId);
        console.log("book-data", book.data);
        book.data.qty = data.qty;
        this.books.push(book.data);
      }
      console.log("books data", JSON.stringify(this.books));
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
    Menu,
    VueTable,
    MultiSelect
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
<style scoped>
div >>> .table thead th {
  border: 1px solid black !important;
}
div >>> .table tr td {
  border: 1px solid black !important;
}
.tableBorder {
  border: 1px solid black;
  border-top: 0px solid black;
}
td {
  width: 1000px;
  height: 70px;
  padding: 15px;
}
div >>> .multiselect__select:before {
  border-color: white;
}
</style>
