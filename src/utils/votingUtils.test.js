import { describe, it, expect } from 'vitest';
import { 
  calculateEligibility, 
  normalizeLocationInput, 
  validateOtp, 
  formatBoothData 
} from './votingUtils';

describe('Voting Utilities', () => {
  
  describe('calculateEligibility', () => {
    it('returns true for people 18 or older', () => {
      const today = new Date();
      const birthYear = today.getFullYear() - 18;
      const dob = `${birthYear}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
      expect(calculateEligibility(dob)).toBe(true);
    });

    it('returns false for people younger than 18', () => {
      const today = new Date();
      const birthYear = today.getFullYear() - 17;
      const dob = `${birthYear}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
      expect(calculateEligibility(dob)).toBe(false);
    });

    it('handles leap years correctly', () => {
      expect(calculateEligibility('2000-02-29')).toBe(true); // Assuming today is 2026
    });

    it('returns false for empty input', () => {
      expect(calculateEligibility('')).toBe(false);
    });
  });

  describe('normalizeLocationInput', () => {
    it('trims whitespace and converts to lowercase', () => {
      expect(normalizeLocationInput('  Mumbai  ')).toBe('mumbai');
      expect(normalizeLocationInput('PUNE')).toBe('pune');
    });

    it('handles empty input gracefully', () => {
      expect(normalizeLocationInput('')).toBe('');
      expect(normalizeLocationInput(null)).toBe('');
    });

    it('returns null for invalid numeric pincodes', () => {
      expect(normalizeLocationInput('12345')).toBe(null); // Too short
      expect(normalizeLocationInput('1234567')).toBe(null); // Too long
    });

    it('returns correct value for valid 6-digit pincode', () => {
      expect(normalizeLocationInput('411001')).toBe('411001');
    });
  });

  describe('validateOtp', () => {
    it('returns true for matching OTPs', () => {
      expect(validateOtp('123456', '123456')).toBe(true);
    });

    it('trims spaces before validation', () => {
      expect(validateOtp(' 123456 ', '123456')).toBe(true);
    });

    it('returns false for mismatched OTPs', () => {
      expect(validateOtp('123456', '654321')).toBe(false);
    });

    it('returns false for expired OTPs', () => {
      const generatedAt = Date.now() - (6 * 60 * 1000); // 6 mins ago
      expect(validateOtp('123456', '123456', generatedAt)).toBe(false);
    });

    it('returns true for OTP just before expiry', () => {
      const generatedAt = Date.now() - (4 * 60 * 1000); // 4 mins ago
      expect(validateOtp('123456', '123456', generatedAt)).toBe(true);
    });
  });

  describe('formatBoothData', () => {
    it('correctly formats valid API response', () => {
      const rawData = {
        success: true,
        booth: 'Central High School',
        address: '123 Street, Pune',
        date: '2026-05-15',
        time: '08:00 AM - 05:00 PM'
      };
      const formatted = formatBoothData(rawData);
      expect(formatted.booth).toBe('Central High School');
      expect(formatted.date).toContain('May'); // Locality might vary but May should be there
    });

    it('returns null if success is false', () => {
      expect(formatBoothData({ success: false })).toBe(null);
    });

    it('handles missing address with default', () => {
      const rawData = { success: true, booth: 'Booth 1' };
      expect(formatBoothData(rawData).address).toBe('Address not found');
    });
  });
});
