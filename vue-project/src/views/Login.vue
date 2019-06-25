<template>
  <div>
    <div class="hero is-primary is-fullheight">
      <div class="hero-body">
        <div class="container">
          <div class="columns is-centered">
            <div class="column is-5-tablet is-4-desktop is-4-widescreen">
              <form class="box">
                <div class="field has-text-centered">
                  <img src="@/assets/logo.jpg" width="80" />
                  <div class="heading is-size-5 has-text-weight-semibold">
                    Bleeding Edge Press
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
export default {
  mixins: [toastMixin],
  data() {
    return {
      emailVal: "",
      pwdValue: "",
      loginFail: true
    };
  },
  methods: {
    async loginValidation() {
      const emailRegex = /([a-zA-Z0-9]+)@([a-zA-Z]+)\.([a-zA-Z]{2,4}$)/;
      if (this.emailVal === "" || this.pwdValue === "") {
        this.toast("is-danger", "Fields cannot be empty", "is-top");
      } else if (emailRegex.test(this.emailVal)) {
        try {
          await user.getUsers().then(userDetail => {
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
                  name: "books",
                  params: {
                    currPageNumber: 1
                  }
                });
              }
            });
          });
          if (this.loginFail) {
            await customer.getCustomers().then(userDetail => {
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
                    name: "books",
                    params: {
                      currPageNumber: 1
                    }
                  });
                }
              });
            });
          }
          if (this.loginFail) {
            this.toast("is-danger", "Invalid email id or password", "is-top");
          } else {
            this.toast("is-success", "Login Success", "is-top");
            this.$router.push({
              name: "books"
            });
          }
          this.loginFail = true;
        } catch (e) {
          console.log(e);
        }
      } else {
        this.toast("is-danger", "Invlid email id or password", "is-top");
      }
    },
    signupModal() {
    }
  }
};
</script>
