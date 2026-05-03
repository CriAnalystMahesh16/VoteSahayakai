/**
 * Calculates if a user is at least 18 years old based on DOB.
 * @param {string} dob - Date of birth in YYYY-MM-DD format
 * @returns {boolean}
 */
export const calculateEligibility = (dob) => {
  if (!dob) return false;
  const birthDate = new Date(dob);
  if (isNaN(birthDate.getTime())) return false;
  
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age >= 18;
};

/**
 * Normalizes user input for booth searching.
 * @param {string} input - City or Pincode
 * @returns {string|null} - Normalized string, or null if invalid pincode
 */
export const normalizeLocationInput = (input) => {
  if (!input) return '';
  const cleaned = input.toLowerCase().trim();
  
  // If it's all numbers, ensure it's a 6 digit pincode (common in India)
  const isNumeric = /^\d+$/.test(cleaned);
  if (isNumeric && cleaned.length !== 6) {
    return null; // Invalid pincode
  }
  
  return cleaned;
};

/**
 * Validates if the entered OTP matches the generated one and is not expired.
 * @param {string} userOtp - OTP entered by user
 * @param {string} correctOtp - The real OTP
 * @param {number} generatedAt - Timestamp of when OTP was generated (ms)
 * @param {number} validityWindowMs - How long the OTP is valid (ms), default 5 mins
 * @returns {boolean}
 */
export const validateOtp = (userOtp, correctOtp, generatedAt = Date.now(), validityWindowMs = 5 * 60 * 1000) => {
  if (!userOtp || !correctOtp) return false;
  
  const now = Date.now();
  if (now - generatedAt > validityWindowMs) {
    return false; // OTP expired
  }

  return userOtp.trim() === correctOtp.trim();
};

/**
 * Formats raw API response data into the application's internal format.
 * @param {Object} data - Raw JSON from API
 * @returns {Object|null}
 */
export const formatBoothData = (data) => {
  if (!data || !data.success || !data.booth) return null;
  
  return {
    booth: data.booth,
    address: data.address || 'Address not found',
    date: data.date ? new Date(data.date).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }) : 'Coming Soon',
    time: data.time || '07:00 AM - 06:00 PM',
    documents: 'Voter ID, Aadhaar Card, or Passport'
  };
};
