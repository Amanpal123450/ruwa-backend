const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
const { cloudinaryConnect } = require('./config/cloudinary'); 
const { connectDB } = require('./connection');
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
const http = require("http");
const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");

// Configure Cloudinary
cloudinaryConnect();

// express app
const app = express();
const PORT = process.env.PORT || 8000;

// create http server
const server = http.createServer(app);


// create socket.io server
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});


app.use(cors({
  origin: ["http://localhost:3000","http://localhost:3001","https://ruwa-india-admin.vercel.app","https://ruwa-user-employee-frontend.vercel.app"],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
}));
app.use(fileUpload({
  useTempFiles: true,
  tempFileDir: "/tmp",
  limits: { fileSize: 10 * 1024 * 1024 },
  abortOnLimit: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());


connectDB();

// routes
const authRoutes = require("./routes/authRoutes");
const popupRoutes = require("./routes/PopupRouter");
const contactRoutes = require("./routes/contactRoutes");
const janArogyaRoutes = require("./routes/janArogyaRoutes");
const ambulanceRoutes = require("./routes/ambulanceBookingRoutes");
const applyInsurance = require('./routes/applyInsuranceRoutes');
const applyKendra = require('./routes/janArogyaApplyRoutes');
const statesRouter = require("./routes/statesRouter");
const userRoutes = require("./routes/userProfile");
const employeeRoutes = require("./routes/employeeRoutes");
const adminRoutes = require("./routes/adminRoutes");
const dashBoardRoutes=require("./routes/dashBoardRoutes");
const profileRoutes=require("./routes/profileRoutes");
const attendanceRoutes=require("./routes/attendanceRoutes");
const employeeImg=require("./routes/employeeProfileImage");
const patientRoutes=require("./routes/patientRoutes");
const locationRoutes = require("./routes/locationsRoutes");

const AppDashboardRoutes=require("./routes/AppDashboardRoute");
 

const slideRoutes= require("./routes/slidesRoutes");
const testimonialsRoutes=require('./routes/testimonialsRoutes')
const serviceRoutes=require("./routes/serviceRoutes")
const heroroutes=require("./routes/heroRoutes")
const homepageRoutes=require("./routes/homepageRoutes")
const aboutRoute=require("./routes/about")
const feedbackRoutes = require("./routes/feedbackRoutes");
const serviceCardRoutes = require("./routes/servicesPageRouter/serviceCard");
const serviceFeatures = require("./routes/servicesPageRouter/serviceFeatures")
const serviceHomepageRoutes = require("./routes/servicesPageRouter/servicesHome");
const contactSettingRoutes=require("./routes/contactSettingRoutes")



app.use("/api/popup", popupRoutes);
app.use("/api/states/", statesRouter);
app.use("/api/app-dashboard/", AppDashboardRoutes);

app.use("/api/contact", contactRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/services/janarogya", janArogyaRoutes);
app.use("/api/services/ambulance-booking", ambulanceRoutes);
app.use("/api/services/apply-insurance", applyInsurance);
app.use("/api/services/apply-kendra", applyKendra);
app.use("/api/employee", employeeRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/admin",dashBoardRoutes);
app.use("/api/u",profileRoutes);
app.use("/api/uu",employeeImg);
app.use("/api/attendance",attendanceRoutes);
app.use("/api/employee",patientRoutes);
app.use("/api/location", locationRoutes);
app.use("/api/slide-routes",slideRoutes)
app.use("/api/testimonials-routes",testimonialsRoutes)
app.use("/api/service-routes",serviceRoutes)
app.use("/api/hero-routes",heroroutes)
app.use("/api/home-routes",homepageRoutes)
app.use("/api/feedback", feedbackRoutes);

app.use('/api/about', aboutRoute);
//contact
app.use("/api/contact-content",contactSettingRoutes)
// services 
app.use("/api/service-card",serviceCardRoutes)
app.use("/api/service-Features",serviceFeatures)
app.use("/api/services", serviceHomepageRoutes);

// Models
const User = require("./model/user");
const SECRET = process.env.SECRET_KEY;
if (!SECRET) {
  throw new Error("SECRET_KEY is not defined in .env file");
}
io.use(async (socket, next) => {
  try {
    const token = socket.handshake.auth.token; // frontend se bheja token
    if (!token) return next(new Error("Authentication error: Token missing"));

    const decoded = jwt.verify(token, SECRET);
    const user = await User.findById(decoded.id);

    if (!user) return next(new Error("Authentication error: User not found"));

    socket.userId = user._id;       // socket me attach kar diya
    socket.userRole = user.role;    // optional, role bhi attach kar sakte ho
    next();
  } catch (err) {
    console.error("Socket auth error:", err.message);
    next(new Error("Authentication error: Invalid token"));
  }
});

// 🔹 Socket.IO for online/offline tracking
io.on("connection", (socket) => {
  console.log("⚡ New client connected:", socket.id);

  // Register using socket.userId directly
  socket.on("register", async () => {
    if (!socket.userId) return console.error("❌ socket.userId missing");

    await User.findByIdAndUpdate(socket.userId, {
      socketId: socket.id,
      isOnline: true,
      lastSeen: new Date(),
    });
    console.log(`✅ User ${socket.userId} is online`);
  });

  socket.on("disconnect", async () => {
    console.log("❌ Client disconnected:", socket.id);
    const user = await User.findOne({_id: socket.userId });
    if (user) {
      user.isOnline = false;
      user.lastSeen = new Date();
      user.socketId = null;
      await user.save();
      console.log(`❌ User ${user._id} is offline`);
    }
  });
});




server.listen(PORT, () => console.log(`Server started on port ${PORT}`));
