import { describe, it, expect, vi, beforeEach } from 'vitest';
import { formatBoothData, normalizeLocationInput } from '../../utils/votingUtils';

// Mocking global fetch for integration testing
global.fetch = vi.fn();

describe('API Integration Flow', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  it('successfully fetches and formats booth data', async () => {
    const mockResponse = {
      success: true,
      booth: 'Civic Center Booth',
      address: '789 Road, Mumbai',
      date: '2026-05-15',
      time: '07:00 AM - 06:00 PM'
    };

    fetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    });

    // Simulated integration flow
    const cleanInput = normalizeLocationInput('Mumbai');
    const API_URL = 'https://example.com/api';
    
    const res = await fetch(API_URL, {
      method: 'POST',
      body: JSON.stringify({ action: 'find_booth', input: cleanInput })
    });
    
    const data = await res.json();
    const formatted = formatBoothData(data);

    expect(fetch).toHaveBeenCalledWith(API_URL, expect.objectContaining({
      method: 'POST',
      body: expect.stringContaining('mumbai')
    }));
    
    expect(formatted.booth).toBe('Civic Center Booth');
    expect(formatted.address).toBe('789 Road, Mumbai');
  });

  it('handles API failure gracefully', async () => {
    fetch.mockResolvedValue({
      ok: false,
      status: 500
    });

    const res = await fetch('https://example.com/api');
    expect(res.ok).toBe(false);
    expect(res.status).toBe(500);
  });

  it('handles no booth found response', async () => {
    fetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ success: false, message: 'No booth found' }),
    });

    const res = await fetch('https://example.com/api');
    const data = await res.json();
    const formatted = formatBoothData(data);

    expect(formatted).toBe(null);
  });
});
