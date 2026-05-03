# 🚀 Sahayak – AI-Powered Civic Voting Assistant 🇮🇳

## 📌 Overview

**Sahayak** is a civic-tech platform designed to simplify the voting journey for citizens, especially first-time voters.
It provides a guided, step-by-step experience—from eligibility checking to booth discovery and voting simulation.

The goal is to make voting **accessible, intuitive, and stress-free** using AI-driven workflows and modern web technologies.

---

## 🎯 Problem Statement

Many voters face challenges such as:

* Lack of clarity on eligibility
* Difficulty finding polling booth details
* Confusion about voting steps
* No guided experience for first-time voters

This leads to **low confidence and participation** in the electoral process.

---

## 💡 Solution

Sahayak provides a **complete guided voting journey**:

```text
Eligibility Check → Registration → OTP Verification → Booth Finder → Map Navigation → Voting Simulation (EVM)
```

---

## 🧩 Key Features

### ✅ Eligibility Checker

* Calculates age based on DOB
* Determines voting eligibility instantly

### ✅ Registration & OTP Verification

* Email-based OTP authentication
* Secure verification flow

### ✅ Booth Finder

* Search using city or pincode
* Real-time data from Google Sheets backend

### ✅ Maps Integration

* View polling booth on Google Maps
* Get navigation directions

### ✅ Voting Simulation (EVM UI)

* Candidate selection interface
* Confirmation flow like real EVM

### ✅ Dashboard (Advanced Feature)

* Civic readiness score
* Election roadmap
* Smart assistant guidance

---

## 🛠️ Tech Stack

### Frontend

* React.js
* Modern UI (Card-based + responsive design)

### Backend

* Google Apps Script (API layer)
* Google Sheets (Database)

### Deployment

* Google Cloud Run

### Integrations

* Google Maps API
* (Optional) Firebase / Google Analytics

### AI / No-Code

* Antigravity (for rapid feature development)

---

## 🏗️ Architecture

```text
Frontend (React)
      ↓
API Layer (Google Apps Script)
      ↓
Database (Google Sheets)
      ↓
External APIs (Google Maps)
```

---

## 🔄 Project Flow

### 1. Eligibility Check

* User enters DOB
* System calculates age
* Displays eligibility result

---

### 2. Registration

* User enters email (and optional mobile)
* OTP is generated and sent

---

### 3. OTP Verification

* User enters OTP
* Backend validates from sheet
* Access granted

---

### 4. Onboarding

* Displays required documents
* Guides user through process

---

### 5. Booth Finder

* User enters city/pincode
* API fetches matching booth
* Displays:

  * Booth name
  * Address
  * Date & Time

---

### 6. Map Integration

* Open booth in Google Maps
* Get directions

---

### 7. Candidate Selection

* Display candidate/party list
* User selects one

---

### 8. EVM Simulation

* Show selected candidate
* Confirm vote
* Success message displayed

---

## 🧪 Testing & Quality

* Unit tests for:

  * Eligibility logic
  * Booth matching
  * OTP validation

* Integration tests for:

  * API requests/responses

* Edge cases handled:

  * Empty input
  * Invalid pincode
  * No booth found
  * Expired OTP

---

## ⚡ Performance Optimizations

* Prevent duplicate API calls
* Optimized state management
* Efficient data handling
* Loading indicators for async actions

---

## ♿ Accessibility

* Proper labels for inputs
* Keyboard navigation support
* Improved color contrast
* Semantic HTML structure

---

## 🔐 Security

* Input validation & sanitization
* Secure OTP handling
* Error masking (no internal leaks)
* Rate limiting for API calls

---

## 🎨 UI/UX Highlights

* Premium modern design
* Card-based layout
* Smooth transitions
* Mobile-first responsiveness
* EVM-inspired interface

---

## 🚀 Deployment

Deployed on **Google Cloud Run**

```bash
gcloud builds submit --tag gcr.io/PROJECT_ID/sahayak-app
gcloud run deploy sahayak-app --image gcr.io/PROJECT_ID/sahayak-app --platform managed
```

---

## 📈 Future Enhancements

* 🔐 Firebase Authentication
* 🌐 Multi-language support
* 📍 Auto-detect nearest booth
* 📊 Analytics dashboard
* 🧠 AI-powered assistant (chatbot)

---

## 🏆 Impact

Sahayak aims to:

* Increase voter awareness
* Reduce confusion
* Improve participation
* Provide a scalable civic-tech solution

---

## 📸 Screenshots

*Add your UI screenshots here*

---

## 👤 Author

**Mahesh Waghmode**
AI Developer | Civic-Tech Builder | Content Creator

---

## 🔗 Connect

* LinkedIn: *Add your profile link*
* GitHub: *Add your repo link*

---

## 📢 Tags

#BuildwithAI #PromptWarsVirtual #CivicTech #AI #React #GoogleCloud
