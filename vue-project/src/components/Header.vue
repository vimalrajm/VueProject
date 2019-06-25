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
        <div class="navbar-item"></div>
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
  </nav>
</template>
<script>
export default {
  props: {
    currUser: {
      required: true,
      type: Object
    }
  },
  data() {
    return {};
  }
};
</script>
<style lang="scss" scoped>
.navWidth {
  min-width: 120px;
}
</style>
