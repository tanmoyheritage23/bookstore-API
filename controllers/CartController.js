const Book = require("../models/Book");
const Cart = require("../models/Cart");
const UserCart = require("../models/UserCart");

module.exports.addBooks = async (req, res) => {
  try {
    const { userId } = req.params;
    const { bookId, qty } = req.body;

    let userCart = await UserCart.findOne({ user: userId });

    if (!userCart) {
      userCart = await UserCart.create({ user: userId });
    }

    const items = userCart.cartItems;

    for (let item of items) {
      const cart = await Cart.findById(item);
      if (cart.bookId.toString() === bookId) {
        return res.status(409).json("The book is already there");
      }
    }

    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json("Book not found");
    }

    // Update the totalQty of the book
    book.totalQty -= qty;
    await book.save();

    const cartItem = new Cart({
      bookId,
      imageURL: book.imageURL,
      title: book.title,
      author: book.author,
      price: book.price,
      totalQty: book.totalQty,
      Qty: qty,
      totalPrice: book.price * qty,
    });
    await cartItem.save();

    userCart.cartItems.push(cartItem);
    await userCart.save();

    res.status(200).json({
      message: "A new book is added to the cart",
      data: {
        Item: cartItem,
      },
    });
  } catch (error) {
    console.log(`*****Error: ${error}`);
    res.status(500).json({
      error: "An error occurred while adding the book to the cart.",
    });
  }
};

module.exports.getBooks = async (req, res) => {
  try {
    const { userId } = req.params;
    const userCart = await UserCart.findOne({ user: userId });

    const cartItems = userCart.cartItems;

    const items = [];

    for (let cartItem of cartItems) {
      const item = await Cart.findById(cartItem);
      items.push(item);
    }
    res.status(200).json({
      message: "Successfully retrieved cart items",
      data: {
        items,
      },
    });
  } catch (error) {
    console.log(`*****Error: ${error}`);
    res
      .status(500)
      .json({ error: "An error occurred while retrieving cart items." });
  }
};

module.exports.update = async (req, res) => {
  try {
    const { cartId } = req.params;
    const { mode } = req.body;
    const cart = await Cart.findById(cartId).populate("bookId").exec();

    if (!cart) {
      return res.status(404).json({ error: "Item not found." });
    }

    const bookID = cart.bookId._id;
    const book = await Book.findById(bookID);

    if (mode === "plus") {
      if (book.totalQty === 0) {
        return res.status(404).json({ error: "Out of stock" });
      }

      book.totalQty -= 1;
      cart.totalQty = book.totalQty;
      cart.Qty += 1;
    } else {
      book.totalQty += 1;
      cart.totalQty = book.totalQty;
      cart.Qty -= 1;
    }

    cart.totalPrice = cart.Qty * cart.price;

    await cart.save();
    await book.save();

    res.status(200).json({
      message: "Successfully updated cart items",
    });
  } catch (error) {
    console.log(`*****Error: ${error}`);
    res
      .status(500)
      .json({ error: "An error occurred while updating the cart item." });
  }
};

module.exports.delete = async (req, res) => {
  try {
    const { userId } = req.params;
    const { cartId } = req.params;

    const userCart = await UserCart.findOne({ user: userId });

    userCart.cartItems = userCart.cartItems.filter(
      (item) => item.toString() !== cartId.toString()
    );

    userCart.save();

    const cart = await Cart.findById(cartId).populate("bookId").exec();

    if (!cart) {
      return res.status(404).json({ error: "Item not found." });
    }

    const bookID = cart.bookId._id;
    const book = await Book.findById(bookID);

    book.totalQty += cart.Qty;

    await book.save();

    await Cart.findByIdAndDelete(cartId);

    res.status(200).json({ message: "Successfully removed cart item" });
  } catch (error) {
    console.log(`*****Error: ${error}`);
    res
      .status(500)
      .json({ error: "An error occurred while deleting the item." });
  }
};

module.exports.checkOut = async (req, res) => {
  try {
    const { userId } = req.params;
    console.log(userId);
    const userCart = await UserCart.findOne({ user: userId }).populate(
      "cartItems"
    );

    if (!userCart) {
      return res.status(404).json({ error: "User cart not found" });
    }

    const products = userCart.cartItems;

    let totalPrice = 0;
    for (let product of products) {
      totalPrice += product.totalPrice;
    }

    userCart.cartItems = [];
    await userCart.save();

    res.status(200).json({
      message: "Checkout successful",
      data: {
        totalPrice: totalPrice,
      },
    });
  } catch (error) {
    console.log(`*****Error: ${error}`);
    res.status(500).json({ error: "An error occurred during checkout" });
  }
};
