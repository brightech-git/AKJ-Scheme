// Verhoeff Algorithm Tables
const verhoeffMultiplicationTable = [
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  [1, 2, 3, 4, 0, 6, 7, 8, 9, 5],
  [2, 3, 4, 0, 1, 7, 8, 9, 5, 6],
  [3, 4, 0, 1, 2, 8, 9, 5, 6, 7],
  [4, 0, 1, 2, 3, 9, 5, 6, 7, 8],
  [5, 9, 8, 7, 6, 0, 4, 3, 2, 1],
  [6, 5, 9, 8, 7, 1, 0, 4, 3, 2],
  [7, 6, 5, 9, 8, 2, 1, 0, 4, 3],
  [8, 7, 6, 5, 9, 3, 2, 1, 0, 4],
  [9, 8, 7, 6, 5, 4, 3, 2, 1, 0],
];

const verhoeffPermutationTable = [
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  [1, 5, 7, 6, 2, 8, 3, 0, 9, 4],
  [5, 8, 0, 3, 7, 9, 6, 1, 4, 2],
  [8, 9, 1, 6, 0, 4, 3, 5, 2, 7],
  [9, 4, 5, 3, 1, 2, 6, 8, 7, 0],
  [4, 2, 8, 6, 5, 7, 3, 9, 0, 1],
  [2, 7, 9, 3, 8, 0, 6, 4, 1, 5],
  [7, 0, 4, 6, 9, 1, 3, 2, 5, 8],
];

// Verhoeff algorithm implementation
const verhoeffValidation = (aadhaarNumber) => {
  try {
    const digits = aadhaarNumber.split("").map(Number).reverse();
    let checksum = 0;

    for (let i = 0; i < digits.length; i++) {
      checksum =
        verhoeffMultiplicationTable[checksum][
          verhoeffPermutationTable[i % 8][digits[i]]
        ];
    }

    return checksum === 0;
  } catch (error) {
    console.error("Error in Verhoeff validation:", error);
    return false;
  }
};

// Validation functions
export const validateAadhaar = (aadhaar) => {
  const cleanAadhaar = aadhaar.replace(/[\s-]/g, "");

  if (!cleanAadhaar) {
    return "Aadhaar Number is required";
  }

  const aadhaarRegex = /^\d{12}$/;
  if (!aadhaarRegex.test(cleanAadhaar)) {
    return "Aadhaar should be exactly 12 digits";
  }

  if (/^(\d)\1{11}$/.test(cleanAadhaar)) {
    return "Invalid Aadhaar number (all digits are same)";
  }

  const invalidPatterns = [
    "000000000000",
    "111111111111",
    "222222222222",
    "333333333333",
    "444444444444",
    "555555555555",
    "666666666666",
    "777777777777",
    "888888888888",
    "999999999999",
    "123456789012",
    "012345678901",
  ];

  if (invalidPatterns.includes(cleanAadhaar)) {
    return "Invalid Aadhaar number format";
  }

  if (!verhoeffValidation(cleanAadhaar)) {
    return "Invalid Aadhaar number (checksum validation failed)";
  }

  return "";
};

export const validatePAN = (pan) => {
  const cleanPAN = pan.replace(/\s/g, "").toUpperCase();

  if (!cleanPAN) {
    return "PAN Number is required";
  }

  const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
  if (!panRegex.test(cleanPAN)) {
    return "Invalid PAN format. Should be like ABCDE1234F";
  }

  const fourthChar = cleanPAN.charAt(3);
  const validEntityCodes = ["P", "F", "C", "H", "A", "T", "B", "L", "J", "G"];
  if (!validEntityCodes.includes(fourthChar)) {
    return "Invalid PAN format. 4th character should be a valid entity code";
  }

  return "";
};

export const validateMobile = (mobile) => {
  const cleanMobile = mobile.replace(/\D/g, "");

  if (!cleanMobile) {
    return "Mobile number is required";
  }

  if (cleanMobile.length !== 10) {
    return "Mobile number should be exactly 10 digits";
  }

  if (!/^[6-9]/.test(cleanMobile)) {
    return "Mobile number should start with 6, 7, 8, or 9";
  }

  if (/^(\d)\1{9}$/.test(cleanMobile)) {
    return "Invalid mobile number (all digits are same)";
  }

  return "";
};

export const validateEmail = (email) => {
  const cleanEmail = email.trim().toLowerCase();

  if (!cleanEmail) {
    return "Email is required";
  }

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(cleanEmail)) {
    return "Please enter a valid email address";
  }

  if (cleanEmail.length > 254) {
    return "Email address is too long";
  }

  if (cleanEmail.includes("..")) {
    return "Email address cannot have consecutive dots";
  }

  return "";
};

export const validatePincode = (pincode) => {
  const cleanPincode = pincode.replace(/\D/g, "");

  if (!cleanPincode) {
    return "Pincode is required";
  }

  if (cleanPincode.length !== 6) {
    return "Please enter a valid 6-digit pincode";
  }

  if (cleanPincode.startsWith("0")) {
    return "Invalid pincode (cannot start with 0)";
  }

  return "";
};

export const validateAge = (dob) => {
  if (!dob) {
    return "Date of Birth is required";
  }

  const today = new Date();
  const birthDate = new Date(dob);

  if (birthDate > today) {
    return "Date of Birth cannot be in the future";
  }

  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }

  if (age < 18) {
    return "Member must be at least 18 years old";
  }

  if (age > 120) {
    return "Please enter a valid date of birth";
  }

  return "";
};