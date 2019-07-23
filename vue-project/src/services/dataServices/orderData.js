export default class orderData {
  constructor(orderId, custId, date, bookCount, status, totalCost, bookIdQty) {
    this.orderId = orderId;
    this.custId = custId;
    this.date = date;
    this.bookCount = bookCount;
    this.status = status;
    this.totalCost = totalCost;
    this.bookIdQty = bookIdQty;
  }
}
