<template>
  <nav class="navbar has-shadow">
    <div class="navbar-brand">
      <a class="navbar-item image is-64x64">
        <img src="@/assets/logo.jpg" />
      </a>
    </div>
    <div class="navbar-menu">
      <div class="navbar-start">
        <p class="navbar-item">
          <small>Publishing the speed of the technology</small>
        </p>
      </div>
      <hr />
      <div class="navbar-end">
        <div
          v-show="currUser.role === 'customer'"
          class="navbar-item has-text-dark"
          @click="openCartModal(currUser)"
          style="cursor: pointer"
        >
          <span class="icon is-medium">
            <i class="fa fa-shopping-cart fa-lg"> </i>
          </span>
          Cart
        </div>
        <div class="navbar-item has-dropdown is-hoverable">
          <div class="navbar-link navWidth is-capitalized">
            {{ currUser.name }}
          </div>
          <div class="navbar-dropdown">
            <a class="navbar-item" @click="profileModal">
              <div>
                <span class="icon is-small">
                  <i class="fa fa-user-circle-o"></i>
                </span>
                Profile
              </div>
            </a>
            <a class="navbar-item">
              <div>
                <span class="icon is-small">
                  <i class="fa fa-bug"></i>
                </span>
                Report Bug
              </div>
            </a>
            <router-link class="navbar-item" :to="{ name: 'login' }">
              <div>
                <span class="icon is-small">
                  <i class="fa fa-sign-out"></i>
                </span>
                Sign Out
              </div>
            </router-link>
          </div>
        </div>
      </div>
    </div>
    <transition name="slide-fade">
      <div
        class="modal is-small"
        v-if="activeModal !== ''"
        :class="activeModal"
      >
        <div class="modal-background"></div>
        <div class="modal-card">
          <header class="modal-card-head">
            <p class="modal-card-title">Cart items</p>
            <button
              class="delete has-background-danger"
              aria-label="close"
              @click="closeCartModal"
            ></button>
          </header>
          <section class="modal-card-body">
            <vueTable :api-mode="false" :fields="headers" :data="cartData">
              <div slot="SI NO" slot-scope="props" class="has-text-dark">
                {{ props.rowIndex + 1 }}
              </div>
              <div slot="bookName" class="has-text-dark" slot-scope="props">
                {{ props.rowData.bookName }}
              </div>
              <div slot="qty" class="has-text-dark" slot-scope="props">
                {{ props.rowData.qty }}
              </div>
              <div
                slot="actions"
                slot-scope="props"
                class="delete"
                @click="removeBook(props.rowData.cartId)"
              >
                <span class="icon has-text-danger button">
                  <i class="fa fa-remove"></i>
                </span>
              </div>
            </vueTable>
          </section>
          <footer class="modal-card-foot">
            <button
              class="button is-success"
              @click="createOrder"
              :disabled="cartLength === 0 ? true : false"
            >
              Place Order
            </button>
            <button class="button" @click="closeCartModal">Cancel</button>
            <button
              class="button is-danger"
              @click="clearCart"
              :disabled="cartLength === 0 ? true : false"
            >
              Clear Cart
            </button>
          </footer>
        </div>
      </div>
    </transition>
    <!-- <transition name="slide-fade">
      <div
        class="modal is-small"
        v-if="activeProfile !== ''"
        :class="activeProfile"
      >
        <div class="modal-background"></div>
        <div class="modal-card">
          <header class="modal-card-head">
            <p class="modal-card-title">Profile Details</p>
            <button
              class="delete has-background-danger"
              aria-label="close"
              @click="closeCartModal"
            ></button>
          </header>
          <section class="modal-card-body">
            <vueTable :api-mode="false" :fields="headers" :data="cartData">
              <div slot="SI NO" slot-scope="props" class="has-text-dark">
                {{ props.rowIndex + 1 }}
              </div>
              <div slot="bookName" class="has-text-dark" slot-scope="props">
                {{ props.rowData.bookName }}
              </div>
              <div slot="qty" class="has-text-dark" slot-scope="props">
                {{ props.rowData.qty }}
              </div>
              <div
                slot="actions"
                slot-scope="props"
                class="delete"
                @click="removeBook(props.rowData.cartId)"
              >
                <span class="icon has-text-danger button">
                  <i class="fa fa-remove"></i>
                </span>
              </div>
            </vueTable>
          </section>
          <footer class="modal-card-foot">
            <button
              class="button is-success"
              @click="createOrder"
              :disabled="cartLength === 0 ? true : false"
            >
              Place Order
            </button>
            <button class="button" @click="closeCartModal">Cancel</button>
            <button
              class="button is-danger"
              @click="clearCart"
              :disabled="cartLength === 0 ? true : false"
            >
              Clear Cart
            </button>
          </footer>
        </div>
      </div>
    </transition> -->
  </nav>
</template>
<script>
import orders from "@/services/orders.js";
import books from "@/services/books.js";
import { toastMixin } from "@/toastMixin";
import _ from "lodash";
import vueTable from "vuetable-2";
import OrderData from "@/services/dataServices/orderData";
import customers from "@/services/customers";

export default {
  mixins: [toastMixin],
  components: {
    vueTable
  },
  computed: {
    cartLength() {
      return this.cartData.length;
    }
  },
  props: {
    currUser: {
      required: true,
      type: Object
    }
  },
  data() {
    return {
      show: true,
      activeModal: "",
      cartData: [],
      activeProfile: "",
      headers: [
        {
          name: "SI NO",
          title: "SI NO",
          width: "3%"
        },
        {
          name: "bookName",
          title: "BOOKS",
          width: "15%"
        },
        {
          name: "qty",
          title: "QUANTITY",
          width: "1%"
        },
        {
          name: "actions",
          title: "ACTIONS",
          width: "2%"
        }
      ]
    };
  },
  methods: {
    profileModal() {
      this.activeProfile = "is-active";
    },
    async createOrder() {
      try {
        let orderId = Math.floor(Math.random() * 10000000);
        let bookCount = 0;
        let totalCost = 0;
        let bookIdQty = [];
        const date = new Date();
        const orderData = new OrderData(
          orderId,
          this.currUser.id,
          date,
          null,
          "In Progress",
          null,
          null
        );
        this.cartData.forEach(data => {
          bookCount = bookCount + Number(data.qty);
          totalCost = totalCost + Number(data.qty) * Number(data.bookPrice);
          bookIdQty.push({
            bookId: data.id,
            qty: data.qty
          });
        });
        orderData.bookCount = bookCount;
        orderData.totalCost = totalCost;
        orderData.bookIdQty = bookIdQty;
        let res = await orders.createOrder(orderData);
        if (res.status === 201) {
          this.activeModal = "";
          this.toast("is-success", "Order placed successful", "is-top");
          this.clearCart();
          let responseData = await customers.updateOrder(
            this.currUser.orders + 1,
            this.currUser
          );
          this.$store.dispatch("setCurrUser", responseData.data);
        }
      } catch (e) {
        console.log(e);
      }
    },
    async openCartModal(currUser) {
      this.activeModal = "is-active";
      try {
        let res;
        res = await orders.getCart();
        for (let o of res.data) {
          if (o.custId === currUser.id) {
            let book = await books.getABook(o.bookId);
            book.data.qty = o.qty;
            book.data.cartId = o.id;
            this.cartData.push(book.data);
          }
        }
      } catch (e) {
        console.log(e);
      }
    },
    closeCartModal() {
      this.activeModal = "";
      this.cartData = [];
      this.activeProfile = "";
    },
    async removeBook(cartId) {
      let data = [];
      let res = await orders.removeBookFromCart(cartId);
      if (res.status === 200) {
        _.find(this.cartData, o => {
          if (o.cartId !== cartId) {
            data.push(o);
          }
        });
        this.cartData = data;
      }
    },
    async clearCart() {
      try {
        let res;
        res = await orders.getCart();
        for (let o of res.data) {
          if (o.custId === this.currUser.id) {
            let order = await orders.removeBookFromCart(o.id);
            if (!order.status === 200) {
              this.toast("is-danger", "Something went wrong", "is-top");
            }
          }
          this.cartData = [];
        }
      } catch (e) {
        console.log(e);
        this.toast("is-danger", "Something went wrong", "is-top");
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.navWidth {
  min-width: 120px;
}
.modal-card {
  max-height: 450px;
}

.delete {
  margin-left: 20px;
}

.slide-fade-enter-active {
  transition: all 0.3s ease;
}
.slide-fade-leave-active {
  transition: all 0.5s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-fade-enter, .slide-fade-leave-to
/* .slide-fade-leave-active below version 2.1.8 */ {
  transform: translateX(10px);
  opacity: 0;
}
</style>
