const Contact = require("../model/contactSettingsSchema");

// Get contact info (for frontend display)
exports.getContact = async (req, res) => {
  try {
    const contact = await Contact.findOne(); // Only one contact record
    res.json(contact);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Create new contact info (only used once, or if reset)
exports.createContact = async (req, res) => {
  try {
    const contact = new Contact(req.body);
    await contact.save();
    res.status(201).json(contact);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update contact info
exports.updateContact = async (req, res) => {
  try {
    const contact = await Contact.findOneAndUpdate({}, req.body, {
      new: true,
      runValidators: true,
    });
    res.json(contact);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
