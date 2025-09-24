// Route: GET /api/services/apply-kendra/static-data
const express = require('express');
const router = express.Router();

// GET route to retrieve all static data for the franchise application form
router.get('/second-page/static-data', (req, res) => {
  try {
    const staticData = {
      franchiseInfo: [
        {
          icon: "🏥",
          title: "S1 Category Franchise",
          description: [
            "200 sq. ft facility space",
            "Basic healthcare services",
            "Ideal for rural areas",
            "Lower investment requirement",
          ],
          gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        },
        {
          icon: "🏢",
          title: "S2 Category Franchise",
          description: [
            "400 sq. ft facility space",
            "Comprehensive healthcare services",
            "Semi-urban locations",
            "Moderate investment",
          ],
          gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
        },
        {
          icon: "🏬",
          title: "S3 Category Franchise",
          description: [
            "600 sq. ft facility space",
            "Advanced healthcare services",
            "Urban locations",
            "Higher investment capacity",
          ],
          gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
        },
        {
          icon: "💰",
          title: "Investment Benefits",
          description: [
            "Government subsidies available",
            "Training and support provided",
            "Brand recognition",
            "Proven business model",
          ],
          gradient: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
        },
      ],
      
      professionalBackgroundOptions: [
        "Marketing/Sales",
        "Health Care",
        "Education/Training",
        "Profit Center Management",
        "Small Business Mgmt.",
        "Other"
      ],

      formOptions: {
        titles: [
          { value: "", label: "Select Title" },
          { value: "Dr", label: "Dr" },
          { value: "Mr", label: "Mr" },
          { value: "Miss", label: "Miss" },
          { value: "Ms", label: "Ms" }
        ],
        
        businessStructures: [
          { value: "", label: "Select Business Structure" },
          { value: "Proprietorship", label: "Proprietorship" },
          { value: "Partnership", label: "Partnership" },
          { value: "Private Ltd.", label: "Private Ltd." },
          { value: "Public Ltd.", label: "Public Ltd." },
          { value: "Society", label: "Society" },
          { value: "Trust", label: "Trust" }
        ],

        categories: [
          { value: "", label: "Select Category" },
          { value: "S1", label: "S1 (200 sq. ft)" },
          { value: "S2", label: "S2 (400 sq. ft)" },
          { value: "S3", label: "S3 (600 sq. ft)" }
        ],

        setupTimelines: [
          { value: "", label: "Select Timeline" },
          { value: "Immediately", label: "Immediately" },
          { value: "Within next 3 months", label: "Within next 3 months" },
          { value: "Next 3 to 6 months", label: "Next 3 to 6 months" }
        ],

        agreementTypes: [
          { value: "", label: "Select Agreement Type" },
          { value: "Ownership", label: "Ownership" },
          { value: "Rental", label: "Rental" },
          { value: "Long Term Lease", label: "Long Term Lease" }
        ],

        locationTypes: [
          { value: "", label: "Select Location Type" },
          { value: "Commercial Area", label: "Commercial Area" },
          { value: "Residential Area", label: "Residential Area" }
        ],

        investmentRanges: [
          { value: "10-15 Lacs", label: "10-15 Lacs" },
          { value: "15-30 Lacs", label: "15-30 Lacs" },
          { value: "More than 30 Lacs", label: "More than 30 Lacs" }
        ]
      },

      defaultFormData: {
        // Personal Details
        title: "",
        name: "",
        address: "",
        phone: "",
        email: "",
        dob: "",
        gender: "",
        married: "",
        
        // Educational Qualifications
        educationalQualifications: [{ 
          qualification: "", 
          year: "", 
          institution: "" 
        }],
        
        // Current Occupation
        currentOccupation: "",
        currentEmployer: "",
        designation: "",
        previousWorkExperience: [{ 
          period: "", 
          organization: "", 
          designation: "", 
          responsibilities: "" 
        }],
        businessDetails: [{ 
          companyName: "", 
          businessType: "", 
          nature: "", 
          products: "", 
          years: "", 
          employees: "", 
          turnover: "" 
        }],
        
        // Professional Background
        professionalBackground: [],
        professionalAssociations: "",
        
        // Proposed Centre
        businessStructure: "",
        existingEntity: "",
        existingEntityName: "",
        proposedCity: "",
        proposedState: "",
        setupTimeline: "",
        sitePossession: "",
        siteDetails: {
          agreementType: "",
          leaseFrom: "",
          leaseTo: "",
          area: "",
          locationType: "",
          address: ""
        },
        siteInMind: "",
        planToRent: "",
        withinMonths: "",
        investmentRange: "",
        effortsInitiatives: "",
        reasonsForPartnership: "",
        
        // Existing fields
        aadhaar: "",
        category: "",
        relevantExperience: "",
        idProof: null,
        qualificationCertificate: null,
        financialStatement: null,
      },

      validationRules: {
        required: [
          'name', 'aadhaar', 'phone', 'address', 'businessStructure',
          'investmentRange', 'proposedCity', 'proposedState', 'category',
          'relevantExperience', 'idProof', 'qualificationCertificate',
          'financialStatement'
        ],
        phonePattern: /^\d{10}$/,
        acceptedFileTypes: ['.pdf', '.jpg', '.jpeg', '.png']
      },

      paymentInfo: {
        razorpayLink: "https://razorpay.me/@nhsindia?amount=EPec5evqGoRk2C8icWNJlQ%3D%3D",
        instructions: [
          "Complete the payment using the Razorpay link (opened in new tab)",
          "Take a screenshot of the payment confirmation",
          "Enter the Payment ID and upload the screenshot below"
        ]
      },

      tableConfigs: {
        educationalQualifications: {
          defaultRow: { qualification: "", year: "", institution: "" },
          columns: [
            { key: 'qualification', label: 'Qualification', placeholder: 'Degree/Diploma' },
            { key: 'year', label: 'Year of Passing', placeholder: 'Year' },
            { key: 'institution', label: 'Name of Institution', placeholder: 'Institution name' }
          ]
        },
        previousWorkExperience: {
          defaultRow: { period: "", organization: "", designation: "", responsibilities: "" },
          columns: [
            { key: 'period', label: 'Period', placeholder: 'Duration' },
            { key: 'organization', label: 'Organization Name', placeholder: 'Organization name' },
            { key: 'designation', label: 'Designation', placeholder: 'Designation' },
            { key: 'responsibilities', label: 'Responsibilities', placeholder: 'Responsibilities' }
          ]
        },
        businessDetails: {
          defaultRow: { 
            companyName: "", businessType: "", nature: "", products: "", 
            years: "", employees: "", turnover: "" 
          },
          columns: [
            { key: 'companyName', label: 'Company Name', placeholder: 'Company name' },
            { key: 'businessType', label: 'Business Type', placeholder: 'Proprietary/Partnership/etc' },
            { key: 'nature', label: 'Nature of Business', placeholder: 'Nature of business' },
            { key: 'products', label: 'Products/Services', placeholder: 'Products/Services' },
            { key: 'years', label: 'Years in Business', placeholder: 'Years' },
            { key: 'employees', label: 'Employees', placeholder: 'Number of employees' },
            { key: 'turnover', label: 'Turnover (Last 3 Years)', placeholder: 'Turnover amount' }
          ]
        }
      }
    };

    res.status(200).json({
      success: true,
      message: "Static data retrieved successfully",
      data: staticData
    });

  } catch (error) {
    console.error('Error fetching static data:', error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve static data",
      error: error.message
    });
  }
});

module.exports = router;