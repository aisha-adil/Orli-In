const allowedRoles = ["customer", "designer", "manufacturer", "admin"];

const isEmpty = (value) =>
  value === undefined || value === null || value === "";


// ================= REGISTER VALIDATION =================

exports.validateRegister = (data) => {
  const errors = [];

  // Basic required fields
  if (isEmpty(data.fullName)) errors.push("Full name is required");
  if (isEmpty(data.email)) errors.push("Email is required");
  if (isEmpty(data.phone)) errors.push("Phone is required");
  if (isEmpty(data.cnic)) errors.push("CNIC is required");
  if (isEmpty(data.dob)) errors.push("Date of birth is required");
  if (isEmpty(data.password)) errors.push("Password is required");

  // Role validation
  if (isEmpty(data.role)) {
    errors.push("Role is required");
  } else if (!allowedRoles.includes(data.role)) {
    errors.push("Invalid role");
  }

  // Address validation
  if (!data.address) {
    errors.push("Address is required");
  } else {
    if (isEmpty(data.address.country)) errors.push("Country is required");
    if (isEmpty(data.address.city)) errors.push("City is required");
    if (isEmpty(data.address.address)) errors.push("Address field is required");
  }

  // Designer role validation
  if (data.role === "designer") {
    if (!data.designerInfo) {
      errors.push("Designer info is required");
    } else {
      if (isEmpty(data.designerInfo.storeName)) {
        errors.push("Store name is required for designer");
      }
    }
  }

  // Manufacturer role validation
  if (data.role === "manufacturer") {
    if (!data.manufacturerInfo) {
      errors.push("Manufacturer info is required");
    } else {
      if (isEmpty(data.manufacturerInfo.businessName)) {
        errors.push("Business name is required");
      }
      if (isEmpty(data.manufacturerInfo.ntn)) {
        errors.push("NTN is required");
      }

      if (!data.manufacturerInfo.businessAddress) {
        errors.push("Business address is required");
      } else {
        const addr = data.manufacturerInfo.businessAddress;
        if (isEmpty(addr.country)) errors.push("Business country is required");
        if (isEmpty(addr.city)) errors.push("Business city is required");
        if (isEmpty(addr.address)) errors.push("Business address field is required");
      }

      if (
        !Array.isArray(data.manufacturerInfo.productionTypes) ||
        data.manufacturerInfo.productionTypes.length === 0
      ) {
        errors.push("At least one production type is required");
      }
    }
  }

  return errors;
};


// ================= LOGIN VALIDATION =================

exports.validateLogin = (data) => {
  const errors = [];

  if (isEmpty(data.email)) errors.push("Email is required");
  if (isEmpty(data.password)) errors.push("Password is required");

  return errors;
};


// ================= VERIFY EMAIL =================

exports.validateVerifyEmail = (data) => {
  const errors = [];

  if (isEmpty(data.email)) errors.push("Email is required");
  if (isEmpty(data.otp)) errors.push("OTP is required");
  if (data.otp && data.otp.length !== 6)
    errors.push("OTP must be 6 digits");

  return errors;
};

// ================= RESEND OTP =================

exports.validateResendOtp = (data) => {
  const errors = [];

  if (!data.email || data.email === "") {
    errors.push("Email is required");
  }

  return errors;
};