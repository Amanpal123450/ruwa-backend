const express = require("express");
const router = express.Router();

const { getServiceHomepageData } = require("../../controllers/servicePageController/serviceHome");

// GET service homepage data
router.get("/homepage", getServiceHomepageData);

module.exports = router;
