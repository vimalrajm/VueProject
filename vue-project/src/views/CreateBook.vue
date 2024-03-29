<template>
  <div class="hero is-small">
    <Header :currUser="currUser"></Header>
    <div class="hero-body">
      <div class="columns">
        <div class="column is-2">
          <Menu :currentPage="currentPage"></Menu>
        </div>
        <transition name="slide-fade">
          <div class="column is-10" v-if="loaded">
            <nav class="breadcrumb">
              <ul>
                <li>
                  <router-link
                    :to="{
                      name: 'books',
                      params: {
                        currPageNumber: isCreated ? curPageNum : 1
                      }
                    }"
                    class="has-text-weight-semibold"
                    >Books</router-link
                  >
                </li>
                <li class="is-active has-text-weight-semibold">
                  <a href="#">New Book</a>
                </li>
              </ul>
            </nav>
            <form>
              <div class="columns">
                <div class="column">
                  <BaseInputField
                    type="text"
                    placeholder="e.g. Designing with bulma"
                    iconName="fa fa-book"
                    labelName="Title"
                    v-model="titleVal"
                    fontWeight="has-text-weight-normal"
                  ></BaseInputField>
                </div>
              </div>
              <div class="columns">
                <div class="column">
                  <BaseInputField
                    type="number"
                    placeholder="$ e.g.22.99"
                    iconName="fa fa-usd"
                    labelName="Price"
                    v-model="price"
                    fontWeight="has-text-weight-normal"
                  ></BaseInputField>
                </div>
                <div class="column">
                  <BaseInputField
                    type="number"
                    placeholder="e.g. 270"
                    iconName="fa fa-file"
                    labelName="Pages"
                    v-model="pages"
                    fontWeight="has-text-weight-normal"
                  ></BaseInputField>
                </div>
                <div class="column">
                  <BaseInputField
                    pattern="[1-9]{13}"
                    type="number"
                    placeholder="e.g.1231434664647"
                    iconName="fa fa-list-ol"
                    labelName="ISBN"
                    v-model="isbn"
                    fontWeight="has-text-weight-normal"
                  ></BaseInputField>
                </div>
              </div>
              <div class="columns">
                <div class="column">
                  <div class="field">
                    <label class="label">Cover Image</label>
                    <div class="control">
                      <div class="file has-name">
                        <label class="file-label">
                          <input
                            type="file"
                            class="file-input"
                            @change="previewFile"
                            accept="image/*"
                          />
                          <span class="file-cta">
                            <span class="file-icon">
                              <i class="fa fa-upload"></i>
                            </span>
                            <span class="file-label">
                              Choose a file...
                            </span>
                          </span>
                          <span class="file-name">
                            {{ chosenFile }}
                          </span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="columns">
                <div class="column">
                  <div class="field">
                    <div class="buttons">
                      <button
                        :class="btnLoad"
                        class="is-medium is-success button"
                        @click.prevent="
                          btnType === 'Update' ? updateBook() : createNewBook()
                        "
                      >
                        {{ btnType }}
                      </button>
                      <router-link
                        :to="{
                          name: 'books',
                          params: {
                            currPageNumber: isCreated ? curPageNum : 1
                          }
                        }"
                        class="is-medium is-light button"
                        >Cancel</router-link
                      >
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>

<script>
import Header from "@/components/Header";
import Menu from "@/components/Menu";
import { mapState } from "vuex";
import { toastMixin } from "@/toastMixin";
import { Book } from "@/services/dataServices/booksData";
import bookService from "@/services/books.js";
import nProgress from "nprogress";
import { setTimeout } from "timers";
export default {
  data() {
    return {
      titleVal: "",
      price: "",
      pages: "",
      isbn: "",
      image: "",
      chosenFileName: "No chosen file",
      selectedFile: null,
      fd: null,
      isCreated: 0,
      btnType: "Create",
      addedBy: "",
      btnLoading: "",
      loaded: false
    };
  },
  mixins: [toastMixin],
  props: {
    currPageNumber: {
      require: true,
      type: Number
    },
    bookDetail: {
      type: [String, Number]
    }
  },
  components: {
    Header,
    Menu
  },
  async created() {
    this.loaded = false;
    nProgress.start();
    this.$store.dispatch("setCurrPage", "Books");
    let res;
    if (this.bookDetail !== undefined && this.bookDetail !== "new") {
      res = await bookService.getABook(this.bookDetail);
      this.titleVal = res.data.bookName;
      this.price = res.data.bookPrice;
      this.pages = res.data.bookPages;
      this.isbn = res.data.bookISBN;
      this.chosenFileName = res.data.image;
      this.btnType = "Update";
      this.addedBy = res.data.addedBy;
    }
    nProgress.done();
    if (this.bookDetail === "new") {
      setTimeout(() => {
        this.loaded = true;
      }, 100);
    } else {
      this.loaded = true;
    }
  },
  computed: {
    ...mapState(["currUser", "currentPage", "noOfBooks", "pageLimit"]),
    chosenFile() {
      return this.chosenFileName;
    },
    curPageNum() {
      return Math.ceil((Number(this.noOfBooks) + 1) / this.pageLimit);
    },
    btnLoad() {
      return this.btnLoading;
    }
  },
  methods: {
    clearFields() {
      this.titleVal = this.price = this.pages = this.isbn = this.image = this.selectedFile = this.fd =
        "";
      this.chosenFileName = "No chosen file";
    },
    async createNewBook() {
      this.btnLoading = "is-loading";
      let res;
      if (
        this.titleVal === "" ||
        this.price === "" ||
        this.pages === "" ||
        this.isbn === ""
      ) {
        this.toast("is-danger", "Fields can't be empty", "is-top");
      } else {
        let _id = Math.floor(Math.random() * 10000000000);
        this.addedBy = this.currUser.userId;
        let bookObj = new Book(
          _id,
          this.titleVal,
          this.price,
          this.pages,
          this.isbn,
          this.fd,
          this.addedBy
        );
        try {
          res = await bookService.createBook(bookObj);
          if (res.status === 201) {
            this.toast("is-success", "Book added sucessfully", "is-top");
            this.isCreated = 1;
            this.clearFields();
          } else {
            this.toast(
              "is-danger",
              "Something went wrong while adding",
              "is-top"
            );
          }
        } catch (e) {
          console.log(e);
        }
      }
      this.btnLoading = "";
    },
    async updateBook() {
      this.btnLoading = "is-loading";
      let res;
      if (
        this.titleVal === "" ||
        this.price === "" ||
        this.pages === "" ||
        this.isbn === ""
      ) {
        this.toast("is-danger", "Fields can't be empty", "is-top");
      } else {
        try {
          let bookObj2 = new Book(
            Number(this.bookDetail),
            this.titleVal,
            this.price,
            this.pages,
            this.isbn,
            this.chosenFileName,
            this.addedBy
          );
          res = await bookService.updateBook(Number(this.bookDetail), bookObj2);
          if (res.status === 200) {
            this.toast("is-success", "Book updated sucessfully", "is-top");
            this.$router.push({
              name: "books",
              params: {
                currPageNumber: 1
              }
            });
          } else {
            this.toast(
              "is-danger",
              "Something went wrong while adding",
              "is-top"
            );
          }
        } catch (e) {
          this.toast(
            "is-danger",
            "Something went wrong while updating",
            "is-top"
          );
        }
      }
      this.btnLoading = "";
    },
    previewFile(event) {
      //file uplaod JS reference this website https://developer.mozilla.org/en-US/docs/Web/API/FileList
      //for vue refer here https://scotch.io/tutorials/how-to-handle-file-uploads-in-vue-2
      //i am using other https://stackoverflow.com/questions/17586382/how-can-i-move-a-file-to-other-directory-using-javascript
      const fd = new FormData();
      if (event.target.files.length !== 0) {
        this.chosenFileName = event.target.files[0].name;
        this.selectedFile = event.target.files[0];
        fd.append("image", this.selectedFile, this.chosenFileName);
      }
    }
  }
};
</script>

<style scoped>
.slide-fade-enter-active {
  transition: all 1s cubic-bezier(1, 4, 1, 1);
}
.slide-fade-enter, .slide-fade-leave-to
/* .slide-fade-leave-active below version 2.1.8 */ {
  transform: translateX(10px);
  opacity: 0;
}
</style>
