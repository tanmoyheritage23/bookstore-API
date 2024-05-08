const Book = require("../models/Book");
require("dotenv").config();
const fs = require("fs");

module.exports.add = async (req, res) => {
  try {
    Book.uploadedImage(req, res, async (err) => {
      if (req.body.adminID !== process.env.ADMIN_ID) {
        return res.status(401).json({ error: "Unauthorized Access" });
      }
      if (err) {
        console.log(`*****Multer Error: ${err}`);
        return res.status(500).json({ error: "Image upload failed." });
      }

      // Extract data from req.body
      const {
        title,
        author,
        summary,
        price,
        genres,
        featured,
        bestSeller,
        totalQty,
      } = req.body;

      // Retrieve the file path of the uploaded image
      const imagePath = req.file.filename;

      // Create a new product instance
      const newBook = new Book({
        imageURL: imagePath,
        title,
        author,
        summary,
        price,
        genres,
        featured,
        bestSeller,
        totalQty,
      });

      // Save the new product to the database
      await newBook.save();

      // Respond with a success message
      res.status(200).json({
        message: "Book added successfully.",
        data: {
          book: newBook,
        },
      });
    });
  } catch (error) {
    console.log(`*****Error: ${error}`);
    res.status(500).json({ error: "An error occurred while adding the book." });
  }
};

module.exports.getAll = async (req, res) => {
  try {
    // Retrieve all products from the database
    const books = await Book.find();

    res.status(200).json({ data: { books } });
  } catch (error) {
    console.log(`*****Error: ${error}`);
    res
      .status(500)
      .json({ error: "An error occurred while fetching the books." });
  }
};

module.exports.getBookByID = async (req, res) => {
  try {
    const bookID = req.params.id;

    // Find the book with the given ID in the database
    const book = await Book.findById(bookID);

    // If the book is not found, return an error
    if (!book) {
      return res.status(404).json({ error: "Book not found." });
    }

    res.status(200).json({ data: { book } });
  } catch (error) {
    console.log(`*****Error: ${error}`);
    res
      .status(500)
      .json({ error: "An error occurred while fetching the book." });
  }
};

module.exports.update = async (req, res) => {
  try {
    Book.uploadedImage(req, res, async (err) => {
      if (req.body.adminID !== process.env.ADMIN_ID) {
        return res.status(401).json({ error: "Unauthorized Access" });
      }
      if (err) {
        console.log(`*****Multer Error: ${err}`);
        return res.status(500).json({ error: "Image upload failed." });
      }
      const { bookId } = req.params;
      const {
        title,
        author,
        summary,
        price,
        genres,
        featured,
        bestSeller,
        totalQty,
      } = req.body;

      // Find the book by ID in the database
      const book = await Book.findById(bookId);

      if (!book) {
        return res.status(404).json({ error: "Book not found." });
      }

      // Update the book properties
      book.title = title;
      book.author = author;
      book.summary = summary;
      book.price = price;
      book.genres = genres;
      book.featured = featured;
      book.bestSeller = bestSeller;
      book.totalQty = totalQty;

      if (req.file) {
        // If a new image is uploaded, update the image path
        const imagePath = req.file.path;

        // Delete the previous image file
        if (book.imageURL) {
          fs.unlinkSync(book.imageURL);
        }

        book.imageURL = imagePath;
      }

      // Save the updated book
      await book.save();

      res.status(200).json({ message: "Book updated successfully." });
    });
  } catch (error) {
    console.log(`*****Error: ${error}`);
    res
      .status(500)
      .json({ error: "An error occurred while updating the book." });
  }
};


module.exports.delete = async (req, res) => {
  try {
    const { bookId } = req.params;

    // Find the book by ID in the database
    const book = await Book.findById(bookId);

    if (!book) {
      return res.status(404).json({ error: "Product not found." });
    }

    // Delete the book image file
    if (book.imageURL) {
      fs.unlinkSync(book.imageURL);
    }

    // Delete the book from the database
    await Book.findByIdAndDelete(bookId);

    res.status(200).json({ message: "Book deleted successfully." });
  } catch (error) {
    console.log(`*****Error: ${error}`);
    res
      .status(500)
      .json({ error: "An error occurred while deleting the book." });
  }
};

