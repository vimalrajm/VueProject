<template>
  <div class="field" :class="position">
    <button :class="btnClass" :type="btnType" @click="funCall">
      <slot name="btnlabel"></slot>
      <slot name="createBook"></slot>
      <slot name="cancel"></slot>
    </button>
  </div>
</template>

<script>
export default {
  props: ["position", "btnClass", "btnType", "clickFunction"],
  methods: {
    funCall() {
      switch (this.clickFunction) {
        case "loginValidation":
          this.$emit("login-call");
          break;
        case "signupModal":
          this.$emit("signup-call");
          break;
      }
    }
  }
};
</script>

<style lang="scss" scoped></style>
