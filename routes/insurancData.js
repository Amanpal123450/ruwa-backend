const express = require("express");
const router = express.Router();

// Static Insurance Services Data
const insuranceData = [
  {
    icon: '📄',
    title: 'Comprehensive Insurance Plans',
    description: [
      'Covers hospitalization, surgeries, and critical illness.',
      'Includes outpatient consultations and diagnostics.',
      'Customizable premium and sum insured options.'
    ],
    bgClass: 'bg-white',
  },
  {
    icon: '👨‍👩‍👧‍👦',
    title: 'Family Floater Plans',
    description: [
      'One policy for entire family.',
      'Affordable premium with wider coverage.',
      'Covers parents, spouse, and children.'
    ],
    bgClass: 'bg-light',
  },
  {
    icon: '💸',
    title: 'Cashless Claims',
    description: [
      'Cashless treatment at partner hospitals.',
      'No upfront payments required.',
      'Transparent and quick claim process.'
    ],
    bgClass: 'bg-white',
  },
  {
    icon: '📞',
    title: '24x7 Claim Support',
    description: [
      'Dedicated helpline for queries.',
      'Assistance during emergencies and hospital admissions.',
      'Multilingual support for wider reach.'
    ],
    bgClass: 'bg-light',
  }
];

// GET /api/insurance-services
router.get("/", (req, res) => {
  res.json(insuranceData);
});

module.exports = router;
