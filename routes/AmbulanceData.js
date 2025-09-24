const express = require("express");
const router = express.Router();

// Static Ambulance Services Data
const ambulanceData = [
  {
    icon: '🚑',
    title: '24x7 Ambulance Service',
    description: [
      'Emergency response: Quick and reliable ambulance dispatch anytime.',
      'GPS tracking: Real-time ambulance location updates.',
      'Certified staff: Trained paramedics for on-the-spot care.',
      'Coverage areas: Available across urban and rural zones.'
    ],
    bgClass: 'bg-white'
  },
  {
    icon: '🧑‍⚕️',
    title: 'Advanced Life Support Ambulance',
    description: [
      'Equipped with ICU-grade facilities.',
      'Oxygen support, defibrillator, and critical care monitoring.',
      'Ideal for critical or long-distance transfers.'
    ],
    bgClass: 'bg-light'
  },
  {
    icon: '🪪',
    title: 'Free Ambulance for Card Members',
    description: [
      'Zero cost for Lifeline Health Card holders.',
      'Covers up to 10km per ride within city limits.',
      'Priority dispatch in emergencies.'
    ],
    bgClass: 'bg-white'
  },
  {
    icon: '🛣️',
    title: 'Intercity & Long-Distance Transfers',
    description: [
      'Ambulance services between cities at subsidized rates.',
      'Comfortable and safe patient transport over long distances.',
      'Assisted by trained support staff throughout the journey.'
    ],
    bgClass: 'bg-light'
  }
];

// GET /api/ambulance-services
router.get("/", (req, res) => {
  res.json(ambulanceData);
});

module.exports = router;
