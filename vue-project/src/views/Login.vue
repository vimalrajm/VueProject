<template>
  <div>
    <div class="hero has-background-white-ter is-fullheight">
      <div class="hero-body">
        <div class="container">
          <div class="columns is-centered">
            <div class="column is-5-tablet is-4-desktop is-4-widescreen">
              <form class="box">
                <div class="field has-text-centered">
                  <img src="@/assets/logo.jpg" width="80" />
                  <div class="heading is-size-5 has-text-weight-semibold">
                    Vimal Book House
                  </div>
                </div>
                <hr class="has-background-dark" />
                <BaseInputField
                  type="text"
                  placeholder="e.g. vimal@gmail.com"
                  iconName="fa fa-envelope"
                  labelName="Login"
                  v-model="emailVal"
                  fontWeight="has-text-weight-semibold"
                ></BaseInputField>
                <BaseInputField
                  type="password"
                  placeholder="********"
                  iconName="fa fa-envelope"
                  labelName="Password"
                  v-model="pwdValue"
                  fontWeight="has-text-weight-semibold"
                ></BaseInputField>
                <div class="field">
                  <label class="checkbox">
                    <input type="checkbox" /> Remember me
                  </label>
                </div>
                <div class="columns">
                  <div class="column">
                    <BaseButton
                      position="has-text-right"
                      btnClass="button is-success"
                      btnType="button"
                      clickFunction="loginValidation"
                      @login-call="loginValidation"
                    >
                      <h5 slot="btnlabel">Login</h5>
                    </BaseButton>
                  </div>
                  <div class="column">
                    <BaseButton
                      position="has-text-left"
                      btnType="button"
                      clickFunction="signupModal"
                      @signup-call="signupModal"
                      btnClass="button is-success"
                    >
                      <h5 slot="btnlabel">Signup</h5>
                    </BaseButton>
                  </div>
                </div>
                <div class="field has-text-centered">
                  <a href="#" class="has-text-danger">Forgot password?</a>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import user from "@/services/users.js";
import { toastMixin } from "@/toastMixin";
import customer from "@/services/customers.js";
import nProgress from "nprogress";
import { setTimeout } from "timers";

export default {
  mixins: [toastMixin],
  data() {
    return {
      emailVal: "",
      pwdValue: "",
      loginFail: true,
      customer: false
    };
  },
  beforeCreate() {
    nProgress.start();
    setTimeout(() => {
      nProgress.done();
    }, 2000);
  },
  methods: {
    async loginValidation() {
      nProgress.start();
      let userDetail;
      const emailRegex = /([a-zA-Z0-9]+)@([a-zA-Z]+)\.([a-zA-Z]{2,4}$)/;
      if (this.emailVal === "" || this.pwdValue === "") {
        this.toast("is-danger", "Fields cannot be empty", "is-top");
      } else if (emailRegex.test(this.emailVal)) {
        try {
          userDetail = await user.getUsers();
          userDetail.data.forEach(user => {
            if (
              user.email === this.emailVal &&
              user.password === this.pwdValue
            ) {
              this.loginFail = false;
              this.$store.dispatch("setCurrUser", user);
              this.$store.dispatch("setCurrPage", "Books");
              this.$store.dispatch("setCurrentPageNumber", 1);
              this.$router.push({
                name: "dashboard"
              });
            }
          });
          if (this.loginFail) {
            userDetail = await customer.getAllCustomers();
            userDetail.data.forEach(user => {
              if (
                user.email === this.emailVal &&
                user.password === this.pwdValue
              ) {
                this.customer = true;
                this.loginFail = false;
                this.$store.dispatch("setCurrUser", user);
                this.$store.dispatch("setCurrPage", "Books");
                this.$store.dispatch("setCurrentPageNumber", 1);
                this.$router.push({
                  name: "dashboard"
                });
              }
            });
          }
          if (this.loginFail) {
            this.toast("is-danger", "Invalid email id or password", "is-top");
          } else {
            if (this.customer) {
              let views;
              ({ data: views } = await customer.getViews());
              await customer.setViews(Number(views[0].viewers) + 1);
            }
            this.toast("is-success", "Login Success", "is-top");
            this.$router.push({
              name: "dashboard"
            });
          }
          this.loginFail = true;
        } catch (e) {
          console.log(e);
          this.toast("is-warning", "Something went wrong", "is-top");
        }
      } else {
        this.toast("is-danger", "Invlid email id or password", "is-top");
      }
      nProgress.start();
    },
    signupModal() {}
  }
};
</script>

<style scoped>
.box {
  border: 1px solid #a7164d;
}
</style>
