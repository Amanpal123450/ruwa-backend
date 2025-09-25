const { Compressor } = require("mongodb");
const AmbulanceBooking = require("../model/ambulanceBooking");

// Common booking logic
const buildBooking = async (req, res) => {
  try {
    const userId = req.user._id;

    const {
      fullName,
      phone,
      email,
      location,
      hospitalPreference,
      appointmentDate,
      preferredTime,
      message
    } = req.body;

    // Validation for required fields
    if (!fullName || !phone || !email || !location || !appointmentDate || !preferredTime) {
      return res.status(400).json({ 
        message: "Missing required fields",
        required: ["fullName", "phone", "email", "location", "appointmentDate", "preferredTime"]
      });
    }

    // Validate location data
    

    // Validate coordinates format
    
   

    const booking = new AmbulanceBooking({
      fullName,
      phone,
      email,
      location,
     
      hospitalPreference,
      appointmentDate,
      preferredTime,
      message,
      appliedBy: userId,
      status: 'PENDING', // Default status
      createdAt: new Date(),
      updatedAt: new Date()
    });

    await booking.save();
    
    res.status(201).json({ 
      message: "Ambulance booking submitted successfully", 
      booking: {
        id: booking._id,
        fullName: booking.fullName,
        phone: booking.phone,
        email: booking.email,
        location: booking.location,
        
        hospitalPreference: booking.hospitalPreference,
        appointmentDate: booking.appointmentDate,
        preferredTime: booking.preferredTime,
        status: booking.status,
        createdAt: booking.createdAt
      }
    });
    
  } catch (err) {
    console.error("Ambulance booking error:", err);
    res.status(500).json({ 
      message: "Error creating ambulance booking", 
      error: process.env.NODE_ENV === 'development' ? err.message : "Internal server error"
    });
  }
};



// USER books for self
exports.userBookAmbulance = async (req, res) => {
  return buildBooking(req, res);
};


exports.bookAmbulanceForUser = async (req, res) => {
  // const { forUserId } = req.body;
  // if (!forUserId) return res.status(400).json({ message: "forUserId is required" });
  return buildBooking(req, res);
};

// USER: Get own bookings
exports.getUserBookings = async (req, res) => {
  try {
    const phone = req.body.phone;
    const bookings = await AmbulanceBooking.find({ phone});
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: "Error fetching bookings", error: err.message });
  }
};

// EMPLOYEE: Get bookings they submitted
exports.getEmployeeBookings = async (req, res) => {
  try {
    const bookings = await AmbulanceBooking.find({ appliedBy: req.user.id })
      .populate( "name email");
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: "Error fetching bookings", error: err.message });
  }
};

// ADMIN: Get all bookings
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await AmbulanceBooking.find()
      // .populate( "name role email");
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: "Error fetching all bookings", error: err.message });
  }
};

// ADMIN: Update booking status
exports.updateBookingStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const booking = await AmbulanceBooking.findByIdAndUpdate(id, { status }, { new: true });
    res.json({ message: "Status updated", booking });
  } catch (err) {
    res.status(500).json({ message: "Error updating status", error: err.message });
  }
};

// USER or EMPLOYEE: Withdraw booking


exports.withdrawBooking = async (req, res) => {
  try {
    const phone = req.params.id; // this is the forUser's id

    const app = await AmbulanceBooking.findOneAndUpdate(
      { phone: phone },               // filter by phone
      { status: "WITHDRAWN" },       // update
      { new: true }                  // return updated doc
    );

    if (!app) {
      return res.status(404).json({ message: "Application not found" });
    }

    res.json({ message: "Status updated successfully", app });
  } catch (err) {
    res.status(500).json({
      message: "Error updating status",
      error: err.message
    });
  }
};
// ADMIN: Delete a booking
exports.deleteBookingByAdmin = async (req, res) => {
  const { _id } = req.params;
   console.log(_id)
  try {
    const booking = await AmbulanceBooking.findByIdAndDelete(_id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.json({ message: "Booking deleted successfully by Admin", booking });
  } catch (err) {
    res.status(500).json({ message: "Error deleting booking", error: err.message });
  }
};
