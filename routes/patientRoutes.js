const express = require("express");

const { auth,authorizeRole } = require("../middlewares/auth");
const { createPatient, deletePatient, getPatients } = require("../controllers/patientVisitController");

const router = express.Router();

// Only Employees can view their profile
router.post(
  "/create/patient",
  auth,
  authorizeRole("EMPLOYEE"),
  createPatient
);
router.get(
  "/get/patient",
  auth,
  authorizeRole("EMPLOYEE"),
  getPatients
);
router.delete(
  "/delete/:id",
  auth,
  authorizeRole("EMPLOYEE"),
  deletePatient
);


module.exports = router;