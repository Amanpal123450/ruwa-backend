const express = require("express");
const router = express.Router();

const { getServiceHomepageData } = require("../../controllers/");

// GET service homepage data
router.get("/aboutHome", getServiceHomepageData);

module.exports = router;
