export const toastMixin = {
  methods: {
    toast(type, message, position) {
      this.$toast.open({
        message: message,
        type: type,
        duration: 2000,
        position: position
      });
    }
  }
};
