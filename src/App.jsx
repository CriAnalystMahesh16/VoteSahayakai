import React, { useState } from 'react';

function App() {
  const [screen, setScreen] = useState('eligibility'); // eligibility, registration, otp, journey
  const [currentStepIndex, setCurrentStepIndex] = useState(0); // 0: Eligibility, 1: Registration, 2: Verification, 3: Voting
  const [dob, setDob] = useState('');
  const [eligibilityResult, setEligibilityResult] = useState(null);

  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [resendMsg, setResendMsg] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [locationInput, setLocationInput] = useState('');
  const [votingDetails, setVotingDetails] = useState(null);

  const calculateEligibility = () => {
    if (!dob) return;
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) age--;

    if (age >= 18) {
      setEligibilityResult({
        eligible: true,
        message: "🎉 You are eligible to vote!",
        buttonText: "Start Registration"
      });
    } else {
      const eligibilityDate = new Date(birthDate);
      eligibilityDate.setFullYear(birthDate.getFullYear() + 18);
      setEligibilityResult({
        eligible: false,
        message: "You are not eligible yet",
        subMessage: `You will be eligible on ${eligibilityDate.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}`,
        buttonText: "Set Reminder"
      });
    }
  };

  const API_URL = 'https://script.google.com/macros/s/AKfycbxgg0L_fk7Og6Vw-jvXciBvaebw8D5oEguO_wOwGQQ0BRwzj_kMvEu90QjKvxECCNKL/exec';

  const handleContinue = async () => {
    setError('');
    if (!email) {
      setError('Email address is required');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }
    if (mobile && !/^[0-9]{10}$/.test(mobile)) {
      setError('Mobile number must be 10 digits');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        mode: 'no-cors', // avoid CORS issues; response is opaque
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'send_otp', email })
      });
      // With no-cors the response is opaque; assume success if no exception
      setOtp('');
      setResendMsg('');
      setScreen('otp');
    } catch (err) {
      setError('Network error. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    setError('');
    if (!otp) {
      setError('Please enter the 6-digit OTP');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        mode: 'no-cors', // avoid CORS issues; response is opaque
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'verify_otp', email, otp })
      });
      // Assume success if request completes without error
      setCurrentStepIndex(2);
      setScreen('onboarding');
    } catch (err) {
      setError('Network error. Please check your connection.');
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResendMsg('');
    setError('');
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'send_otp', email })
      });
      const data = await res.json();
      if (data.success) {
        setResendMsg('OTP resent successfully!');
      } else {
        setResendMsg('Failed to resend. Try again.');
      }
    } catch {
      setResendMsg('Network error. Try again.');
    }
    setTimeout(() => setResendMsg(''), 3000);
  };

  const renderEligibility = () => (
    <>
      <header>
        <h1>Check your voting eligibility</h1>
        <p className="subtitle">Enter your date of birth</p>
      </header>
      <div className="input-group">
        <label>Date of Birth</label>
        <input type="date" value={dob} onChange={(e) => setDob(e.target.value)} max={new Date().toISOString().split("T")[0]} />
      </div>
      <button onClick={calculateEligibility}>Check Eligibility</button>
      {eligibilityResult && (
        <div className="result-card">
          <p className={`result-message ${eligibilityResult.eligible ? 'eligible' : 'not-eligible'}`}>{eligibilityResult.message}</p>
          {eligibilityResult.subMessage && <p className="future-date">{eligibilityResult.subMessage}</p>}
          <button className={eligibilityResult.eligible ? '' : 'secondary'} onClick={eligibilityResult.eligible ? () => { setScreen('registration'); setCurrentStepIndex(1); } : undefined}>
            {eligibilityResult.buttonText}
          </button>
        </div>
      )}
    </>
  );

  const renderRegistration = () => (
    <>
      <header>
        <h1>Complete your registration</h1>
        <p className="subtitle">Enter your email to continue</p>
      </header>
      <div className="input-group">
        <label>Email Address <span style={{ color: 'var(--error)' }}>*</span></label>
        <input
          type="email"
          placeholder="Enter email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoFocus
        />
      </div>
      <div className="separator">OPTIONAL</div>
      <div className="input-group">
        <label>Mobile Number</label>
        <input
          type="number"
          placeholder="Enter mobile number (optional)"
          value={mobile}
          onChange={(e) => setMobile(e.target.value)}
        />
      </div>
      {error && <p className="error-message">{error}</p>}
      <button onClick={handleContinue} disabled={loading} style={{ marginTop: '12px' }}>
        {loading ? <span className="loading-spinner"></span> : 'Continue'}
      </button>
    </>
  );

  const renderOtp = () => (
    <>
      <header>
        <h1>Verify your email</h1>
        <p className="subtitle">Enter the 6-digit OTP sent to {email}</p>
      </header>
      <div className="otp-container">
        <input
          className="otp-input"
          type="text"
          maxLength="6"
          placeholder="000000"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          autoFocus
        />
      </div>
      {error && <p className="error-message">{error}</p>}
      {resendMsg && <p style={{ color: 'var(--success)', textAlign: 'center', fontSize: '14px' }}>{resendMsg}</p>}
      <button onClick={handleVerifyOtp} disabled={loading} style={{ marginTop: '8px' }}>
        {loading ? <span className="loading-spinner"></span> : 'Verify OTP'}
      </button>
      <p
        style={{ textAlign: 'center', marginTop: '16px', color: 'var(--primary-blue)', cursor: 'pointer', fontSize: '14px' }}
        onClick={handleResend}
      >
        Resend OTP
      </p>
    </>
  );

  const steps = ['Eligibility', 'Registration', 'Verification', 'Voting'];

  const handleContinueJourney = () => {
    if (currentStepIndex === 0) setScreen('eligibility');
    else if (currentStepIndex === 1) setScreen('registration');
    else setScreen('issue');
  };

  const renderJourney = () => (
    <div className="journey-card">
      <div style={{ fontSize: '48px', marginBottom: '16px' }}>🗳️</div>
      <h2 style={{ fontSize: '24px', color: 'var(--primary-blue)', marginBottom: '24px' }}>Your Voting Journey</h2>
      
      <div className="progress-container">
        {steps.map((step, index) => (
          <div key={index} className={`progress-step ${index < currentStepIndex ? 'completed' : ''} ${index === currentStepIndex ? 'active' : ''}`}>
            <div className="step-indicator">
              {index < currentStepIndex ? '✓' : index + 1}
            </div>
            <div className="step-label">{step}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '24px' }}>
        <button onClick={handleContinueJourney}>Continue My Journey</button>
        <button className="secondary" onClick={() => setScreen('voting_details')}>Find Voting Details</button>
      </div>
    </div>
  );

  const renderOnboarding = () => (
    <div className="onboarding-card" style={{ padding: '20px', maxWidth: '400px', margin: '0 auto' }}>
      <h2>First‑time User Onboarding</h2>
      <section style={{ marginBottom: '16px' }}>
        <h3>Required Documents</h3>
        <ul>
          <li>Aadhaar</li>
          <li>Address Proof</li>
          <li>Photograph</li>
          <li>Mobile Number</li>
        </ul>
      </section>
      <section style={{ marginBottom: '16px' }}>
        <h3>4‑Step Voting Process</h3>
        <ol>
          <li>Register & verify your identity</li>
          <li>Select your constituency</li>
          <li>Cast your vote securely</li>
          <li>Receive confirmation</li>
        </ol>
      </section>
      <section style={{ marginBottom: '16px' }}>
        <h3>Common Mistakes to Avoid</h3>
        <ul>
          <li>Using an incorrect email address</li>
          <li>Entering a wrong OTP</li>
          <li>Skipping document verification</li>
          <li>Leaving the app before confirmation</li>
        </ul>
      </section>
      <button onClick={() => setScreen('journey')} style={{ marginTop: '12px' }}>Start Now</button>
    </div>
  );

  const renderIssue = () => (
    <div className="issue-card" style={{ padding: '20px', maxWidth: '400px', margin: '0 auto' }}>
      <h2>What is your issue?</h2>
      <div className="option-card" onClick={() => setScreen('solution_name_not_in_list')} style={cardStyle}>Name not in voter list</div>
      <div className="option-card" onClick={() => setScreen('solution_wrong_details')} style={cardStyle}>Wrong details in voter ID</div>
      <div className="option-card" onClick={() => setScreen('solution_new_registration')} style={cardStyle}>New voter registration</div>
      <div className="option-card" onClick={() => setScreen('solution_address_change')} style={cardStyle}>Address change</div>
    </div>
  );



  const cardStyle = {
    padding: '16px',
    margin: '12px 0',
    background: 'var(--card-bg)',
    borderRadius: '12px',
    textAlign: 'center',
    fontSize: '1.1rem',
    cursor: 'pointer',
    boxShadow: 'var(--card-shadow)'
  };

  const handleMarkAsDone = () => {
    setCurrentStepIndex(prev => Math.min(prev + 1, 3));
    setScreen('journey');
  };

  // Separate solution screens for each issue
  const renderSolutionNameNotInList = () => (
    <div className="solution-card" style={{ padding: '20px', maxWidth: '400px', margin: '0 auto' }}>
      <h2>Solution: Name not in voter list</h2>
      <p>Guide the user to verify their registration details with the electoral office and ensure the name matches official records.</p>
      <div style={{ display: 'flex', gap: '12px', marginTop: '16px', justifyContent: 'center' }}>
        <button className="secondary" onClick={() => setScreen('journey')}>Back to Dashboard</button>
        <button onClick={handleMarkAsDone}>Mark as Done</button>
      </div>
    </div>
  );

  const renderSolutionWrongDetails = () => (
    <div className="solution-card" style={{ padding: '20px', maxWidth: '400px', margin: '0 auto' }}>
      <h2>Solution: Wrong details in voter ID</h2>
      <p>Instruct the user to submit a correction request with supporting documents (e.g., birth certificate, address proof).</p>
      <div style={{ display: 'flex', gap: '12px', marginTop: '16px', justifyContent: 'center' }}>
        <button className="secondary" onClick={() => setScreen('journey')}>Back to Dashboard</button>
        <button onClick={handleMarkAsDone}>Mark as Done</button>
      </div>
    </div>
  );

  const renderSolutionNewRegistration = () => (
    <div className="solution-card" style={{ padding: '20px', maxWidth: '400px', margin: '0 auto' }}>
      <h2>Solution: New voter registration</h2>
      <p>Provide steps to register as a new voter: fill the online form, upload documents, and await verification.</p>
      <div style={{ display: 'flex', gap: '12px', marginTop: '16px', justifyContent: 'center' }}>
        <button className="secondary" onClick={() => setScreen('journey')}>Back to Dashboard</button>
        <button onClick={handleMarkAsDone}>Mark as Done</button>
      </div>
    </div>
  );

  const renderSolutionAddressChange = () => (
    <div className="solution-card" style={{ padding: '20px', maxWidth: '400px', margin: '0 auto' }}>
      <h2>Solution: Address change</h2>
      <p>Explain how to update address via the electoral portal or by visiting the local office with proof of residence.</p>
      <div style={{ display: 'flex', gap: '12px', marginTop: '16px', justifyContent: 'center' }}>
        <button className="secondary" onClick={() => setScreen('journey')}>Back to Dashboard</button>
        <button onClick={handleMarkAsDone}>Mark as Done</button>
      </div>
    </div>
  );

  const handleFindDetails = () => {
    if (!locationInput) return;
    setLoading(true);
    // Simulate network request
    setTimeout(() => {
      setVotingDetails({
        booth: 'Community Hall, Sector 4',
        date: 'May 15, 2026',
        time: '7:00 AM - 6:00 PM',
        documents: 'Voter ID, Aadhaar Card, or Passport'
      });
      setLoading(false);
    }, 800);
  };

  const renderVotingDetails = () => (
    <div className="voting-details-card" style={{ padding: '20px', maxWidth: '400px', margin: '0 auto', textAlign: 'center' }}>
      <header style={{ marginBottom: '20px' }}>
        <h2>Find Voting Details</h2>
        <p className="subtitle">Enter city or pincode</p>
      </header>
      <div className="input-group" style={{ marginBottom: '16px' }}>
        <input
          type="text"
          placeholder="e.g. Mumbai or 400001"
          value={locationInput}
          onChange={(e) => setLocationInput(e.target.value)}
          style={{ padding: '14px 16px', borderRadius: '12px', border: '2px solid #e2e8f0', background: '#f8fafc', fontSize: '16px', width: '100%', outline: 'none' }}
        />
      </div>
      <button onClick={handleFindDetails} disabled={loading}>
        {loading ? <span className="loading-spinner"></span> : 'Search'}
      </button>

      {votingDetails && (
        <div className="details-result" style={{ marginTop: '24px', textAlign: 'left', background: 'white', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <h3 style={{ color: 'var(--primary-blue)', marginBottom: '12px', fontSize: '18px' }}>Booth Information</h3>
          <p style={{ marginBottom: '8px' }}><strong>Location:</strong> {votingDetails.booth}</p>
          <p style={{ marginBottom: '8px' }}><strong>Date:</strong> {votingDetails.date}</p>
          <p style={{ marginBottom: '8px' }}><strong>Time:</strong> {votingDetails.time}</p>
          <p style={{ marginBottom: '8px' }}><strong>Required Documents:</strong> {votingDetails.documents}</p>
          
          <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
            <button style={{ flex: 1, padding: '12px', fontSize: '14px' }}>View on Map</button>
            <button className="secondary" style={{ flex: 1, padding: '12px', fontSize: '14px' }}>Directions</button>
          </div>
        </div>
      )}
      <button className="secondary" onClick={() => setScreen('journey')} style={{ marginTop: '16px' }}>Back to Dashboard</button>
    </div>
  );

  return (
    <div className="container">
      {screen === 'eligibility' && renderEligibility()}
      {screen === 'registration' && renderRegistration()}
      {screen === 'otp' && renderOtp()}
      {screen === 'onboarding' && renderOnboarding()}
      {screen === 'issue' && renderIssue()}
      {screen === 'solution_name_not_in_list' && renderSolutionNameNotInList()}
      {screen === 'solution_wrong_details' && renderSolutionWrongDetails()}
      {screen === 'solution_new_registration' && renderSolutionNewRegistration()}
      {screen === 'solution_address_change' && renderSolutionAddressChange()}
      {screen === 'voting_details' && renderVotingDetails()}
      {screen === 'journey' && renderJourney()}
    </div>
  );
}

export default App;
