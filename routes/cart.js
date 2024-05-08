const express = require("express");
const router = express.Router();
const passport = require("passport");

const CartController = require("../controllers/CartController");

router.post(
  "/addBooks/:userId",
  passport.authenticate("jwt", { session: false }),
  CartController.addBooks
);

router.get(
  "/getBooks/:userId",
  passport.authenticate("jwt", { session: false }),
  CartController.getBooks
);

router.put(
  "/update/:cartId",
  passport.authenticate("jwt", { session: false }),
  CartController.update
);

router.delete(
  "/delete/:cartId/:userId",
  passport.authenticate("jwt", { session: false }),
  CartController.delete
);

router.delete(
  "/checkout/:userId",
  passport.authenticate("jwt", { session: false }),
  CartController.checkOut
);

module.exports = router;
