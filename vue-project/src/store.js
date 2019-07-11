import Vue from "vue";
import Vuex from "vuex";
import VuexPersistance from "vuex-persist";
//import book from "./services/dataServices/booksData";

Vue.use(Vuex);

const vuexPersist = new VuexPersistance({
  key: "my-data",
  storage: localStorage
});

export default new Vuex.Store({
  plugins: [vuexPersist.plugin],
  state: {
    currUser: {},
    currentPage: "",
    noOfBooks: 0,
    pageLimit: 4,
    custOrderLimit: 7,
    noOfCustomers: 0,
    currPageNumber: 1,
    noOfOrders: 0
  },
  mutations: {
    CURR_USER(state, user) {
      state.currUser = user;
    },
    SET_CURPAGE(state, page) {
      state.currentPage = page;
    },
    SET_NO_OF_BOOKS(state, noOfBooks) {
      state.noOfBooks = noOfBooks;
    },
    SET_NO_OF_CUSTOMERS(state, noOfCustomers) {
      state.noOfCustomers = noOfCustomers;
    },
    SET_CURRENT_PAGE_NUMBER(state, currentPageNumber) {
      state.currPageNumber = currentPageNumber;
    },
    SET_CUST_ORDER_LIMIT(state, custOrderLimit) {
      state.custOrderLimit = custOrderLimit;
    },
    SET_NUM_OF_ORDERS(state, noOfOrders) {
      state.noOfOrders = noOfOrders;
    }
  },
  actions: {
    setCurrUser({ commit }, user) {
      localStorage.clear;
      commit("CURR_USER", user);
    },
    setCurrPage({ commit }, page) {
      commit("SET_CURPAGE", page);
    },
    setNoOfBooks({ commit }, noOfBooks) {
      commit("SET_NO_OF_BOOKS", noOfBooks);
    },
    setNoOfCustomers({ commit }, noOfCustomers) {
      commit("SET_NO_OF_CUSTOMERS", noOfCustomers);
    },
    setCurrentPageNumber({ commit }, currPageNumber) {
      commit("SET_CURRENT_PAGE_NUMBER", currPageNumber);
    },
    setCustAndOrderLimit({ commit }, custOrderLimit) {
      commit("SET_CUST_ORDER_LIMIT", custOrderLimit);
    },
    setNumOfOrders({ commit }, noOfOrders) {
      commit("SET_NUM_OF_ORDERS", noOfOrders);
    }
  }
});
