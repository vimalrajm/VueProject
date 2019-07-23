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
  },

  removeBookFromCart(id) {
    return orderClient.delete("/cart/" + id);
  },

  createOrder(orderData) {
    return orderClient.post("/orders", {
      id: orderData.orderId,
      custId: orderData.custId,
      date: orderData.date,
      numberOfBooks: orderData.bookCount,
      status: orderData.status,
      totalCost: orderData.status,
      bookIdQty: orderData.bookIdQty
    });
  }
};
