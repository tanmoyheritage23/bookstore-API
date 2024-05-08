const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userCartSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    cartItems: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Cart",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const UserCart = mongoose.model("UserCart", userCartSchema);
module.exports = UserCart;
