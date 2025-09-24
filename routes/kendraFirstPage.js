const express = require('express');
const router = express.Router();

// Franchise Section Data
const franchiseData = {
  heroSection: {
    title: "Join Us in Building a Healthier India",
    description: "Become a RUWA INDIA franchise partner and bring accessible, affordable healthcare to your community.",
    image: "https://res.cloudinary.com/dknrega1a/image/upload/v1758372351/jansevakendra_bndxaq.jpg",
    
  },
  franchiseModels: {
    title: "Choose Your Franchise Model",
    subtitle: "We offer three distinct models to suit different investment levels and community needs.",
    models: [
      {
        step: "S1",
        title: "Essential Care",
        description: "The foundational model focused on essential diagnostic and pharmaceutical services.",
        features: ["Basic Pathology Lab", "Generic Medicine Centre"],
        badge: null
      },
      {
        step: "S2",
        title: "Enhanced Diagnostics",
        description: "An advanced model with expanded diagnostics for comprehensive health evaluations.",
        features: [
          "All S1 Services",
          "Advanced Pathology Lab",
          "Diagnosis Centre (ECG, etc.)"
        ],
        badge: "Popular"
      },
      {
        step: "S3",
        title: "Comprehensive Hub",
        description: "A complete healthcare solution offering full primary care and emergency response.",
        features: [
          "All S2 Services",
          "MBBS Doctor Availability",
          "Ambulance Service"
        ],
        badge: null
      }
    ]
  }
};

// Eligibility and Advisor Data
const eligibilityData = {
  eligibilityStats: [
    { name: "< 10 Lakhs", value: 25 },
    { name: "10 - 25 Lakhs", value: 30 },
    { name: "25 - 50 Lakhs", value: 30 },
    { name: "> 50 Lakhs", value: 15 }
  ],
  recommendationStats: [
    { name: "Kiosk", value: 30 },
    { name: "Mini", value: 40 },
    { name: "Standard", value: 20 },
    { name: "Mega", value: 10 }
  ],
  generalRequirements: [
    "Commitment to providing affordable healthcare.",
    "Financial stability for investment and operations.",
    "Suitable premises: Min. 200 sq. ft. (S1), 400 sq. ft. (S2), 600 sq. ft. (S3).",
    "Willingness to obtain all necessary licenses and comply with regulations.",
    "Clean legal and financial record."
  ],
  applicantTypes: [
    "Individuals",
    "Partnership Firms",
    "Private Ltd. Companies",
    "Trusts / Societies / NGOs"
  ],
  personnelRequirements: [
    {
      category: "S1",
      requirement: "Lab Technician (DMLT/B.Sc. MLT) + Pharmacist (D.Pharma/B.Pharma)"
    },
    {
      category: "S2",
      requirement: "S1 + possible MD Pathologist"
    },
    {
      category: "S3",
      requirement: "S2 + MBBS Doctor, EMT, Ambulance driver"
    }
  ],
  mandatoryLicenses: "Drug License, Clinical Establishment Registration, etc."
};

// Journey Steps Data
const journeyData = {
  title: "Your Journey to Becoming a Franchisee",
  subtitle: "We've streamlined the process into four clear steps. Follow the path below to launch your Jan Arogya Kendra.",
  steps: [
    {
      step: 1,
      title: 'Initial Application',
      description: 'Begin by submitting your Letter of Intent (LOI) and the completed Franchise Application Form, along with the required initial documents.',
      keyActions: [
        'Submit Application Form & LOI',
        'Provide initial identity & financial proofs'
      ]
    },
    {
      step: 2,
      title: 'Due Diligence & MOU',
      description: "Our team will review your application. If shortlisted, we'll proceed with due diligence and sign a Memorandum of Understanding (MOU) to formalize our mutual interest.",
      keyActions: [
        'Cooperate with information verification',
        'Sign the non-binding MOU'
      ]
    },
    {
      step: 3,
      title: 'Provisional Approval & Setup',
      description: "Upon successful due diligence, you'll receive provisional approval. This is the phase to secure all necessary licenses and prepare your premises as per our standards.",
      keyActions: [
        'Obtain Drug License, Clinical Establishment Reg., etc.',
        'Finalize site setup and infrastructure'
      ]
    },
    {
      step: 4,
      title: 'Final Agreement & Launch',
      description: "Once all legal and operational requirements are met, we will sign the definitive Franchise Agreement. You'll receive final training and support for your grand opening!",
      keyActions: [
        'Sign the binding Franchise Agreement',
        'Complete final training',
        'Launch your Jan Arogya Kendra'
      ]
    }
  ]
};

// Documents Data
const documentsData = {
  title: "Key Documents & Forms",
  subtitle: "Familiarize yourself with the core documents that govern our partnership. Here you can review the MOU, Application Form, LOI, and the complete document checklist.",
  tabs: [
    {
      id: "checklist",
      title: "Document Checklist",
      active: true
    },
    {
      id: "form",
      title: "Application Form",
      active: false
    },
    {
      id: "mou",
      title: "MOU",
      active: false
    },
    {
      id: "loi",
      title: "Letter of Intent",
      active: false
    }
  ],
  documentChecklist: {
    allApplicants: [
      "Completed Application Form",
      "Proof of Identity (PAN, Aadhaar, etc.)",
      "Proof of Address (Utility Bill, etc.)",
      "Financial Documents (Bank Statements, ITRs)",
      "Applicant's Profile / Resume",
      "Proposed Premises Details (Photos, Layout, Ownership/Lease proof)"
    ],
    entities: [
      "Registration Certificates (Partnership Deed, Certificate of Incorporation, etc.)",
      "Entity PAN Card",
      "Authorizing Documents (Board Resolution, Consent Letter)",
      "Identity proofs of all Directors/Partners/Trustees"
    ],
    provisionalApproval: [
      "Drug License, Clinical Establishment Reg., Fire Safety NOC, etc.",
      "Qualification Certificates for medical & technical staff",
      "Ambulance Registration & Fitness Certificate (for S3)"
    ]
  },
  applicationForm: {
    title: "Franchise Application Form (Overview)",
    description: "This form collects essential details for your application. Ensure all information is accurate.",
    sections: [
      {
        title: "Applicant Details",
        description: "Contact and professional background"
      },
      {
        title: "Franchise Location",
        description: "City, locality, premises details"
      },
      {
        title: "Franchise Interest",
        description: "Preferred category (S1/S2/S3) and motivation"
      },
      {
        title: "Financial Info",
        description: "Investment capacity and source of funds"
      },
      {
        title: "Declaration",
        description: "Confirmation of information accuracy"
      }
    ]
  },
  mou: {
    title: "Memorandum of Understanding (MOU) Summary",
    description: "The MOU is a non-binding document outlining the initial understanding between you and RUWA INDIA.",
    keyClauses: [
      {
        title: "Purpose",
        description: "Explore franchise partnership"
      },
      {
        title: "Due Diligence",
        description: "Agree to cooperate in good faith"
      },
      {
        title: "Confidentiality",
        description: "Protect shared information"
      },
      {
        title: "Non-Binding",
        description: "Not the final agreement"
      },
      {
        title: "Term",
        description: "Valid typically for 3 months"
      }
    ]
  },
  loi: {
    title: "Letter of Intent (LOI) Summary",
    description: "The LOI is your formal expression of interest in joining the franchise program.",
    inclusions: [
      "Your name/company name and address",
      "Statement of franchise interest",
      "Preferred category and location",
      "Acknowledgement of non-binding nature",
      "Commitment to due diligence",
      "Your contact details"
    ]
  },
  ctaSection: {
    title: "Ready to Take the Next Step?",
    description: "If you're passionate about making a difference in healthcare, begin your application. Download the forms, prepare your documents, and join us on this journey.",
    image: "https://res.cloudinary.com/dknrega1a/image/upload/v1758372344/arogaykendrathi_cp3f08.png",
    buttons: [
      {
        text: "Email Your LOI",
        variant: "primary",
        href: "mailto:franchise@ruwaindia.com"
      },
      {
        text: "Review Documents",
        variant: "outline-secondary",
        href: "#documents"
      }
    ],
    footer: {
      copyright: "© 2025 RUWA INDIA. All Rights Reserved.",
      website: "www.ruwaindia.com",
      disclaimer: "This page is informational only and does not constitute a franchise offer. A franchise is only offered via a Franchise Disclosure Document (FDD)."
    }
  }
};

// Route: Get Franchise Section Data
router.get('/franchise-section', (req, res) => {
  try {
    res.status(200).json({
      success: true,
      message: "Franchise section data retrieved successfully",
      data: franchiseData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error retrieving franchise section data",
      error: error.message
    });
  }
});

// Route: Get Eligibility and Advisor Data
router.get('/eligibility-advisor', (req, res) => {
  try {
    res.status(200).json({
      success: true,
      message: "Eligibility and advisor data retrieved successfully",
      data: eligibilityData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error retrieving eligibility data",
      error: error.message
    });
  }
});

// Route: Get Journey Steps Data
router.get('/franchise-journey', (req, res) => {
  try {
    res.status(200).json({
      success: true,
      message: "Franchise journey data retrieved successfully",
      data: journeyData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error retrieving journey data",
      error: error.message
    });
  }
});

// Route: Get Documents Data
router.get('/key-documents', (req, res) => {
  try {
    res.status(200).json({
      success: true,
      message: "Key documents data retrieved successfully",
      data: documentsData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error retrieving documents data",
      error: error.message
    });
  }
});

// Main Route: Get All Franchise Page Data (Single API Call)
router.get('/kendra-first/page-data', (req, res) => {
  try {
    const pageData = {
      franchiseSection: franchiseData,
      eligibilityAdvisor: eligibilityData,
      franchiseJourney: journeyData,
      keyDocuments: documentsData,
      metadata: {
        pageTitle: "RUWA INDIA Franchise Program",
        pageDescription: "Join RUWA INDIA's franchise network and make healthcare accessible in your community",
        lastUpdated: new Date().toISOString(),
        version: "1.0.0"
      }
    };

    res.status(200).json({
      success: true,
      message: "Franchise page data retrieved successfully",
      data: pageData,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error retrieving franchise page data",
      error: error.message
    });
  }
});

// Route: Submit Franchise Advisor Form




module.exports = router;