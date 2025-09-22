const aboutPagewelcome = require("../../model/aboutPageModel/aboutPagewelcome");
const aboutPageFeatures = require("../../model/aboutPageModel/aboutPageFeatures");


exports.getServiceHomepageData = async (req, res) => {
  try {
    const about1 = await aboutPagewelcome.find();
    const about2 = await aboutPageFeatures.find();
   

    res.json({
      success: true,
      about1,
      about2,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
