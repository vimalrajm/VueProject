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
      address: customer.address
    });
  },
  getAllCustomers() {
    return apiClient.get("/customers");
  }
};