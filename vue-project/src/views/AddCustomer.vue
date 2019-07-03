<template>
  <div class="hero is-small">
    <Header :currUser="currUser"> </Header>
    <div class="hero-body">
      <div class="columns">
        <div class="column is-2">
          <Menu :currentPage="currentPage"></Menu>
        </div>
        <div class="column is-10">
          <nav class="breadcrumb">
            <ul>
              <li>
                <router-link
                  :to="{
                    name: 'customers',
                    params: {
                      currPageNumber: isCreated ? curPageNum : 1
                    }
                  }"
                  class="has-text-weight-semibold"
                  >Customers</router-link
                >
              </li>
              <li class="is-active">
                <a href="#">New Customer</a>
              </li>
            </ul>
          </nav>
          <form>
            <div class="columns">
              <div class="column">
                <BaseInputField
                  type="text"
                  placeholder="e.g. Alex Smith"
                  iconName="fa fa-user"
                  labelName="Full name"
                  v-model="customerName"
                  fontWeight="has-text-weight-normal"
                ></BaseInputField>
              </div>
            </div>
            <div class="columns">
              <div class="column">
                <BaseInputField
                  type="text"
                  placeholder="e.g. Alex Smith"
                  iconName="fa fa-envelope"
                  labelName="Email"
                  v-model="customerEmail"
                  fontWeight="has-text-weight-normal"
                ></BaseInputField>
              </div>
            </div>
            <div class="columns">
              <div class="column">
                <BaseInputField
                  type="text"
                  placeholder="Number and street name"
                  iconName="fa fa-address-card"
                  labelName="Address"
                  v-model="address1"
                  fontWeight="has-text-weight-normal"
                ></BaseInputField>
                <BaseInputField
                  type="text"
                  placeholder="Second address line (optional)"
                  iconName="fa fa-address-book"
                  labelName=""
                  v-model="address2"
                  fontWeight="has-text-weight-normal"
                ></BaseInputField>
              </div>
            </div>
            <div class="columns">
              <div class="column">
                <BaseInputField
                  type="number"
                  placeholder="e.g. 67202"
                  iconName="fa fa-map-pin"
                  labelName="Postcode / Zipcode"
                  v-model="zipcode"
                  fontWeight="has-text-weight-normal"
                ></BaseInputField>
              </div>
              <div class="column">
                <BaseInputField
                  type="text"
                  placeholder="e.g. San Francisco"
                  iconName="fa fa-home"
                  labelName="City"
                  v-model="city"
                  fontWeight="has-text-weight-normal"
                ></BaseInputField>
              </div>
              <div class="column">
                <div class="field">
                  <label>Country</label>
                  <div class="control">
                    <div class="select">
                      <select v-model="country">
                        <option>-- Choose a country --</option>
                        <option>Canada</option>
                        <option>United Kingdom</option>
                        <option>United States</option>
                        <option>India</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="columns">
              <div class="column">
                <div class="field">
                  <div class="buttons">
                    <button
                      :class="btnLoad"
                      class="is-medium is-success button"
                      @click.prevent="
                        btnType === 'Update'
                          ? updateCustomerDetail()
                          : addNewCustomer()
                      "
                    >
                      {{ btnType }}
                    </button>
                    <router-link
                      :to="{
                        name: 'customers',
                        params: {
                          currPageNumber: isCreated ? curPageNum : 1
                        }
                      }"
                      class="is-medium is-light button"
                      >Cancel</router-link
                    >
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Header from "@/components/Header";
import Menu from "@/components/Menu";
import { toastMixin } from "@/toastMixin";
import { mapState } from "vuex";
import CustomerData from "@/services/dataServices/customerData";
import customerService from "@/services/customers";
import userService from "@/services/users";
import _ from "lodash";

export default {
  data() {
    return {
      btnType: "Create",
      customerName: "",
      customerEmail: "",
      address1: "",
      address2: "",
      address: [],
      zipcode: "",
      city: "",
      country: "-- Choose a country --",
      isCreated: 0,
      btnLoading: ""
    };
  },
  async created() {
    if (this.customerDetail !== undefined && this.customerDetail !== "new") {
      try {
        await customerService.getCustomer(this.customerDetail).then(res => {
          this.customerName = res.data.name;
          this.customerEmail = res.data.email;
          this.address1 = res.data.address[0];
          this.address2 = res.data.address[1];
          this.zipcode = res.data.zipcode;
          this.city = res.data.city;
          this.country = res.data.country;
          this.btnType = "Update";
        });
      } catch (e) {
        console.log(e);
      }
    }
  },
  mixins: [toastMixin],
  props: {
    customerDetail: {
      type: [String, Number],
      required: true
    }
  },
  components: {
    Header,
    Menu
  },
  computed: {
    ...mapState(["currUser", "currentPage", "noOfCustomers", "custLimit"]),
    curPageNum() {
      return Math.ceil((Number(this.noOfCustomers) + 1) / this.custLimit);
    },
    btnLoad() {
      return this.btnLoading;
    }
  },
  methods: {
    clearFields() {
      this.customerName = this.customerEmail = this.address1 = this.zipcode = this.city = this.address2 =
        "";
      this.country = "-- Choose a country --";
    },
    async addNewCustomer() {
      this.btnLoading = "is-loading";
      if (
        this.customerName === "" ||
        this.customerEmail === "" ||
        this.address1 === "" ||
        this.zipcode === "" ||
        this.city === ""
      ) {
        this.toast("is-danger", "Fields can't be empty", "is-top");
        this.btnLoading = "";
      } else {
        if (this.country === "-- Choose a country --") {
          this.toast("is-danger", "Select the country", "is-top");
          this.btnLoading = "";
          this.address = [];
        } else {
          let id = Math.floor(Math.random() * 10000000000);
          this.address.push(this.address1);
          if (this.address2 !== "") {
            this.address.push(this.address2);
          }
          const customerDetailObj = new CustomerData(
            id,
            this.customerName,
            this.customerEmail,
            this.country,
            3,
            "customer",
            "12345678",
            this.address,
            this.zipcode,
            this.city
          );
          try {
            let found = 0;
            await customerService.getAllCustomers().then(res => {
              _.find(res.data, function(o) {
                if (o.email === customerDetailObj.email) {
                  found = 1;
                }
              });
            });
            if (!found) {
              await userService.getUsers().then(res => {
                _.find(res.data, function(o) {
                  if (o.email === customerDetailObj.email) {
                    found = 1;
                  }
                });
              });
            }
            if (!found) {
              await customerService.addCustomer(customerDetailObj).then(res => {
                if (res.status === 201) {
                  this.toast(
                    "is-success",
                    "Customer added sucessfully",
                    "is-top"
                  );
                  this.isCreated = 1;
                  this.clearFields();
                  this.btnLoading = "";
                } else {
                  this.toast(
                    "is-danger",
                    "Something went wrong while adding",
                    "is-top"
                  );
                  this.btnLoading = "";
                }
              });
            } else {
              console.log("found");
              this.toast("is-danger", "Email id already exists", "is-top");
              this.btnLoading = "";
              this.address = [];
            }
          } catch (e) {
            console.log(e);
          }
        }
      }
    },
    async updateCustomerDetail() {
      this.btnLoading = "is-loading";
      if (
        this.customerName === "" ||
        this.customerEmail === "" ||
        this.address1 === "" ||
        this.zipcode === "" ||
        this.city === ""
      ) {
        this.toast("is-danger", "Fields can't be empty", "is-top");
        this.btnLoading = "";
      } else {
        if (this.country === "-- Choose a country --") {
          this.toast("is-danger", "Select the country", "is-top");
          this.btnLoading = "";
          this.address = [];
        } else {
          this.address.push(this.address1);
          if (this.address2 !== "") {
            this.address.push(this.address2);
          }
          const customerDetailObj = new CustomerData(
            this.customerDetail,
            this.customerName,
            this.customerEmail,
            this.country,
            3,
            "customer",
            "12345678",
            this.address,
            this.zipcode,
            this.city
          );
          try {
            let found = 0;
            let id = this.customerDetail;
            await customerService.getAllCustomers().then(res => {
              _.find(res.data, function(o) {
                if (
                  o.email === customerDetailObj.email &&
                  o.id !== Number(id)
                ) {
                  found = 1;
                }
              });
            });
            if (!found) {
              await userService.getUsers().then(res => {
                _.find(res.data, function(o) {
                  if (
                    o.email === customerDetailObj.email &&
                    o.id !== Number(id)
                  ) {
                    found = 1;
                  }
                });
              });
            }
            if (!found) {
              await customerService
                .updateCustomer(customerDetailObj)
                .then(res => {
                  if (res.status === 200) {
                    this.toast(
                      "is-success",
                      "Customer details updated sucessfully",
                      "is-top"
                    );
                    this.btnLoading = "";
                    this.$router.push({
                      name: "customers",
                      params: {
                        currPageNumber: 1
                      }
                    });
                  } else {
                    this.toast(
                      "is-danger",
                      "Something went wrong while adding",
                      "is-top"
                    );
                    this.btnLoading = "";
                  }
                });
            } else {
              console.log("found");
              this.toast("is-danger", "Email id already exists", "is-top");
              this.btnLoading = "";
              this.address = [];
            }
          } catch (e) {
            console.log(e);
          }
        }
      }
    }
  }
};
</script>

<style lang="scss" scoped></style>
