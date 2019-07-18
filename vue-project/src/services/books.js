import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:3000",
  withCredentials: false,
  headers: {
    Accept: "application/json",
    "content-type": "application/json"
  }
});

export default {
  getBooks(page, limit) {
    return apiClient.get("/books?_page=" + page + "&_limit=" + limit);
  },
  createBook(book) {
    return apiClient.post("/books", {
      id: book._id,
      bookName: book.name,
      bookPrice: book.price,
      bookPages: book.pages,
      bookISBN: book.isbn,
      image: "dummy.jpg",
      addedBy: book.addedBy,
      qty: 1
    });
  },
  deleteBook(book) {
    return apiClient.delete("/books/" + book.id);
  },
  getABook(bookId) {
    return apiClient.get("/books/" + bookId);
  },
  updateBook(bookId, book) {
    return apiClient.put("/books/" + bookId, {
      bookName: book.name,
      bookPrice: book.price,
      bookPages: book.pages,
      bookISBN: book.isbn,
      image: book.image,
      addedBy: book.addedBy
    });
  }
};
