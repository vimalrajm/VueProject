<template>
  <nav class="level">
    <div class="level-right">
      <div class="level-item">
        <p class="subtitle">
          <span class="has-text-weight-bold">{{
            count === undefined ? 0 : count
          }}</span>
          {{ getcurrentPage }}
        </p>
      </div>
      <div class="level-item">
        <p>
          <router-link
            v-show="getcurrentPage === 'Books'"
            :to="{ name: 'createBook', params: { bookDetail: 'new' } }"
            class="button is-success"
            >New</router-link
          >
          <router-link
            v-show="getcurrentPage === 'Customers'"
            :to="{ name: 'addCustomer', params: { customerDetail: 'new' } }"
            class="button is-success"
            >New</router-link
          >
        </p>
      </div>
      <div class="level-item">
        <p class="control">
          <input class="input" type="text" :placeholder="placeHolder" />
        </p>
        <button class="button">Search</button>
      </div>
    </div>
    <div v-show="getcurrentPage === 'Books'" class="level-right">
      <div class="level-item">Order by</div>
      <div class="level-item">
        <div class="select">
          <select>
            <option value="1">Publish date</option>
            <option value="2">Price</option>
            <option value="3">Page count</option>
          </select>
        </div>
      </div>
    </div>
    <div v-show="getcurrentPage === 'Customers'" class="level-right">
      <div class="level-item">
        <p><strong>All</strong></p>
      </div>
      <div class="level-item">
        <p><a>With orders</a></p>
      </div>
      <div class="level-item">
        <p><a>Without orders</a></p>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  props: {
    count: {
      type: [String, Number]
    },
    placeHolder: {
      type: [String]
    },
    currentPage: {
      type: [String],
      required: true
    }
  },
  computed: {
    getcurrentPage() {
      return this.currentPage;
    }
  }
};
</script>

<style lang="scss" scoped></style>
