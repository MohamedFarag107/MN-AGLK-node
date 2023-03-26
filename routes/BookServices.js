const express = require("express");

const router = express.Router();

const {
  getAllBooks,
  getOneBook,
  createBook,
  updateBook,
  deleteBook,
  uploadBookData,
  // saveBookData,
} = require("../services/BookServices");

router.route("/").get(getAllBooks).post(uploadBookData, createBook);

router
  .route("/:id")
  .get(getOneBook)
  .put(uploadBookData, updateBook)
  .delete(deleteBook);

module.exports = router;
