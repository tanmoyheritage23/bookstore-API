const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");

const IMAGE_PATH = path.join("/uploads/images");

const bookSchema = new mongoose.Schema(
  {
    imageURL: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
    summary: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    genres: {
      type: [String],
      required: true,
    },
    featured: {
      type: Boolean,
      required: true,
    },
    bestSeller: {
      type: Boolean,
      required: true,
    },
    totalQty: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "..", IMAGE_PATH));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

bookSchema.statics.uploadedImage = multer({ storage: storage }).single(
  "imageURL"
);
bookSchema.statics.imagePath = IMAGE_PATH;

const Book = mongoose.model("Book", bookSchema);
module.exports = Book;
