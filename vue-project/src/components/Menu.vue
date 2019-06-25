<template>
  <nav class="menu">
    <div class="menu-label">Menu</div>
    <div class="menu-list">
      <a
        href="dashboard.html"
        :class="currentPage === 'dashboard' ? 'is-active' : ''"
      >
        <span class="icon">
          <i class="fa fa-tachometer"></i>
        </span>
        DashBoard
      </a>
      <router-link
        :to="{ name: 'books', params: { currPageNumber: 1 } }"
        :class="currentPage === 'Books' ? 'is-active' : ''"
      >
        <span class="icon">
          <i class="fa fa-book"></i>
        </span>
        Books
      </router-link>
      <router-link
        :to="{ name: 'customers', params: { currPageNumber: 1 } }"
        :class="currentPage === 'Customers' ? 'is-active' : ''"
      >
        <span class="icon">
          <i class="fa fa-address-book"></i>
        </span>
        Customers
      </router-link>
      <a
        href="orders.html"
        :class="currentPage === 'orders' ? 'is-active' : ''"
      >
        <span class="icon">
          <i class="fa fa-file-text-o"></i>
        </span>
        Orders
      </a>
    </div>
  </nav>
</template>

<script>
export default {
  props: {
    currentPage: {
      required: true,
      type: String
    }
  }
};
</script>

<style lang="scss" scoped></style>
