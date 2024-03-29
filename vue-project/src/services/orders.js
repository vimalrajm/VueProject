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
      totalCost: orderData.totalCost,
      bookIdQty: orderData.bookIdQty
    });
  },

  getOrders(page, limit) {
    return orderClient.get("/orders?_page=" + page + "&_limit=" + limit);
  },

  getAllOrders() {
    return orderClient.get("/orders");
  },

  getOrder(id) {
    return orderClient.get("/orders/" + id);
  },

  updateOrder(orderData) {
    return orderClient.put("/orders/" + orderData.id, {
      id: orderData.id,
      custId: orderData.custId,
      date: orderData.date,
      numberOfBooks: orderData.numberOfBooks,
      status: orderData.status,
      totalCost: orderData.totalCost,
      bookIdQty: orderData.bookIdQty
    });
  },

  removeOrder(id) {
    return orderClient.delete("/orders/" + id);
  }
};
