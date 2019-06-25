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
            </h3>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import books from "@/services/books.js";
import { mapActions } from "vuex";
import { toastMixin } from "@/toastMixin";

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
          confirmText: "Delete Account",
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
    async delete(book) {
      try {
        await books.deleteBook(book).then(res => {
          if (res.status === 200) {
            this.toast("is-success", "Book removed succesfully", "is-top");
            if (this.books.length === 1) {
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
        });
      } catch (e) {
        console.log(e);
        this.toast("is-danger", "Some thing went wrong", "is-top");
      }
    }
  },
  async created() {
    try {
      await books
        .getBooks(this.currPageNumber, this.pageLimit)
        .then(response => {
          this.books = response.data;
          this.bookCount = response.headers["x-total-count"];
        });
    } catch (e) {
      console.log(e);
    }
    this.setNoOfBooks(this.bookCount);
  }
};
</script>

<style lang="scss" scoped></style>
