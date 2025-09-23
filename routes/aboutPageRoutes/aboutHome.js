const express = require("express");
const router = express.Router();

const { getServiceHomepageData } = require("../../controllers/aboutPageController/aboutHome");

// GET service homepage data
router.get("/", getServiceHomepageData);

module.exports = router;
