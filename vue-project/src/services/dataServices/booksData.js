export class Book {
  constructor(_id, name, price, pages, isbn, image, addedBy) {
    this.name = name;
    this.price = price;
    this.pages = pages;
    this.isbn = isbn;
    this.image = image;
    this._id = _id;
    this.addedBy = addedBy;
  }
}
