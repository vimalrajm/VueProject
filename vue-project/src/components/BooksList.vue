<template>
  <div class="columns is-multiline">
    <div v-for="book in books" :key="book.bookName" class="column is-6">
      <div class="box">
        <div class="media">
          <aside class="media-left">
            <img :src="require(`@/assets/${book.image}`)" width="100" />
          </aside>
          <div class="media-content">
            <p class="has-text-link">
              <span class="title is-capitalized has-text-link">{{
                book.bookName
              }}</span>
            </p>
            <h3 class="has-text-weight-semibold">
              ${{ book.bookPrice }}
              <br />
              {{ book.bookPages }} pages
              <br />
              ISBN: {{ book.bookISBN }}
              <br />
              <router-link
                v-show="currUser.role === 'admin'"
                :to="{ name: 'createBook', params: { bookDetail: book.id } }"
                class="has-text-link"
                >Edit</router-link
              >
              <span v-show="currUser.role === 'admin'"> | </span>
              <a v-show="currUser.role === 'admin'" @click="deleteBook(book)"
                >Delete</a
              >

              <div v-show="currUser.role === 'customer'">
                <a @click="cart(book, currUser)">
                  <span class="is-pulled-right has-text-info">
                    Order<i class="fa fa-cart-plus"></i>
                  </span>
                </a>
                <span
                  class="is-pulled-left has-text-info is-pulled-right"
                  style="padding-right: 10px"
                >
                  Quantity
                  <input
                    class="input"
                    type="number"
                    @input="quantityCall"
                    v-model="book.qty"
                    min="1"
                    max="5"
                    style="width:70px"
                  />
                </span>
              </div>
            </h3>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import books from "@/services/books.js";
import orders from "@/services/orders.js";
import { mapActions } from "vuex";
import { toastMixin } from "@/toastMixin";
import _ from "lodash";

export default {
  props: {
    pageLimit: {
      type: [String, Number],
      required: true
    },
    currPageNumber: {
      type: [Number, String],
      required: true
    },
    currUser: {
      type: Object,
      required: true
    }
  },
  mixins: [toastMixin],
  data() {
    return {
      books: {},
      bookCount: 0,
      nonRemovedItem: []
    };
  },
  methods: {
    ...mapActions(["setNoOfBooks"]),
    quantityCall(event) {
      this.$emit("input", event.target.value);
    },
    qtyChange(book, event) {
      console.log(event.target.value);
      _.find(this.books, o => {
        if (o.id === book.id) {
          o.qty = event.target.value;
        }
      });
      console.log(JSON.stringify(this.books));
    },
    async deleteBook(book) {
      if (this.currUser.userId !== book.addedBy) {
        this.toast(
          "is-danger",
          "Don't have permision to delete the book",
          "is-top"
        );
      } else {
        this.$dialog.confirm({
          title: "Deleting book",
          message: `Are you sure you want to remove <b>${
            book.bookName
          }</b> book.`,
          confirmText: "Delete",
          type: "is-danger",
          iconPack: "fa",
          icon: "exclamation-triangle",
          size: "is-small",
          hasIcon: true,
          onConfirm: () => {
            this.delete(book);
          }
        });
      }
    },
    cart(book, currUser) {
      console.log(JSON.stringify(book), currUser);
      this.$dialog.confirm({
        title: "Add to cart",
        message: `Are you sure you want to add <b>${
          book.bookName
        }</b> book to the cart.`,
        confirmText: "Add",
        type: "is-success",
        iconPack: "fa",
        size: "is-small",
        hasIcon: true,
        onConfirm: () => {
          this.addToCart(book, currUser);
        }
      });
    },
    async addToCart(book, currUser) {
      try {
        let response;
        response = await orders.addToCart(book.id, currUser.id, book.qty);
        if (response.status === 201) {
          this.toast("is-success", "Book added to cart", "is-top");
          this.$emit("input", 1);
        }
      } catch (e) {
        console.log(e);
        this.toast(
          "is-danger",
          "Some thing went wrong while adding to cart",
          "is-top"
        );
      }
    },
    async delete(book) {
      try {
        let res;
        res = await books.deleteBook(book);
        if (res.status === 200) {
          this.toast("is-success", "Book removed succesfully", "is-top");
          if (this.books.length === 1 && this.currPageNumber !== 1) {
            this.$router.push({
              name: "books",
              params: {
                currPageNumber: this.currPageNumber - 1
              }
            });
          } else {
            this.books.forEach(bookVal => {
              if (bookVal.id !== book.id) {
                this.nonRemovedItem.push(bookVal);
              }
            });
            this.books = this.nonRemovedItem;
            this.nonRemovedItem = [];
          }
        }
        res = await books.getBooks(this.currPageNumber, this.pageLimit);
        this.books = res.data;
        this.bookCount = res.headers["x-total-count"];
        this.$store.dispatch("setNoOfBooks", this.bookCount);
      } catch (e) {
        console.log(e);
        this.toast("is-danger", "Some thing went wrong", "is-top");
      }
    }
  },
  async created() {
    try {
      let response;
      response = await books.getBooks(this.currPageNumber, this.pageLimit);
      this.books = response.data;
      this.bookCount = response.headers["x-total-count"];
    } catch (e) {
      console.log(e);
    }
    this.setNoOfBooks(this.bookCount);
  }
};
</script>

<style lang="scss" scoped>
.field {
  width: 80px;
}

input .input {
  padding-left: 0.25em;
}
</style>
