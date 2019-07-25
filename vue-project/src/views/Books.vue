<template>
  <div class="hero is-small">
    <Header :currUser="currUser"></Header>
    <div class="hero-body">
      <div class="columns">
        <div class="column is-2">
          <Menu :currentPage="currentPage"></Menu>
        </div>
        <div class="column is-10">
          <h1 class="title">Books</h1>
          <BooksNavBar
            :count="noOfBooks"
            :placeHolder="placeholder"
            :currentPage="currentPage"
            :currUser="currUser"
          ></BooksNavBar>
          <BooksList
            v-show="Number(noOfBooks)"
            :pageLimit="pageLimit"
            :currPageNumber="currPageNumber"
            :currUser="currUser"
          ></BooksList>
          <div v-show="!Number(noOfBooks)" class="columns is-multiline">
            <div class="column is-12">
              <div class="field has-text-centered">
                No data found
              </div>
            </div>
          </div>
          <pagination
            v-show="Number(noOfBooks)"
            :pageLimit="pageLimit"
            :count="noOfBooks"
            :currPageNumber="currPageNumber"
            :currentPage="currentPage"
          ></pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Header from "@/components/Header.vue";
import Menu from "@/components/Menu.vue";
import BooksNavBar from "@/components/NavBar.vue";
import BooksList from "@/components/BooksList.vue";
import Pagination from "@/components/Pagination.vue";
import { mapState } from "vuex";
export default {
  props: {
    currPageNumber: {
      require: true,
      type: [Number, String]
    }
  },
  created() {
    this.$store.dispatch("setCurrPage", "Books");
  },
  components: {
    Header,
    Menu,
    BooksNavBar,
    BooksList,
    Pagination
  },
  computed: {
    ...mapState(["currUser", "currentPage", "noOfBooks", "pageLimit"])
  },
  data() {
    return {
      placeholder: "Book name, ISBN"
    };
  }
};
</script>

<style lang="scss" scoped></style>
