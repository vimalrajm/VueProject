export default class orderData {
  constructor(orderId, custId, date, bookCount, status, total) {
    (this.orderId = orderId),
      (this.custId = custId),
      (this.date = date),
      (this.bookCount = bookCount),
      (this.status = status),
      (this.total = total);
  }
}
