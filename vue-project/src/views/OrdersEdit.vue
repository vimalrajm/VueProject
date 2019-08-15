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
                    :disabled="currUser.role === 'customer' ? true : false"
                    @click.prevent="setStatus('In Progress')"
                  >
                    In Progress
                  </button>
                  <button
                    class="is-success is-small button"
                    :class="
                      orderData.status === 'Successful' ? '' : 'is-outlined'
                    "
                    :disabled="currUser.role === 'customer' ? true : false"
                    @click.prevent="setStatus('Successful')"
                  >
                    Successful
                  </button>
                  <button
                    class="is-danger is-small button"
                    :disabled="currUser.role === 'customer' ? true : false"
                    :class="orderData.status === 'Failed' ? '' : 'is-outlined'"
                    @click.prevent="setStatus('Failed')"
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
                        placeholder="Select a book"
                      >
                      </MultiSelect>
                      <span class="control ">
                        <input
                          v-model="bookQty"
                          type="number"
                          value="1"
                          maxlength="2"
                          min="1"
                          class="input is-small"
                          max="5"
                          placeholder="Amount"
                          style="width: 60px; height: 38px; margin-right: -190px; margin-left: 30px"
                        />
                      </span>
                      <span class="control is-pulled-right">
                        <button
                          class="button is-small is-link"
                          style="width: 80px; height: 38px;"
                          @click.prevent="confirmBookAdd"
                          :class="isLoading"
                          :disabled="
                            orderData.status === 'Successful' ? true : false
                          "
                        >
                          Add Book
                        </button>
                      </span>
                    </td>
                  </tr>
                  <tr style="border: 1px solid #dbdbdb;">
                    <td style="height:50px;">
                      <label class="has-text-right has-text-weight-bold label"
                        >${{ getTotal }}</label
                      >
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
import _ from "lodash";

export default {
  data() {
    return {
      orderData: {},
      orderDate: "",
      orderedBy: {},
      bookQty: 1,
      books: [],
      allBooks: [],
      bookSelected: [],
      bookList: [],
      isLoading: "",
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
      let book = [];
      for (let data of this.orderData.bookIdQty) {
        book = await books.getABook(data.bookId);
        this.total =
          this.total + Number(book.data.bookPrice) * Number(data.qty);
        book.data.qty = data.qty;
        this.books.push(book.data);
      }
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
    },
    getTotal() {
      if (this.orderData.totalCost !== undefined) {
        return this.orderData.totalCost.toFixed(2);
      } else {
        return 0;
      }
    }
  },
  methods: {
    async orderStatus(status) {
      try {
        this.orderData.status = status;
        let res = await orders.updateOrder(this.orderData);
        if (res.status === 200) {
          this.toast("is-success", "Order status set successful", "is-top");
          ({ data: this.orderData } = await orders.getOrder(
            Number(this.orderId)
          ));
        } else {
          this.toast(
            "is-danger",
            "Spmething went wrong while updating status to the order",
            "is-top"
          );
        }
      } catch (e) {
        console.log(e);
      }
    },
    setStatus(status) {
      this.$dialog.confirm({
        title: "Order book",
        message: `Are you sure you want to set <b> ${status} </b> status to current order`,
        confirmText: "Set",
        type: "is-warning",
        iconPack: "fa",
        icon: "exclamation-triangle",
        size: "is-small",
        hasIcon: true,
        onConfirm: () => {
          this.orderStatus(status);
        }
      });
    },
    async addBook() {
      try {
        let bookPrice = 0;
        this.isLoading = "is-loading";
        this.orderData.bookIdQty.push({
          bookId: this.bookSelected.id,
          qty: this.bookQty
        });
        this.orderData.numberOfBooks =
          Number(this.orderData.numberOfBooks) + Number(this.bookQty);
        _.find(this.bookList, book => {
          if (book.id === this.bookSelected.id) {
            bookPrice = Number(book.bookPrice) * this.bookQty;
          }
        });
        this.orderData.totalCost = Number(this.orderData.totalCost) + bookPrice;
        let res = await orders.updateOrder(this.orderData);
        if (res.status === 200) {
          this.toast(
            "is-success",
            "book added successfully to current order",
            "is-top"
          );
          ({ data: this.orderData } = await orders.getOrder(
            Number(this.orderId)
          ));
          ({ data: this.bookList } = await books.getAllBooks());
          let book = [];
          this.books = [];
          for (let data of this.orderData.bookIdQty) {
            book = await books.getABook(data.bookId);
            this.total =
              this.total + Number(book.data.bookPrice) * Number(data.qty);
            book.data.qty = data.qty;
            this.books.push(book.data);
          }
          this.bookSelected = [];
          this.bookQty = 1;
        } else {
          this.toast(
            "is-danger",
            "Spmething went wrong while adding book to the order",
            "is-top"
          );
        }
        this.isLoading = "";
      } catch (e) {
        console.log(e);
      }
    },
    confirmBookAdd() {
      this.$dialog.confirm({
        title: "Order book",
        message: `Are you sure you want to add <b> 
        ${this.bookSelected.bookName} </b> book of <b>
        ${this.bookQty} </b> quantity to current order`,
        confirmText: "Add",
        type: "is-warning",
        iconPack: "fa",
        icon: "exclamation-triangle",
        size: "is-small",
        hasIcon: true,
        onConfirm: () => {
          this.addBook();
        }
      });
    }
  }
};
</script>
<style scoped>
div >>> .table thead th {
  border: 1px solid #dbdbdb !important;
}
div >>> .table tr td {
  border: 1px solid #dbdbdb !important;
}
.tableBorder {
  border: 1px solid #dbdbdb;
  border-top: 0px solid #dbdbdb;
}
td {
  width: 1000px;
  height: 70px;
  padding: 15px;
}
div >>> .multiselect__select:before {
  border-color: white;
  display: none;
}
</style>
