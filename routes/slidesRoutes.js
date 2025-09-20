const express = require("express");
const router = express.Router(); 

 const slides = [
    {
      src: 'https://res.cloudinary.com/dknrega1a/image/upload/v1758372358/inch_ytmzl2.jpg',
      title: 'Inclusive Healthcare',
      text: 'Bringing care to every doorstep with compassion and innovation.',
      icon: '🩺',
    },
    {
      src: 'https://res.cloudinary.com/dknrega1a/image/upload/v1758372346/digo_bt2obn.jpg',
      title: 'Digital Healthcare',
      text: 'Leveraging technology to connect rural patients with specialists.',
      icon: '💻',
    },
    {
      src: 'https://res.cloudinary.com/dknrega1a/image/upload/v1758372341/ambulance_swblng.jpg',
      title: 'Rapid Ambulance Service',
      text: 'Emergency response at lightning speed across all terrains.',
      icon: '🚑',
    },
    {
      src: 'https://res.cloudinary.com/dknrega1a/image/upload/v1758372346/doctor_na9zha.jpg',
      title: 'Skilled Medical Professionals',
      text: 'Our team of dedicated doctors ensures expert treatment for all.',
      icon: '👨‍⚕️',
    },
    {
      src: 'https://res.cloudinary.com/dknrega1a/image/upload/v1758372358/village_sec_f3y2uz.jpg',
      title: 'Serving Rural Communities',
      text: 'We ensure even the remotest villages receive reliable healthcare.',
      icon: '🏥',
    },
    {
      src: 'https://res.cloudinary.com/dknrega1a/image/upload/v1758372358/village_sec_f3y2uz.jpg',
      title: 'Healthcare Awareness in Villages',
      text: 'Educating and empowering local communities with health knowledge.',
      icon: '📚',
    },
    {
      src: 'https://res.cloudinary.com/dknrega1a/image/upload/v1758372358/village_third_oio48g.jpg',
      title: 'Community Health Drives',
      text: 'Organizing regular camps for checkups, vaccinations, and education.',
      icon: '🧪',
    },
    {
      src: 'https://res.cloudinary.com/dknrega1a/image/upload/v1758372353/medical_csadwy.jpg',
      title: 'Affordable Medical Insurance',
      text: 'Secure your family’s future with our easy-to-access plans.',
      icon: '💊',
    },
  ];

  const testimonials = [
  {
    name: "Rajesh Kumar",
    image: "https://res.cloudinary.com/dknrega1a/image/upload/v1758372353/person-sq-1-min_hvxoz9.jpg",
    message:
      "RUWA INDIA provides the best diagnostic services I have experienced. Highly recommended for their reliable results and friendly staff.",
  },
  {
    name: "Anil Sharma",
    image: "https://res.cloudinary.com/dknrega1a/image/upload/v1758372354/person-sq-2-min_y0gsjl.jpg",
    message:
      "Their ambulance service saved my family member’s life. Quick response and professional care made all the difference.",
  },
  {
    name: "Priya Singh",
    image: "https://res.cloudinary.com/dknrega1a/image/upload/v1758372354/person-sq-3-min_zqtdts.jpg",
    message:
      "I trust RUWA INDIA with my health. Their commitment to quality and affordability is unmatched in the area.",
  },
  {
    name: "Kavita Joshi",
    image: "https://res.cloudinary.com/dknrega1a/image/upload/v1758372354/person-sq-4-min_qdj0vc.jpg",
    message:
      "Booking appointments and accessing reports has never been easier. RUWA’s digital platform is incredibly user-friendly.",
  },
  {
    name: "Rohit Verma",
    image: "https://res.cloudinary.com/dknrega1a/image/upload/v1758372354/person-sq-5-min_hg4snx.jpg",
    message:
      "RUWA’s customer service is exceptional. I received immediate assistance during a critical time. Forever grateful.",
  },
  {
    name: "Neha Kapoor",
    image: "https://res.cloudinary.com/dknrega1a/image/upload/v1758372354/person-sq-5-min_hg4snx.jpg",
    message:
      "Affordable pricing, efficient diagnosis, and caring staff—RUWA INDIA is redefining health access in our community.",
  },
];


const hero = {
  subtitle: "RUWA INDIA",
  title: "Welcome to RUWA INDIA",
  paragraph1: "Your trusted partner in healthcare and insurance.",
  paragraph2:
    "We know that dealing with the health system can be difficult. That’s why we’re here — to make things simple and help you get the care you need without any stress.",
  ctaButtons: [
    { text: "Get Started Now", type: "primary", link: "/login" },
    { text: "Learn More", type: "outline", link: "/learnmore" }
  ],
  heroImage: "https://res.cloudinary.com/dknrega1a/image/upload/v1758372346/aboutus_rzh8rh.png"
};


const services = [
  {
    id: 1,
    icon: "🪪",
    title: "Jan Arogya Card",
    description:
      "Avail affordable health services through the Jan Arogya Card, giving you seamless access to top hospitals and cashless treatments across our partner network.",
    buttonText: "Apply Now",
    buttonLink: "/apply-arogya",
    buttonColor: "success"
  },
  {
    id: 2,
    icon: "🚑",
    title: "Emergency Ambulance Service",
    description:
      "Quick and reliable ambulance support during emergencies. Our service ensures timely medical transport for patients with fully equipped vehicles and trained personnel.",
    buttonText: "Book Ambulance",
    buttonLink: "/apply-ambulance",
    buttonColor: "danger"
  },
  {
    id: 3,
    icon: "🛡️",
    title: "Health Insurance Coverage",
    description:
      "Protect yourself and your loved ones with our affordable and comprehensive health insurance plans. Enjoy cashless treatments, wide hospital networks, and peace of mind.",
    buttonText: "Apply for Insurance",
    buttonLink: "/apply-insurance",
    buttonColor: "primary"
  },
  {
    id: 4,
    icon: "🏢",
    title: "Jan Arogya Kendra",
    description:
      "We've streamlined the process into four clear steps. Follow the path below to launch your Jan Arogya Kendra.",
    buttonText: "Apply for Kendra",
    buttonLink: "/apply-kendr",
    buttonColor: "danger"
  }
];



router.get("/", (req, res) => {
  res.json({
    success: true,
    slides,
    testimonials,
    hero,
    services
  });
});

module.exports = router;