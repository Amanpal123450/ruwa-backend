const express = require("express");
const router = express.Router();

// Static Card Services Data
const Janarogycard = [
  {
    icon: "🪪",
    title: "Jan Arogya Card",
    description: [
      "Covers major health treatments at partnered hospitals.",
      "Easy enrollment with minimal documentation.",
      "Covers expenses up to ₹5 Lakhs per family per year."
    ],
    bgClass: "bg-white",
  },
  {
    icon: "👨‍👩‍👧‍👦",
    title: "Jan Swabhiman Seva Card",
    description: [
      "Access to a wide range of welfare benefits.",
      "Discounts on medical services and medicines.",
      "Priority access to free ambulance services."
    ],
    bgClass: "bg-light",
  },
  {
    icon: "📋",
    title: "Instant Registration Process",
    description: [
      "Fill in basic details and upload ID proof.",
      "Real-time verification and card issuance.",
      "Digital and physical card options available."
    ],
    bgClass: "bg-white",
  },
  {
    icon: "🏥",
    title: "Partnered Hospitals & Clinics",
    description: [
      "More than 200 hospitals under the scheme.",
      "Cashless treatments for covered procedures.",
      "Regular health camps and wellness checkups."
    ],
    bgClass: "bg-light",
  }
];

// GET /api/card-services
router.get("/", (req, res) => {
  res.json(Janarogycard);
});

module.exports = router;
