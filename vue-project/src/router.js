import Vue from "vue";
import Router from "vue-router";
import Login from "@/views/Login.vue";
import Books from "@/views/Books.vue";
import CreateBook from "@/views/CreateBook.vue";
import Customers from "@/views/Customers.vue";
import AddCustomer from "@/views/AddCustomer";

Vue.use(Router);

export default new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/login",
      name: "login",
      component: Login
    },
    {
      path: "/",
      redirect: "/login"
    },
    {
      path: "/books/:currPageNumber",
      name: "books",
      component: Books,
      props: true
    },
    {
      path: "/createOrUpdate/:bookDetail",
      name: "createBook",
      component: CreateBook,
      props: true
    },
    {
      path: "/addOrUpdate/:customerDetail",
      name: "addCustomer",
      component: AddCustomer,
      props: true
    },
    {
      path: "/customers/:currPageNumber",
      name: "customers",
      component: Customers,
      props: true
    }
  ]
});
