<template>
  <div class="field">
    <label :class="fontWeight">{{ labelName }}</label>
    <div class="control has-icons-left">
      <input class="input" :value="value" @input="inputVal" v-bind="$attrs" />
      <span class="icon is-small is-left has-text-dark">
        <i :class="iconName"></i>
      </span>
    </div>
  </div>
</template>

<script>
export default {
  inheritAttrs: false,
  props: {
    iconName: {
      type: String,
      required: false
    },
    labelName: {
      required: true,
      type: [String, Number]
    },
    value: [Number, String],
    fontWeight: {
      type: String
    }
  },
  methods: {
    inputVal(event) {
      this.$emit("input", event.target.value);
    }
  }
};
</script>

<style lang="scss" scoped></style>
