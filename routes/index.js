const express = require("express");
const router = express.Router();

const HomeController = require("../controllers/HomeController");

router.get("/", HomeController.home);

router.use("/api/user", require("./user"));
router.use("/api/book", require("./book"));
router.use("/api/cart", require("./cart"));

console.log("Routes are running fine");
module.exports = router;
