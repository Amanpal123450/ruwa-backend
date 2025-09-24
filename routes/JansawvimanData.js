const express = require("express");
const router = express.Router();

// Static Services Data
const JansawvimanData = [
  {
    icon: '🆔',
    title: 'Welfare Eligibility Check',
    description: [
      'Available to low-income families and senior citizens.',
      'Priority for rural and semi-urban areas.',
      'Minimal documentation required.'
    ],
    bgClass: 'bg-white'
  },
  {
    icon: '🛡️',
    title: 'Social Security Coverage',
    description: [
      'Access to welfare pensions and medical aid.',
      'Education benefits for children.',
      'Subsidized services for women and elderly.'
    ],
    bgClass: 'bg-light'
  },
  {
    icon: '🧾',
    title: 'Easy Documentation',
    description: [
      'Aadhaar card, income certificate accepted.',
      'Simple one-page application process.',
      'Assistance centers for document upload.'
    ],
    bgClass: 'bg-white'
  },
  {
    icon: '🚑',
    title: 'Free Ambulance & Emergency Services',
    description: [
      '24/7 ambulance access in rural areas.',
      'Priority support during medical emergencies.',
      'Includes transport to partnered hospitals.'
    ],
    bgClass: 'bg-light'
  }
];

// GET /api/services
router.get("/", (req, res) => {
  res.json(JansawvimanData);
});

module.exports = router;
