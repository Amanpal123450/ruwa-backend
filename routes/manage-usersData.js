// routes/dashboardRoutes.js
const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  const manageusersData = {
    apiConfig: {
      baseUrl: "https://ruwa-backend.onrender.com/api/employee",
      endpoints: {
        getPatients: "/get/patient",
        createPatient: "/create/patient",
        notifyAdmin: "/notify/admin",
        updateUserStatus: "/users/:userId/status",
        deleteUser: "/users/:userId",
      },
    },
    defaultNewUser: {
      name: "",
      phone: "",
      email: "",
      age: "",
      aadhar: "",
      purpose: "",
      status: "active",
    },
    purposeOptions: [
      { value: "", label: "Select Purpose" },
      { value: "Job Application", label: "Job Application" },
      { value: "Service Inquiry", label: "Service Inquiry" },
      { value: "Complaint", label: "Complaint" },
      { value: "Meeting", label: "Meeting" },
      { value: "Delivery", label: "Delivery" },
      { value: "Other", label: "Other" },
    ],
    statusOptions: [
      { value: "active", label: "Active" },
      { value: "inactive", label: "Inactive" },
      { value: "pending", label: "Pending" },
      { value: "suspended", label: "Suspended" },
    ],
    filterStatusOptions: [
      { value: "all", label: "All Status" },
      { value: "active", label: "Active" },
      { value: "inactive", label: "Inactive" },
      { value: "pending", label: "Pending" },
      { value: "suspended", label: "Suspended" },
    ],
    statusBadgeClasses: {
      active: "status-active",
      inactive: "status-inactive",
      pending: "status-pending",
      suspended: "status-suspended",
    },
    pagination: {
      usersPerPage: 10,
      defaultPage: 1,
    },
    formValidation: {
      age: { min: 18, max: 100 },
      aadhar: {
        pattern: "[0-9]{4}-[0-9]{4}-[0-9]{4}",
        placeholder: "1234-5678-9012",
      },
      phone: { placeholder: "+91 1234567890" },
      email: { placeholder: "user@example.com" },
    },
    statsCards: [
      {
        id: "active",
        title: "Active Today",
        icon: "fas fa-user-check",
        className: "stats-primary",
        filter: "active",
      },
      {
        id: "pending",
        title: "Pending Today",
        icon: "fas fa-hourglass-half",
        className: "stats-warning",
        filter: "pending",
      },
      {
        id: "total",
        title: "Total Today",
        icon: "fas fa-users",
        className: "stats-success",
        filter: null,
      },
      {
        id: "date",
        title: "Today's Date",
        icon: "fas fa-calendar-alt",
        className: "stats-info stats-primary",
        showDate: true,
      },
    ],
    actionButtons: [
      {
        action: "setActive",
        label: "Set Active",
        icon: "fas fa-check",
        iconColor: "text-success",
        status: "active",
      },
      {
        action: "setInactive",
        label: "Set Inactive",
        icon: "fas fa-pause",
        iconColor: "text-secondary",
        status: "inactive",
      },
      {
        action: "setPending",
        label: "Set Pending",
        icon: "fas fa-clock",
        iconColor: "text-warning",
        status: "pending",
      },
      {
        action: "suspend",
        label: "Suspend",
        icon: "fas fa-ban",
        iconColor: "text-danger",
        status: "suspended",
      },
    ],
    tableColumns: [
      { key: "id", label: "ID" },
      { key: "user", label: "User" },
      { key: "contact", label: "Contact" },
      { key: "aadhar", label: "Aadhar" },
      { key: "purpose", label: "Purpose" },
      { key: "status", label: "Status" },
      { key: "joinTime", label: "Join Time" },
      { key: "actions", label: "Actions" },
    ],
    messages: {
      noUsersToday: "No users registered today",
      noMatchingUsers: "No users found matching your criteria",
      loadingUsers: "Loading users...",
      deleteConfirmation: "Are you sure you want to delete this user?",
      userAddedSuccess: "added successfully and notified admin!",
      userAddedError: "Failed to add user. Please try again.",
      statusUpdateSuccess: "User status updated to",
      statusUpdateError: "Failed to update user status.",
      userDeletedSuccess: "User deleted successfully",
      userDeleteError: "Failed to delete user.",
    },
    profilePicGenerator: {
      baseUrl: "https://randomuser.me/api/portraits",
      genders: ["men", "women"],
      maxId: 50,
    },
  };

  res.json(manageusersData);
});

module.exports = router;
