const express = require('express');
const router = express.Router();

// Combined About + Features Data
const aboutData = {
  siteName: "RUWA India",
  aboutSection: {
    subtitle: "About us",
    heading: "Welcome to RUWA India",
    shortText: "Your one-stop solution for comprehensive healthcare services and insurance.",
    paragraphs: [
      "We understand that navigating the health system can be challenging, and we are here to simplify the process, ensuring that our patients receive the care they need without any hassles.",
      "At RUWA India, we are dedicated to providing a complete range of healthcare services under one roof. Our offerings include:"
    ],
    image: "/assets/images/doctor.jpg"
  },
  cards: [
    {
      title: "Your Trusted Health Partner",
      icon: "bi-hospital text-succes",
      text: "At RUWA India, we are proud to be your one-stop solution for all healthcare services, combining comprehensive health insurance coverage with innovative treatments for life-threatening diseases. Our mission is to provide seamless access to a range of health services that cater to every individual’s needs, ensuring patient-focused care at every step."
    },
    {
      title: "Mission Statement",
      icon: "bi-lightbulb text-warning",
      text: "Our vision is to create a healthier India where everyone has access to essential healthcare services and the peace of mind that comes with adequate health insurance coverage. We combine our medical expertise with exceptional customer service to provide a seamless experience for our patients."
    },
    {
      title: "Extensive Health Insurance Options",
      icon: "bi-file-earmark-medical text-danger",
      text: "We partner with multiple reputable insurance providers, offering a variety of health insurance plans tailored to fit your needs and budget. This extensive network simplifies the process of selecting the right coverage, allowing you to focus on what matters most—your health."
    },
    {
      title: "Comprehensive Healthcare Services",
      icon: "bi-clipboard2-pulse text-info",
      text: "From preventative care and routine check-ups to advanced diagnostics and progressive treatments for critical illnesses, our experienced medical professionals are dedicated to delivering high-quality care."
    },
    {
      title: "Holistic Approach to Health",
      icon: "bi-heart-pulse text-danger",
      text: "We believe in addressing the complete health of our patients. Our holistic approach includes personalized care plans, wellness programs, and health education—tools that empower you to make informed decisions about your health and well-being."
    },
    {
      title: "Customer-Centric Philosophy",
      icon: "bi-chat-dots",
      text: "We value the trust you place in us. Our dedicated team prioritizes your needs, ensuring clear communication and support throughout your healthcare journey."
    },
    {
      title: "Join Us on Your Health Journey",
      icon: "bi-flag",
      text: "As your partner in health, RUWA India is here to navigate the complexities of healthcare and insurance with you. Together, we can achieve a healthier future."
    }
  ],
  featuresSection: {
    sectionTitle: "Why Choose Us",
    sectionText: "Welcome to RUWA India, your one-step solution for comprehensive healthcare services and insurance. We understand that navigating the health system can be challenging, and we are here to simplify the process, ensuring that our patients receive the care they need without any hassles.",
    features: [
      {
        icon: "bi-hospital text-primary",
        title: "All-in-One Healthcare",
        text: "Access diagnostic, consultation, treatment, and insurance services in one place."
      },
      {
        icon: "bi-heart-pulse text-danger",
        title: "Emergency Services",
        text: "24/7 ambulance and critical care support across urban and rural areas."
      },
      {
        icon: "bi-people text-success",
        title: "Family-Centric Plans",
        text: "Affordable health packages for individuals, families, and senior citizens."
      },
      {
        icon: "bi-shield-check text-warning",
        title: "Trusted & Secure",
        text: "Data privacy, verified hospitals, and IRDAI-approved insurance services."
      }
    ]
  }
};

// GET /api/about
router.get('/', (req, res) => {
  res.json(aboutData);
});

module.exports = router;
