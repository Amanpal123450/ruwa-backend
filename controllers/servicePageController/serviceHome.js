const serviceCard = require("../../model/servicesPageModel/serviceCard");
const serviceFeature = require("../../model/servicesPageModel/serviceFeatures");


exports.getServiceHomepageData = async (req, res) => {
  try {
    const serviceCards = await serviceCard.find();
    const serviceFeatures = await serviceFeature.find();
   

    res.json({
      success: true,
      serviceCards,
      serviceFeatures
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
