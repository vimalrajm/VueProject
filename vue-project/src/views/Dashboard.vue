<template>
  <div class="hero is-small">
    <Header :currUser="currUser"></Header>
    <div class="hero-body">
      <div class="columns">
        <div class="column is-2">
          <Menu :currentPage="currentPage"></Menu>
        </div>
        <DashboardView :currUser="currUser"></DashboardView>
      </div>
    </div>
  </div>
</template>

<script>
import Header from "@/components/Header";
import Menu from "@/components/Menu";
import DashboardView from "@/components/DashboardView";
import { mapState } from "vuex";

export default {
  beforeCreate() {
    this.$store.dispatch("setCurrPage", "Dashboard");
  },
  components: {
    Header,
    Menu,
    DashboardView
  },
  computed: {
    ...mapState(["currUser", "currentPage"])
  }
};
</script>
<style scoped></style>
