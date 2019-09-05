<template>
  <div class="column is-4-desktop">
    <div class="card animate">
      <div class="card-content">
        <h2 class="title is-4">
          Most popular books
        </h2>
        <div
          class="media"
          v-for="(book, index) in topThreeBooks"
          :key="book.id"
        >
          <div class="media-left is-marginless">
            <p class="number">{{ index + 1 }}</p>
            <img :src="require(`@/assets/${book.image}`)" width="40" />
          </div>
          <div class="media-left"></div>
          <div class="media-content">
            <p class="title is-6 is-spaced is-marginless">
              <router-link
                v-if="currUser.role === 'admin'"
                :to="{ name: 'createBook', params: { bookDetail: book.id } }"
              >
                {{ book.name }}
              </router-link>
              <label v-else class="not-allowed has-text-link">
                {{ book.name }}
              </label>
            </p>
          </div>
          <div class="media-right">{{ book.qty }} sold</div>
        </div>
        <router-link
          :to="{ name: 'books', params: { currPageNumber: 1 } }"
          class="button is-link is-outlined"
        >
          View all books
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import bookService from "@/services/books";
import { mapState } from "vuex";
import orders from "@/services/orders";

export default {
  data() {
    return {
      bookData: [],
      topThreeBooks: []
    };
  },
  async created() {
    let books, order;
    ({ data: books } = await bookService.getAllBooks());
    books.forEach(book => {
      this.bookData.push({
        id: book.id,
        qty: 0,
        name: book.bookName,
        image: book.image
      });
    });
    ({ data: order } = await orders.getAllOrders());
    order.forEach(orderData => {
      orderData.bookIdQty.forEach(orderedBook => {
        this.bookData.forEach(book => {
          if (book.id === orderedBook.bookId) {
            book.qty += Number(orderedBook.qty);
          }
        });
      });
    });
    this.bookData.sort((a, b) => {
      return a.qty - b.qty;
    });
    for (let i = this.bookData.length - 1; i > this.bookData.length - 4; i--) {
      this.topThreeBooks.push(this.bookData[i]);
    }
  },
  computed: {
    ...mapState(["currUser"])
  }
};
</script>
<style lang="scss" scoped></style>
