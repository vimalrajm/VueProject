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
          <div class="navbar-link navWidth">{{ currUser.name }}</div>
          <div class="navbar-dropdown">
            <a class="navbar-item">
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
    <div class="modal" :class="activeModal">
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
          </vueTable>
        </section>
        <footer class="modal-card-foot">
          <button class="button is-success" @click="createOrder">
            Place Order
          </button>
          <button class="button" @click="closeCartModal">Cancel</button>
        </footer>
      </div>
    </div>
  </nav>
</template>
<script>
import orders from "@/services/orders.js";
import books from "@/services/books.js";
import _ from "lodash";
import vueTable from "vuetable-2";

export default {
  components: {
    vueTable
  },
  props: {
    currUser: {
      required: true,
      type: Object
    }
  },
  data() {
    return {
      activeModal: "",
      cartData: [],
      headers: [
        {
          name: "SI NO",
          title: "SI NO",
          width: "5%"
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
        }
      ]
    };
  },
  methods: {
    async createOrder() {},
    async openCartModal(currUser) {
      this.activeModal = "is-active";
      try {
        await orders.getCart().then(res => {
          console.log("vimal", JSON.stringify(res.data));
          console.log("currUser", JSON.stringify(currUser));
          _.find(res.data, o => {
            console.log("o", o);
            if (o.custId === currUser.id) {
              console.log("in");
              books.getABook(o.bookId).then(res => {
                console.log("inin", JSON.stringify(res.data));
                res.data.qty = o.qty;
                this.cartData.push(res.data);
                let result = _(this.cartData).groupBy("bookId");
                console.log("result " + JSON.stringify(result));
              });
            }
          });
        });
      } catch (e) {
        console.log(e);
      }
    },
    closeCartModal() {
      this.activeModal = "";
      this.cartData = [];
    }
  }
};
</script>
<style lang="scss" scoped>
.navWidth {
  min-width: 120px;
}
</style>
