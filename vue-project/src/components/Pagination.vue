<template>
  <div>
    <nav v-show="currentPage === 'Books'" class="pagination">
      <router-link
        v-show="currPageNumber != 1"
        class="pagination-previous btn-width-90"
        :to="{ name: 'books', params: { currPageNumber: currPageNumber - 1 } }"
        >Previous</router-link
      >
      <router-link
        v-show="currPageNumber != noOfPage"
        class="pagination-next btn-width-90"
        :to="{ name: 'books', params: { currPageNumber: currPageNumber + 1 } }"
        >Next</router-link
      >
      <ul class="pagination-list">
        <li v-for="N in noOfPage" :key="N">
          <router-link
            :to="{ name: 'books', params: { currPageNumber: N } }"
            class="pagination-link"
            :class="currPageNumber == N ? 'is-current' : ''"
            >{{ N }}</router-link
          >
        </li>
      </ul>
    </nav>
    <nav v-show="currentPage === 'Customers'" class="pagination">
      <router-link
        v-show="currPageNumber != 1"
        class="pagination-previous btn-width-90"
        :to="{
          name: 'customers',
          params: { currPageNumber: currPageNumber - 1 }
        }"
        >Previous</router-link
      >
      <router-link
        v-show="currPageNumber != noOfPage && count != 0"
        class="pagination-next btn-width-90"
        :to="{
          name: 'customers',
          params: { currPageNumber: currPageNumber + 1 }
        }"
        >Next</router-link
      >
      <ul class="pagination-list">
        <li v-for="N in noOfPage" :key="N">
          <router-link
            :to="{ name: 'customers', params: { currPageNumber: N } }"
            class="pagination-link"
            :class="currPageNumber == N ? 'is-current' : ''"
            >{{ N }}</router-link
          >
        </li>
      </ul>
    </nav>
  </div>
</template>

<script>
export default {
  props: {
    pageLimit: {
      required: true,
      type: [Number, String]
    },
    count: {
      required: true,
      type: [Number, String]
    },
    currPageNumber: {
      required: true,
      type: [Number, String]
    },
    currentPage: {
      type: String,
      required: true
    }
  },
  computed: {
    noOfPage() {
      return Math.ceil(this.count / this.pageLimit);
    }
  }
};
</script>
<style lang="scss" scoped></style>
