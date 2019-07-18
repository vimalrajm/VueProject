import axios from "axios";

const orderClient = axios.create({
  baseURL: "http://localhost:3000",
  withCredentials: false,
  headers: {
    Accept: "application/json",
    "content-type": "application/json"
  }
});

export default {
  getCart() {
    return orderClient.get("/cart");
  },

  addToCart(bookId, custId, qty) {
    return orderClient.post("/cart", {
      bookId,
      custId,
      qty
    });
  }
};
