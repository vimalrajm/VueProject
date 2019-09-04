import axios from "axios";

const apiClient = new axios.create({
  baseURL: "http://localhost:3000",
  withCredentials: false,
  headers: {
    Accept: "application/json",
    "content-type": "application/json"
  }
});

export default {
  getCustomers(page, limit) {
    return apiClient.get("/customers?_page=" + page + "&_limit=" + limit);
  },
  addCustomer(customer) {
    return apiClient.post("/customers", {
      id: customer.id,
      name: customer.name,
      email: customer.email,
      country: customer.country,
      orders: customer.orders,
      role: customer.role,
      password: customer.password,
      address: customer.address,
      zipcode: customer.zipcode,
      city: customer.city
    });
  },
  getAllCustomers() {
    return apiClient.get("/customers");
  },
  getCustomer(id) {
    return apiClient.get("/customers/" + id);
  },
  updateCustomer(customer) {
    return apiClient.put("/customers/" + customer.id, {
      name: customer.name,
      email: customer.email,
      country: customer.country,
      orders: customer.orders,
      role: customer.role,
      password: customer.password,
      address: customer.address,
      zipcode: customer.zipcode,
      city: customer.city
    });
  },
  deleteCustomer(id) {
    return apiClient.delete("/customers/" + id);
  },
  updateOrder(orderCount, customer) {
    return apiClient.put("/customers/" + customer.id, {
      name: customer.name,
      email: customer.email,
      country: customer.country,
      orders: orderCount,
      role: customer.role,
      password: customer.password,
      address: customer.address,
      zipcode: customer.zipcode,
      city: customer.city
    });
  },
  getViews() {
    return apiClient.get("/views");
  },
  setViews(count) {
    return apiClient.put("/views/" + 1, { viewers: count, id: 1 });
  }
};
