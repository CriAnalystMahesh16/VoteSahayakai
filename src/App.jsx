import React, { useState, useCallback, useMemo } from 'react';
import { 
  CheckCircle2, 
  MapPin, 
  Calendar, 
  Clock, 
  ChevronRight, 
  AlertCircle, 
  UserCheck, 
  ClipboardList, 
  Vote, 
  ArrowLeft,
  Mail,
  Smartphone,
  Home,
  Download,
  Languages,
  Monitor,
  MessageCircle,
  X,
  Bell,
  FileText,
  Map,
  PieChart,
  Activity,
  TrendingUp,
  Search,
  Globe,
  RotateCcw,
  Info
} from 'lucide-react';
import { 
  calculateEligibility as checkEligibility, 
  normalizeLocationInput, 
  validateOtp, 
  formatBoothData 
} from './utils/votingUtils';

const API_URL = 'https://script.google.com/macros/s/AKfycbzvyBpO0v_qIx8V3dM4pv2bT6MT1nVZyvxmd7Gz_zEV6H6WFIgDWXCHpKxXWOy_PhiviA/exec';
const TRANSLATIONS = {
  en: {
    appTitle: "Sahayak",
    tagline: "Simplifying the voting journey for every citizen",
    electionLive: "Election 2026 Live",
    eligibility: "Step 1: Eligibility",
    eligibilitySub: "Am I eligible to vote?",
    dob: "Date of Birth",
    checkEligibility: "Verify Eligibility",
    eligible: "🎉 You are eligible! Proceed to Step 2.",
    notEligible: "You do not meet the age requirement yet.",
    startRegistration: "Continue to Registration",
    setReminder: "Set Reminder",
    registration: "Step 2: Registration",
    registrationSub: "How to register as a voter?",
    email: "Email Address",
    mobile: "Mobile Number (Optional)",
    continue: "Complete Registration",
    verification: "Verification",
    verificationSub: "Enter the code sent to your email",
    verifyOtp: "Verify OTP",
    resendCode: "Resend Code",
    changeEmail: "Change Email",
    journey: "Your Voting Journey",
    journeySub: "Follow these 4 steps to vote",
    continueJourney: "Next Step",
    findBooth: "Find where you need to vote",
    welcome: "Welcome to Sahayak",
    onboardingSub: "Your guided path to the polling booth",
    boothDetails: "Where to vote?",
    findMyBooth: "Locate My Polling Booth",
    selectCandidate: "Step 4: Voting",
    evmConfirm: "How voting works?",
    confirmVote: "CAST PRACTICE VOTE",
    cancel: "CANCEL",
    voteRecorded: "Practice Vote Successful!",
    returnHome: "Return to Journey Dashboard",
    downloadReceipt: "Download Voter Slip",
    referenceId: "Reference ID",
    back: "Back",
    pincode: "Enter City or Pincode",
    step1: "Check Eligibility",
    step2: "Register to Vote",
    step3: "Find where you need to vote",
    step4: "Understand the Voting Process",
    helpTitle: "Need Help?",
    helpSub: "Quick solutions for common voting issues",
    resolved: "Mark as Resolved",
    dashboard: "My Voting Dashboard",
    issue1: "Name not in voter list",
    issue2: "Wrong details in voter ID",
    issue3: "New voter registration",
    issue4: "Address change",
    sol1: "Visit the official NVSP portal to verify your name in the electoral roll or contact your local BLO.",
    sol2: "Submit Form 8 on the voter portal with correct supporting documents for any modifications.",
    sol3: "Fill Form 6 on the official portal. You will need age and address proof for new registration.",
    sol4: "Submit Form 8A for transposition within the same constituency or Form 6 for shifting to a new one.",
    mobileView: "Mobile View",
    webView: "Web View",
    healthMeter: "Voting Readiness Progress",
    quickActions: "Quick Tools: Solve voting issues",
    roadmap: "The 4-Step Journey",
    notif1: "18+ citizens are eligible to register.",
    notif2: "Carry your ID to the polling station.",
    assistantTitle: "Voting AI Assistant",
    assistantGreet: "Hi! Ask me anything about eligibility, registration, finding booths, or the voting process.",
    askBooth: "Where is my booth?",
    askDocs: "What documents do I need?",
    askHow: "How do I cast my vote?",
    suggestion1: "Eligibility Check",
    suggestion2: "Booth Location",
    suggestion3: "Voting Guide",
    votingGuideTitle: "How to Vote?",
    votingGuideSub: "Step-by-step guide for election day",
    guideStep1: "Step 1: ID Check",
    guideStep1Desc: "Bring your Voter ID or Aadhaar Card.",
    guideStep2: "Step 2: Find Booth",
    guideStep2Desc: "Use our 'Locate Booth' tool to find your center.",
    guideStep3: "Step 3: Identification",
    guideStep3Desc: "Officer will verify your name and apply ink.",
    guideStep4: "Step 4: The EVM",
    guideStep4Desc: "Press the blue button next to your candidate.",
    startSimulation: "Practice Voting (EVM)",
    greeting: "Namaste",
    greetingSub: "We've simplified the complex voting process into 4 easy steps.",
    readyMsg: "🎉 You are fully prepared to vote!",
    pendingMsg: "Complete the remaining steps to be ready.",
    notifBadge: "AI",
    online: "Online",
    typing: "Typing...",
    suggestionsLabel: "How can I help?",
    downloadSlip: "Get your digital voter slip",
    roadmapDesc1: "Confirm your eligibility to vote",
    roadmapDesc2: "Complete your profile registration",
    roadmapDesc3: "Find your assigned polling booth",
    roadmapDesc4: "Learn how to use the EVM machine"
  },
  hi: {
    appTitle: "सहायक",
    electionLive: "चुनाव 2026 लाइव",
    eligibility: "मतदान पात्रता",
    eligibilitySub: "जांचें कि क्या आप बदलाव लाने के लिए तैयार हैं",
    dob: "जन्म तिथि",
    checkEligibility: "पात्रता जांचें",
    eligible: "🎉 आप मतदान के लिए पात्र हैं!",
    notEligible: "आप अभी पात्र नहीं हैं",
    startRegistration: "पंजीकरण शुरू करें",
    setReminder: "रिमाइंडर सेट करें",
    registration: "पंजीकरण",
    registrationSub: "आगे बढ़ने के लिए अपनी प्रोफ़ाइल पूरी करें",
    email: "ईमेल पता",
    mobile: "मोबाइल नंबर (वैकल्पिक)",
    continue: "जारी रखें",
    verification: "सत्यापन",
    verificationSub: "आपके ईमेल पर भेजा गया कोड दर्ज करें",
    verifyOtp: "OTP सत्यापित करें",
    resendCode: "कोड पुन: भेजें",
    changeEmail: "ईमेल बदलें",
    journey: "मतदान यात्रा",
    journeySub: "अपनी प्रगति ट्रैक करें",
    continueJourney: "यात्रा जारी रखें",
    findBooth: "बूथ विवरण खोजें",
    welcome: "सहायक में आपका स्वागत है",
    onboardingSub: "आपको शुरू करने के लिए त्वरित मार्गदर्शिका",
    boothDetails: "बूथ विवरण",
    findMyBooth: "अपना बूथ खोजें",
    selectCandidate: "उम्मीदवार चुनें",
    evmConfirm: "ईवीएम पुष्टीकरण",
    confirmVote: "वोट की पुष्टि करें",
    cancel: "रद्द करें",
    voteRecorded: "वोट सफलतापूर्वक दर्ज किया गया!",
    returnHome: "मुख्य स्क्रीन पर जाएं",
    downloadReceipt: "रसीद डाउनलोड करें",
    referenceId: "संदर्भ आईडी",
    back: "पीछे",
    pincode: "शहर या पिनकोड",
    step1: "पात्रता",
    step2: "पंजीकरण",
    step3: "सत्यापन",
    step4: "मतदान",
    helpTitle: "हम आपकी क्या मदद कर सकते हैं?",
    helpSub: "समाधान खोजने के लिए अपनी समस्या चुनें",
    resolved: "समाधान हो गया",
    dashboard: "डैशबोर्ड",
    issue1: "मतदाता सूची में नाम नहीं है",
    issue2: "वोटर आईडी में गलत विवरण",
    issue3: "नया मतदाता पंजीकरण",
    issue4: "पता परिवर्तन",
    sol1: "उपयोगकर्ता को चुनावी कार्यालय के साथ अपने पंजीकरण विवरण की जांच करने और आधिकारिक रिकॉर्ड के साथ नाम मेल खाने को सुनिश्चित करने के लिए निर्देशित करें।",
    sol2: "सहायक दस्तावेजों (जैसे जन्म प्रमाण पत्र, पता प्रमाण) के साथ सुधार अनुरोध जमा करने के लिए कहें।",
    sol3: "नए मतदाता के रूप में पंजीकरण करने के चरण प्रदान करें: ऑनलाइन फॉर्म भरें, दस्तावेज अपलोड करें और सत्यापन की प्रतीक्षा करें।",
    sol4: "चुनावी पोर्टल के माध्यम से या निवास के प्रमाण के साथ स्थानीय कार्यालय का दौरा करके पता अपडेट करने का तरीका बताएं।",
    mobileView: "मोबाइल व्यू",
    webView: "वेब व्यू",
    healthMeter: "नागरिक स्वास्थ्य स्कोर",
    quickActions: "त्वरित कार्रवाई",
    roadmap: "चुनाव रोडमैप",
    notif1: "18 वर्ष से ऊपर के सभी नागरिक पात्र हैं।",
    notif2: "अपना मतदान केंद्र खोजने के लिए 'बूथ खोजें' का उपयोग करें।",
    assistantTitle: "नागरिक सहायक",
    assistantGreet: "नमस्ते! मैं आज आपकी कैसे मदद कर सकता हूँ?",
    askBooth: "मेरा बूथ कहाँ है?",
    askDocs: "कौन से दस्तावेज चाहिए?",
    askHow: "वोट कैसे डालें?",
    suggestion1: "पात्रता जांचें",
    suggestion2: "अपना बूथ खोजें",
    suggestion3: "मतदान मार्गदर्शिका",
    votingGuideTitle: "मतदान मार्गदर्शिका",
    votingGuideSub: "मतदान प्रक्रिया के बारे में सब कुछ जो आपको जानना आवश्यक है",
    guideStep1: "अपना आईडी साथ रखें",
    guideStep1Desc: "अपना वोटर आईडी या आधार जैसा कोई सरकारी आईडी लाएं।",
    guideStep2: "अपने बूथ की पहचान करें",
    guideStep2Desc: "अपने मतदान केंद्र का पता लगाने के लिए हमारे बूथ खोजक का उपयोग करें।",
    guideStep3: "सत्यापित करें और स्याही लगाएं",
    guideStep3Desc: "मतदान अधिकारी आपकी आईडी सत्यापित करेगा और अमिट स्याही लगाएगा।",
    guideStep4: "अपना वोट डालें",
    guideStep4Desc: "अपने उम्मीदवार के लिए ईवीएम पर बटन दबाएं।",
    startSimulation: "मतदान सिमुलेशन शुरू करें",
    greeting: "नमस्ते",
    greetingSub: "आपका व्यक्तिगत नागरिक केंद्र। आइए आपको मतदान के लिए तैयार करें।",
    readyMsg: "🎉 आप चुनाव के दिन के लिए 100% तैयार हैं!",
    pendingMsg: "100% तक पहुँचने के लिए और कदम पूरे करें",
    notifBadge: "AI",
    online: "ऑनलाइन",
    typing: "टाइप कर रहा है...",
    suggestionsLabel: "सुझाव:",
    downloadSlip: "अपनी डिजिटल वोटर पर्ची अभी डाउनलोड करें!",
    roadmapDesc1: "जांचें कि क्या आप मतदान के पात्र हैं",
    roadmapDesc2: "सत्यापन के लिए अपनी प्रोफ़ाइल पंजीकृत करें",
    roadmapDesc3: "अपने मतदान केंद्र का स्थान खोजें",
    roadmapDesc4: "ईवीएम मशीन का उपयोग करने का अभ्यास करें"
  },
  mr: {
    appTitle: "सहायक",
    electionLive: "निवडणूक २०२६ लाइव्ह",
    eligibility: "मतदान पात्रता",
    eligibilitySub: "तुम्ही बदल घडवण्यासाठी तयार आहात का ते तपासा",
    dob: "जन्म तारीख",
    checkEligibility: "पात्रता तपासा",
    eligible: "🎉 तुम्ही मतदानासाठी पात्र आहात!",
    notEligible: "तुम्ही अद्याप पात्र नाही",
    startRegistration: "नोंदणी सुरू करा",
    setReminder: "रिमाइंडर सेट करा",
    registration: "नोंदणी",
    registrationSub: "पुढे जाण्यासाठी तुमची प्रोफाइल पूर्ण करा",
    email: "ईमेल पत्ता",
    mobile: "मोबाईल नंबर (पर्यायी)",
    continue: "सुरू ठेवा",
    verification: "पडताळणी",
    verificationSub: "तुमच्या ईमेलवर पाठवलेला कोड प्रविष्ट करा",
    verifyOtp: "OTP सत्यापित करा",
    resendCode: "कोड पुन्हा पाठवा",
    changeEmail: "ईमेल बदला",
    journey: "मतदान प्रवास",
    journeySub: "तुमच्या प्रगतीचा मागोवा घ्या",
    continueJourney: "प्रवास सुरू ठेवा",
    findBooth: "बूथ तपशील शोधा",
    welcome: "सहायकमध्ये आपले स्वागत आहे",
    onboardingSub: "तुम्हाला सुरू करण्यासाठी त्वरित मार्गदर्शक",
    boothDetails: "बूथ तपशील",
    findMyBooth: "माझा बूथ शोधा",
    selectCandidate: "उमेदवार निवडा",
    evmConfirm: "ईव्हीएम पुष्टीकरण",
    confirmVote: "वोटाची पुष्टी करा",
    cancel: "रद्द करा",
    voteRecorded: "मत यशस्वीरित्या नोंदवले गेले!",
    returnHome: "मुख्य स्क्रीनवर जा",
    downloadReceipt: "पावती डाउनलोड करा",
    referenceId: "संदर्भ आयडी",
    back: "मागे",
    pincode: "शहर किंवा पिनकोड",
    step1: "पात्रता",
    step2: "नोंदणी",
    step3: "पडताळणी",
    step4: "मतदान",
    helpTitle: "आम्ही कशी मदत करू शकतो?",
    helpSub: "तुमची समस्या निवडा",
    resolved: "निराकरण झाले",
    dashboard: "डॅशबोर्ड",
    issue1: "मतदार यादीत नाव नाही",
    issue2: "वोटर आयडीमध्ये चुकीचे तपशील",
    issue3: "नवीन मतदार नोंदणी",
    issue4: "पत्ता बदल",
    mobileView: "मोबाईल व्ह्यू",
    webView: "वेब व्ह्यू",
    healthMeter: "नागरिक आरोग्य स्कोर",
    quickActions: "त्वरित कृती",
    roadmap: "निवडणूक रोडमॅप",
    notif1: "१८ वर्षांवरील सर्व नागरिक पात्र आहेत.",
    notif2: "मतदान केंद्र शोधण्यासाठी 'बूथ शोधा' वापरा.",
    assistantTitle: "नागरिक सहायक",
    assistantGreet: "नमस्कार! मी तुम्हाला आज कशी मदत करू शकतो?",
    askBooth: "माझा बूथ कुठे आहे?",
    askDocs: "कोणती कागदपत्रे हवीत?",
    askHow: "मतदान कसे करायचे?",
    suggestion1: "पात्रता तपासा",
    suggestion2: "माझा बूथ शोधा",
    suggestion3: "मतदान मार्गदर्शिका",
    votingGuideTitle: "मतदान मार्गदर्शिका",
    votingGuideSub: "मतदान प्रक्रियेबद्दल तुम्हाला माहित असणे आवश्यक असलेले सर्वकाही",
    guideStep1: "तुमचे ओळखपत्र सोबत ठेवा",
    guideStep1Desc: "तुमचे मतदार ओळखपत्र किंवा आधार कार्ड आणा.",
    guideStep2: "तुमचा बूथ ओळखा",
    guideStep2Desc: "आमच्या बूथ फाइंडरचा वापर करा.",
    guideStep3: "पडताळणी आणि शाई",
    guideStep3Desc: "अधिकारी तुमची ओळख तपासेल आणि शाई लावेल.",
    guideStep4: "तुमचे मत द्या",
    guideStep4Desc: "तुमच्या उमेदवारासाठी ईव्हीएम बटण दाबा.",
    startSimulation: "मतदान सिम्युलेशन सुरू करा",
    greeting: "नमस्कार",
    greetingSub: "तुमचे वैयक्तिक नागरिक केंद्र. चला तुम्हाला मतदानासाठी तयार करूया.",
    readyMsg: "🎉 तुम्ही मतदानासाठी १००% तयार आहात!",
    pendingMsg: "१००% पर्यंत पोहोचण्यासाठी पुढील पायऱ्या पूर्ण करा",
    notifBadge: "AI",
    online: "ऑनलाइन",
    typing: "टाइप करत आहे...",
    suggestionsLabel: "सुझाव:",
    downloadSlip: "तुमची डिजिटल मतदार स्लिप आता डाउनलोड करा!",
    roadmapDesc1: "तुम्ही मतदानासाठी पात्र आहात का ते तपासा",
    roadmapDesc2: "पडताळणीसाठी तुमची प्रोफाइल नोंदवा",
    roadmapDesc3: "तुमच्या मतदान केंद्राचे ठिकाण शोधा",
    roadmapDesc4: "ईव्हीएम मशीन वापरण्याचा सराव करा"
  },
  bn: {
    appTitle: "সহায়ক",
    electionLive: "নির্বাচন ২০২৬ লাইভ",
    eligibility: "ভোটের যোগ্যতা",
    eligibilitySub: "আপনি পরিবর্তনের জন্য প্রস্তুত কিনা তা পরীক্ষা করুন",
    dob: "জন্ম তারিখ",
    checkEligibility: "যোগ্যতা পরীক্ষা করুন",
    eligible: "🎉 আপনি ভোট দেওয়ার যোগ্য!",
    notEligible: "আপনি এখনও যোগ্য নন",
    startRegistration: "নিবন্ধন শুরু করুন",
    setReminder: "রিমাইন্ডার সেট করুন",
    registration: "নিবন্ধন",
    registrationSub: "এগিয়ে যাওয়ার জন্য আপনার প্রোফাইল সম্পূর্ণ করুন",
    email: "ইমেল ঠিকানা",
    mobile: "মোবাইল নম্বর (ঐচ্ছিক)",
    continue: "চালিয়ে যান",
    verification: "যাচাইকরণ",
    verificationSub: "আপনার ইমেলে পাঠানো কোডটি লিখুন",
    verifyOtp: "ওটিপি যাচাই করুন",
    resendCode: "কোড আবার পাঠান",
    changeEmail: "ইমেল পরিবর্তন করুন",
    journey: "ভোটদান যাত্রা",
    journeySub: "আপনার অগ্রগতি ট্র্যাক করুন",
    continueJourney: "যাত্রা চালিয়ে যান",
    findBooth: "বুথ বিবরণ খুঁজুন",
    welcome: "সহায়কে স্বাগতম",
    onboardingSub: "আপনাকে শুরু করতে দ্রুত নির্দেশিকা",
    boothDetails: "বুথ বিবরণ",
    findMyBooth: "আমার বুথ খুঁজুন",
    selectCandidate: "প্রার্থী নির্বাচন করুন",
    evmConfirm: "ইভিএম নিশ্চিতকরণ",
    confirmVote: "ভোট নিশ্চিত করুন",
    cancel: "বাতিল করুন",
    voteRecorded: "ভোট সফলভাবে রেকর্ড করা হয়েছে!",
    returnHome: "মূল স্ক্রিনে যান",
    downloadReceipt: "রসিদ ডাউনলোড করুন",
    referenceId: "রেফারেন্স আইডি",
    back: "পিছনে",
    pincode: "শহর বা পিনকোড",
    step1: "যোগ্যতা",
    step2: "নিবন্ধন",
    step3: "যাচাইকরণ",
    step4: "ভোটদান",
    helpTitle: "আমরা কীভাবে সাহায্য করতে পারি?",
    helpSub: "আপনার সমস্যা নির্বাচন করুন",
    resolved: "সমাধান হয়েছে",
    dashboard: "ড্যাশবোর্ড",
    issue1: "ভোটার তালিকায় নাম নেই",
    issue2: "ভোটার আইডিতে ভুল বিবরণ",
    issue3: "নতুন ভোটার নিবন্ধন",
    issue4: "ঠিকানা পরিবর্তন",
    mobileView: "মোবাইল ভিউ",
    webView: "ওয়েব ভিউ",
    healthMeter: "নাগরিক স্বাস্থ্য স্কোর",
    quickActions: "দ্রুত পদক্ষেপ",
    roadmap: "নির্বাচন রোডম্যাপ",
    notif1: "১৮ বছরের উপরের সকল নাগরিক যোগ্য।",
    notif2: "আপনার ভোটকেন্দ্র খুঁজে পেতে 'বুথ খুঁজুন' ব্যবহার করুন।",
    assistantTitle: "নাগরিক সহায়ক",
    assistantGreet: "নমস্কার! আমি আপনাকে কীভাবে সাহায্য করতে পারি?",
    askBooth: "আমার বুথ কোথায়?",
    askDocs: "কি কি নথি প্রয়োজন?",
    askHow: "কীভাবে ভোট দেবেন?",
    suggestion1: "যোগ্যতা পরীক্ষা করুন",
    suggestion2: "আমার বুথ খুঁজুন",
    suggestion3: "ভোটদান নির্দেশিকা",
    votingGuideTitle: "ভোটদান নির্দেশিকা",
    votingGuideSub: "ভোটদান প্রক্রিয়া সম্পর্কে আপনার যা জানা দরকার",
    guideStep1: "আপনার আইডি সাথে রাখুন",
    guideStep1Desc: "আপনার ভোটার আইডি বা আধার কার্ড আনুন।",
    guideStep2: "আপনার বুথ সনাক্ত করুন",
    guideStep2Desc: "আমাদের বুথ ফাইন্ডার ব্যবহার করুন।",
    guideStep3: "যাচাই এবং কালি",
    guideStep3Desc: "অফিসার আপনার আইডি যাচাই করবেন এবং কালি দেবেন।",
    guideStep4: "আপনার ভোট দিন",
    guideStep4Desc: "আপনার প্রার্থীর জন্য ইভিএম বোতাম টিপুন।",
    startSimulation: "ভোটদান সিমুলেশন শুরু করুন",
    greeting: "নমস্কার",
    greetingSub: "আপনার ব্যক্তিগত নাগরিক কেন্দ্র। আসুন আপনাকে ভোট দেওয়ার জন্য প্রস্তুত করি।",
    readyMsg: "🎉 আপনি নির্বাচনের দিনের জন্য ১০০% প্রস্তুত!",
    pendingMsg: "১০০% পৌঁছানোর জন্য আরও পদক্ষেপ সম্পূর্ণ করুন",
    notifBadge: "AI",
    online: "অনলাইন",
    typing: "টাইপিং...",
    suggestionsLabel: "পরামর্শ:",
    downloadSlip: "আপনার ডিজিটাল ভোটার স্লিপ এখন ডাউনলোড করুন!",
    roadmapDesc1: "আপনি ভোট দেওয়ার যোগ্য কিনা পরীক্ষা করুন",
    roadmapDesc2: "যাচাইয়ের জন্য আপনার প্রোফাইল নিবন্ধন করুন",
    roadmapDesc3: "আপনার ভোটকেন্দ্রের অবস্থান খুঁজুন",
    roadmapDesc4: "ইভিএম মেশিন ব্যবহার করার অভ্যাস করুন"
  },
  te: {
    appTitle: "సహాయక్",
    electionLive: "ఎన్నికలు 2026 లైవ్",
    eligibility: "ఓటింగ్ అర్హత",
    eligibilitySub: "మీరు మార్పు కోసం సిద్ధంగా ఉన్నారో లేదో తనిఖీ చేయండి",
    dob: "పుట్టిన తేదీ",
    checkEligibility: "అర్హత తనిఖీ చేయండి",
    eligible: "🎉 మీరు ఓటు వేయడానికి అర్హులు!",
    notEligible: "మీరు ఇంకా అర్హులు కారు",
    startRegistration: "రిజిస్ట్రేషన్ ప్రారంభించండి",
    setReminder: "రిమైండర్ సెట్ చేయండి",
    registration: "రిజిస్ట్రేషన్",
    registrationSub: "కొనసాగడానికి మీ ప్రొఫైల్ పూర్తి చేయండి",
    email: "ఈమెయిల్ చిరునామా",
    mobile: "మొబైల్ నంబర్ (ఐచ్ఛికం)",
    continue: "కొనసాగించు",
    verification: "ధృవీకరణ",
    verificationSub: "మీ ఈమెయిల్ కు పంపిన కోడ్ ను నమోదు చేయండి",
    verifyOtp: "OTP ని ధృవీకరించండి",
    resendCode: "కోడ్ మళ్లీ పంపండి",
    changeEmail: "ఈమెయిల్ మార్చండి",
    journey: "ఓటింగ్ ప్రయాణం",
    journeySub: "మీ పురోగతిని ట్రాక్ చేయండి",
    continueJourney: "ప్రయాణాన్ని కొనసాగించండి",
    findBooth: "బూత్ వివరాలను కనుగొనండి",
    welcome: "సహాయక్ కు స్వాగతం",
    onboardingSub: "ప్రారంభించడానికి శీఘ్ర గైడ్",
    boothDetails: "బూత్ వివరాలు",
    findMyBooth: "నా బూత్ ను కనుగొనండి",
    selectCandidate: "అభ్యర్థిని ఎంచుకోండి",
    evmConfirm: "EVM నిర్ధారణ",
    confirmVote: "ఓటును ధృవీకరించండి",
    cancel: "రద్దు చేయి",
    voteRecorded: "ఓటు విజయవంతంగా నమోదైంది!",
    returnHome: "ప్రధాన స్క్రీన్ కు వెళ్లండి",
    downloadReceipt: "రసీదును డౌన్ లోడ్ చేయండి",
    referenceId: "రిఫరెన్స్ ID",
    back: "వెనుకకు",
    pincode: "నగరం లేదా పిన్ కోడ్",
    step1: "అర్హత",
    step2: "రిజిస్ట్రేషన్",
    step3: "ధృవీకరణ",
    step4: "ఓటింగ్",
    helpTitle: "మేము ఎలా సహాయం చేయగలము?",
    helpSub: "మీ సమస్యను ఎంచుకోండి",
    resolved: "పరిష్కరించబడింది",
    dashboard: "డ్యాష్ బోర్డ్",
    issue1: "ఓటరు జాబితాలో పేరు లేదు",
    issue2: "ఓటరు ID లో తప్పు వివరాలు",
    issue3: "కొత్త ఓటరు నమోదు",
    issue4: "చిరునామా మార్పు",
    mobileView: "మొబైల్ వీక్షణ",
    webView: "వెబ్ వీక్షణ",
    healthMeter: "పౌర ఆరోగ్య స్కోరు",
    quickActions: "శీఘ్ర చర్యలు",
    roadmap: "ఎన్నికల రోడ్ మ్యాప్",
    notif1: "18 ఏళ్లు పైబడిన పౌరులందరూ అర్హులు.",
    notif2: "మీ పోలింగ్ స్టేషన్ ను కనుగొనడానికి బూత్ సెర్చ్ ఉపయోగించండి.",
    assistantTitle: "పౌర సహాయకుడు",
    assistantGreet: "నమస్కారం! నేను మీకు ఈ రోజు ఎలా సహాయం చేయగలను?",
    askBooth: "నా బూత్ ఎక్కడ ఉంది?",
    askDocs: "ఏ పత్రాలు అవసరం?",
    askHow: "ఓటు వేయడం ఎలా?",
    suggestion1: "అర్హత తనిఖీ చేయండి",
    suggestion2: "నా బూత్ ను కనుగొనండి",
    suggestion3: "ఓటింగ్ గైడ్",
    votingGuideTitle: "ఓటింగ్ గైడ్",
    votingGuideSub: "ఓటింగ్ ప్రక్రియ గురించి మీరు తెలుసుకోవలసిన ప్రతిదీ",
    guideStep1: "మీ ఐడిని వెంట ఉంచుకోండి",
    guideStep1Desc: "మీ ఓటరు ఐడి లేదా ఆధార్ కార్డు తీసుకురండి.",
    guideStep2: "మీ బూత్ ను గుర్తించండి",
    guideStep2Desc: "మా బూత్ ఫైండర్ ను ఉపయోగించండి.",
    guideStep3: "ధృవీకరణ మరియు సిరా",
    guideStep3Desc: "అధికారి మీ ఐడిని ధృవీకరించి సిరా వేస్తారు.",
    guideStep4: "మీ ఓటు వేయండి",
    guideStep4Desc: "మీ అభ్యర్థి కోసం EVM బటన్ నొక్కండి.",
    startSimulation: "ఓటింగ్ సిమ్యులేషన్ ప్రారంభించండి",
    greeting: "నమస్కారం",
    greetingSub: "మీ వ్యక్తిగత పౌర కేంద్రం. ఓటు వేయడానికి మిమ్మల్ని సిద్ధం చేద్దాం.",
    readyMsg: "🎉 మీరు ఎన్నికల రోజు కోసం 100% సిద్ధంగా ఉన్నారు!",
    pendingMsg: "100% చేరుకోవడానికి మరిన్ని దశలను పూర్తి చేయండి",
    notifBadge: "AI",
    online: "ఆన్ లైన్",
    typing: "టైపింగ్...",
    suggestionsLabel: "సూచనలు:",
    downloadSlip: "మీ డిజిటల్ ఓటర్ స్లిప్ ను ఇప్పుడే డౌన్ లోడ్ చేసుకోండి!",
    roadmapDesc1: "మీరు ఓటు వేయడానికి అర్హులో కాదో తనిఖీ చేయండి",
    roadmapDesc2: "ధృవీకరణ కోసం మీ ప్రొఫైల్ ను నమోదు చేయండి",
    roadmapDesc3: "మీ పోలింగ్ బూత్ స్థానాన్ని కనుగొనండి",
    roadmapDesc4: "EVM మెషీన్ ను ఉపయోగించడం ప్రాక్టీస్ చేయండి"
  },
  ta: {
    appTitle: "சஹாயக்",
    electionLive: "தேர்தல் 2026 லைவ்",
    eligibility: "வாக்களிக்க தகுதி",
    eligibilitySub: "மாற்றத்திற்கு நீங்கள் தயாரா என்று பாருங்கள்",
    dob: "பிறந்த தேதி",
    checkEligibility: "தகுதியை சரிபார்க்கவும்",
    eligible: "🎉 நீங்கள் வாக்களிக்க தகுதியுடையவர்!",
    notEligible: "நீங்கள் இன்னும் தகுதி பெறவில்லை",
    startRegistration: "பதிவைத் தொடங்கவும்",
    setReminder: "நினைவூட்டலை அமைக்கவும்",
    registration: "பதிவு",
    registrationSub: "தொடர உங்கள் சுயவிவரத்தை பூர்த்தி செய்யவும்",
    email: "மின்னஞ்சல் முகவரி",
    mobile: "மொபைல் எண் (விருப்பமானது)",
    continue: "தொடரவும்",
    verification: "சரிபார்ப்பு",
    verificationSub: "உங்கள் மின்னஞ்சலுக்கு அனுப்பப்பட்ட குறியீட்டை உள்ளிடவும்",
    verifyOtp: "OTP ஐ சரிபார்க்கவும்",
    resendCode: "குறியீட்டை மீண்டும் அனுப்பவும்",
    changeEmail: "மின்னஞ்சலை மாற்றவும்",
    journey: "வாக்களிக்கும் பயணம்",
    journeySub: "உங்கள் முன்னேற்றத்தைக் கண்காணிக்கவும்",
    continueJourney: "பயணத்தைத் தொடரவும்",
    findBooth: "பூத் விவரங்களைக் கண்டறியவும்",
    welcome: "சஹாயக் உங்களை வரவேற்கிறது",
    onboardingSub: "தொடங்குவதற்கான விரைவான வழிகாட்டி",
    boothDetails: "பூத் விவரங்கள்",
    findMyBooth: "என் பூத்தைக் கண்டுபிடி",
    selectCandidate: "வேட்பாளரைத் தேர்ந்தெடுக்கவும்",
    evmConfirm: "EVM உறுதிப்படுத்தல்",
    confirmVote: "வாக்கை உறுதிப்படுத்தவும்",
    cancel: "ரத்து செய்",
    voteRecorded: "வாக்கு வெற்றிகரமாக பதிவு செய்யப்பட்டது!",
    returnHome: "முதன்மைத் திரைக்குச் செல்லவும்",
    downloadReceipt: "ரசீதை பதிவிறக்கவும்",
    referenceId: "குறிப்பு ஐடி",
    back: "பின்னால்",
    pincode: "நகரம் அல்லது பின்கோடு",
    step1: "தகுதி",
    step2: "பதிவு",
    step3: "சரிபார்ப்பு",
    step4: "வாக்களித்தல்",
    helpTitle: "நாங்கள் எப்படி உதவ முடியும்?",
    helpSub: "உங்கள் பிரச்சனையைத் தேர்ந்தெடுக்கவும்",
    resolved: "தீர்க்கப்பட்டது",
    dashboard: "டாஷ்போர்டு",
    issue1: "வாக்காளர் பட்டியலில் பெயர் இல்லை",
    issue2: "வாக்காளர் அடையாள அட்டையில் தவறான விவரங்கள்",
    issue3: "புதிய வாக்காளர் பதிவு",
    issue4: "முகவரி மாற்றம்",
    mobileView: "மொபைல் காட்சி",
    webView: "வலைக் காட்சி",
    healthMeter: "குடிமக்கள் சுகாதார மதிப்பெண்",
    quickActions: "விரைவான செயல்கள்",
    roadmap: "தேர்தல் வரைபடம்",
    notif1: "18 வயதுக்கு மேற்பட்ட அனைத்து குடிமக்களும் தகுதியுடையவர்கள்.",
    notif2: "உங்கள் வாக்குச்சாவடியைக் கண்டறிய பூத் தேடலைப் பயன்படுத்தவும்.",
    assistantTitle: "குடிமக்கள் உதவியாளர்",
    assistantGreet: "வணக்கம்! நான் உங்களுக்கு இன்று எப்படி உதவ முடியும்?",
    askBooth: "என் பூத் எங்கே இருக்கிறது?",
    askDocs: "என்ன ஆவணங்கள் தேவை?",
    askHow: "வாக்களிப்பது எப்படி?",
    suggestion1: "தகுதியை சரிபார்க்கவும்",
    suggestion2: "என் பூத்தைக் கண்டுபிடி",
    suggestion3: "வாக்களிக்கும் வழிகாட்டி",
    votingGuideTitle: "வாக்களிக்கும் வழிகாட்டி",
    votingGuideSub: "வாக்களிக்கும் செயல்முறை பற்றி நீங்கள் தெரிந்து கொள்ள வேண்டிய அனைத்தும்",
    guideStep1: "உங்கள் அடையாள அட்டையை எடுத்துச் செல்லுங்கள்",
    guideStep1Desc: "வாக்காளர் அடையாள அட்டை அல்லது ஆதார் அட்டையைக் கொண்டு வாருங்கள்.",
    guideStep2: "உங்கள் பூத்தை அடையாளம் காணவும்",
    guideStep2Desc: "எங்கள் பூத் கண்டுபிடிப்பாளரைப் பயன்படுத்தவும்.",
    guideStep3: "சரிபார்ப்பு மற்றும் மை",
    guideStep3Desc: "அதிகாரி உங்கள் அடையாளத்தை சரிபார்த்து மை வைப்பார்.",
    guideStep4: "உங்கள் வாக்கை செலுத்துங்கள்",
    guideStep4Desc: "உங்கள் வேட்பாளருக்கான EVM பொத்தானை அழுத்தவும்.",
    startSimulation: "வாக்களிப்பு உருவகப்படுத்துதலைத் தொடங்கவும்",
    greeting: "வணக்கம்",
    greetingSub: "உங்கள் தனிப்பட்ட குடிமை மையம். உங்களை வாக்களிக்க தயார்படுத்துவோம்.",
    readyMsg: "🎉 தேர்தல் நாளுக்காக நீங்கள் 100% தயாராக உள்ளீர்கள்!",
    pendingMsg: "100% அடைய கூடுதல் படிகளை முடிக்கவும்",
    notifBadge: "AI",
    online: "ஆன்லைன்",
    typing: "தட்டச்சு செய்கிறது...",
    suggestionsLabel: "பரிந்துரைகள்:",
    downloadSlip: "உங்கள் டிஜிட்டல் வாக்காளர் சீட்டை இப்போது பதிவிறக்கவும்!",
    roadmapDesc1: "வாக்களிக்க நீங்கள் தகுதியுள்ளவரா என்று பாருங்கள்",
    roadmapDesc2: "சரிபார்ப்பிற்காக உங்கள் சுயவிவரத்தைப் பதிவு செய்யுங்கள்",
    roadmapDesc3: "உங்கள் வாக்குச்சாவடி இருப்பிடத்தைக் கண்டறியவும்",
    roadmapDesc4: "EVM இயந்திரத்தைப் பயன்படுத்த பயிற்சி செய்யுங்கள்"
  },
  kn: {
    appTitle: "ಸಹಾಯಕ್",
    electionLive: "ಚುನಾವಣೆ 2026 ಲೈವ್",
    eligibility: "ಮತದಾನದ ಅರ್ಹತೆ",
    eligibilitySub: "ನೀವು ಬದಲಾವಣೆಗಾಗಿ ಸಿದ್ಧರಿದ್ದೀರಾ ಎಂದು ಪರಿಶೀಲಿಸಿ",
    dob: "ಹುಟ್ಟಿದ ದಿನಾಂಕ",
    checkEligibility: "ಅರ್ಹತೆಯನ್ನು ಪರಿಶೀಲಿಸಿ",
    eligible: "🎉 ನೀವು ಮತದಾನ ಮಾಡಲು ಅರ್ಹರಿದ್ದೀರಿ!",
    notEligible: "ನೀವು ಇನ್ನೂ ಅರ್ಹರಲ್ಲ",
    startRegistration: "ನೋಂದಣಿ ಪ್ರಾರಂಭಿಸಿ",
    setReminder: "ಜ್ಞಾಪನೆ ಹೊಂದಿಸಿ",
    registration: "ನೋಂದಣಿ",
    registrationSub: "ಮುಂದುವರಿಯಲು ನಿಮ್ಮ ಪ್ರೊಫೈಲ್ ಪೂರ್ಣಗೊಳಿಸಿ",
    email: "ಇಮೇಲ್ ವಿಳಾಸ",
    mobile: "ಮೊಬೈಲ್ ಸಂಖ್ಯೆ (ಐಚ್ಛಿಕ)",
    continue: "ಮುಂದುವರಿಸಿ",
    verification: "ಪರಿಶೀಲನೆ",
    verificationSub: "ನಿಮ್ಮ ಇಮೇಲ್ ಗೆ ಕಳುಹಿಸಲಾದ ಕೋಡ್ ಅನ್ನು ನಮೂದಿಸಿ",
    verifyOtp: "OTP ಪರಿಶೀಲಿಸಿ",
    resendCode: "ಕೋಡ್ ಮತ್ತೆ ಕಳುಹಿಸಿ",
    changeEmail: "ಇಮೇಲ್ ಬದಲಾಯಿಸಿ",
    journey: "ಮತದಾನದ ಪ್ರಯಾಣ",
    journeySub: "ನಿಮ್ಮ ಪ್ರಗತಿಯನ್ನು ಟ್ರ್ಯಾಕ್ ಮಾಡಿ",
    continueJourney: "ಪ್ರಯಾಣ ಮುಂದುವರಿಸಿ",
    findBooth: "ಬೂತ್ ವಿವರಗಳನ್ನು ಹುಡುಕಿ",
    welcome: "ಸಹಾಯಕ್ ಗೆ ಸ್ವಾಗತ",
    onboardingSub: "ಪ್ರಾರಂಭಿಸಲು ತ್ವರಿತ ಮಾರ್ಗದರ್ಶಿ",
    boothDetails: "ಬೂತ್ ವಿವರಗಳು",
    findMyBooth: "ನನ್ನ ಬೂತ್ ಹುಡುಕಿ",
    selectCandidate: "ಅಭ್ಯರ್ಥಿಯನ್ನು ಆಯ್ಕೆಮಾಡಿ",
    evmConfirm: "EVM ದೃಢೀಕರಣ",
    confirmVote: "ಮತವನ್ನು ದೃಢೀಕರಿಸಿ",
    cancel: "ರದ್ದುಮಾಡಿ",
    voteRecorded: "ಮತ ಯಶಸ್ವಿಯಾಗಿ ದಾಖಲಾಗಿದೆ!",
    returnHome: "ಮುಖ್ಯ ಪರದೆಗೆ ಹೋಗಿ",
    downloadReceipt: "ರಶೀದಿ ಡೌನ್‌ಲೋಡ್ ಮಾಡಿ",
    referenceId: "ಉಲ್ಲೇಖ ID",
    back: "ಹಿಂದೆ",
    pincode: "ನಗರ ಅಥವಾ ಪಿನ್‌ಕೋಡ್",
    step1: "ಅರ್ಹತೆ",
    step2: "ನೋಂದಣಿ",
    step3: "ಪರಿಶೀಲನೆ",
    step4: "ಮತದಾನ",
    helpTitle: "ನಾವು ಹೇಗೆ ಸಹಾಯ ಮಾಡಬಹುದು?",
    helpSub: "ನಿಮ್ಮ ಸಮಸ್ಯೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ",
    resolved: "ಪರಿಹರಿಸಲಾಗಿದೆ",
    dashboard: "ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",
    issue1: "ಮತದಾರರ ಪಟ್ಟಿಯಲ್ಲಿ ಹೆಸರಿಲ್ಲ",
    issue2: "ಮತದಾರರ ಗುರುತಿನ ಚೀಟಿಯಲ್ಲಿ ತಪ್ಪು ವಿವರಗಳು",
    issue3: "ಹೊಸ ಮತದಾರರ ನೋಂದಣಿ",
    issue4: "ವಿಳಾಸ ಬದಲಾವಣೆ",
    mobileView: "ಮೊಬೈಲ್ ನೋಟ",
    webView: "ವೆಬ್ ನೋಟ",
    healthMeter: "ನಾಗರಿಕ ಆರೋಗ್ಯ ಸ್ಕೋರ್",
    quickActions: "ತ್ವರಿತ ಕ್ರಮಗಳು",
    roadmap: "ಚುನಾವಣಾ ಮಾರ್ಗಸೂಚಿ",
    notif1: "18 ವರ್ಷಕ್ಕಿಂತ ಮೇಲ್ಪಟ್ಟ ಎಲ್ಲಾ ನಾಗರಿಕರು ಅರ್ಹರು.",
    notif2: "ನಿಮ್ಮ ಮತಗಟ್ಟೆಯನ್ನು ಪತ್ತೆಹಚ್ಚಲು ಬೂತ್ ಸರ್ಚ್ ಬಳಸಿ.",
    assistantTitle: "ನಾಗರಿಕ ಸಹಾಯಕ",
    assistantGreet: "ನಮಸ್ಕಾರ! ನಾನು ನಿಮಗೆ ಇಂದು ಹೇಗೆ ಸಹಾಯ ಮಾಡಬಹುದು?",
    askBooth: "ನನ್ನ ಬೂತ್ ಎಲ್ಲಿದೆ?",
    askDocs: "ಯಾವ ದಾಖಲೆಗಳು ಬೇಕು?",
    askHow: "ಮತದಾನ ಮಾಡುವುದು ಹೇಗೆ?",
    suggestion1: "ಅರ್ಹತೆಯನ್ನು ಪರಿಶೀಲಿಸಿ",
    suggestion2: "ನನ್ನ ಬೂತ್ ಹುಡುಕಿ",
    suggestion3: "ಮತದಾನ ಮಾರ್ಗದರ್ಶಿ",
    votingGuideTitle: "ಮತದಾನ ಮಾರ್ಗದರ್ಶಿ",
    votingGuideSub: "ಮತದಾನ ಪ್ರಕ್ರಿಯೆಯ ಬಗ್ಗೆ ನೀವು ತಿಳಿದುಕೊಳ್ಳಬೇಕಾದ ಎಲ್ಲವೂ",
    guideStep1: "ನಿಮ್ಮ ಐಡಿ ಜೊತೆಯಲ್ಲಿಡಿ",
    guideStep1Desc: "ನಿಮ್ಮ ಮತದಾರರ ಗುರುತಿನ ಚೀಟಿ ಅಥವಾ ಆಧಾರ್ ಕಾರ್ಡ್ ತಂದಿರಿ.",
    guideStep2: "ನಿಮ್ಮ ಬೂತ್ ಗುರುತಿಸಿ",
    guideStep2Desc: "ನಮ್ಮ ಬೂತ್ ಫೈಂಡರ್ ಬಳಸಿ.",
    guideStep3: "ಪರಿಶೀಲನೆ ಮತ್ತು ಶಾಯಿ",
    guideStep3Desc: "ಅಧಿಕಾರಿ ನಿಮ್ಮ ಐಡಿ ಪರಿಶೀಲಿಸುತ್ತಾರೆ ಮತ್ತು ಶಾಯಿ ಹಾಕುತ್ತಾರೆ.",
    guideStep4: "ನಿಮ್ಮ ಮತ ಚಲಾಯಿಸಿ",
    guideStep4Desc: "ನಿಮ್ಮ ಅಭ್ಯರ್ಥಿಗಾಗಿ EVM ಬಟನ್ ಒತ್ತಿರಿ.",
    startSimulation: "ಮತದಾನ ಸಿಮ್ಯುಲೇಶನ್ ಪ್ರಾರಂಭಿಸಿ",
    greeting: "ನಮಸ್ಕಾರ",
    greetingSub: "ನಿಮ್ಮ ವೈಯಕ್ತಿಕ ನಾಗರಿಕ ಕೇಂದ್ರ. ಮತದಾನಕ್ಕೆ ನಿಮ್ಮನ್ನು ಸಿದ್ಧಪಡಿಸೋಣ.",
    readyMsg: "🎉 ನೀವು ಚುನಾವಣಾ ದಿನಕ್ಕೆ 100% ಸಿದ್ಧರಿದ್ದೀರಿ!",
    pendingMsg: "100% ತಲುಪಲು ಹೆಚ್ಚಿನ ಹಂತಗಳನ್ನು ಪೂರ್ಣಗೊಳಿಸಿ",
    notifBadge: "AI",
    online: "ಆನ್‌ಲೈನ್",
    typing: "ಟೈಪ್ ಮಾಡುತ್ತಿದೆ...",
    suggestionsLabel: "ಸಲಹೆಗಳು:",
    downloadSlip: "ನಿಮ್ಮ ಡಿಜಿಟಲ್ ಮತದಾರರ ಚೀಟಿಯನ್ನು ಈಗಲೇ ಡೌನ್‌ಲೋಡ್ ಮಾಡಿ!",
    roadmapDesc1: "ನೀವು ಮತದಾನಕ್ಕೆ ಅರ್ಹರಿದ್ದೀರಾ ಎಂದು ಪರಿಶೀಲಿಸಿ",
    roadmapDesc2: "ಪರಿಶೀಲನೆಗಾಗಿ ನಿಮ್ಮ ಪ್ರೊಫೈಲ್ ನೋಂದಾಯಿಸಿ",
    roadmapDesc3: "ನಿಮ್ಮ ಮತಗಟ್ಟೆಯ ಸ್ಥಳವನ್ನು ಹುಡುಕಿ",
    roadmapDesc4: "EVM ಯಂತ್ರವನ್ನು ಬಳಸುವುದನ್ನು ಅಭ್ಯಾಸ ಮಾಡಿ"
  },
  gu: {
    appTitle: "સહાયક",
    electionLive: "ચૂંટણી 2026 લાઈવ",
    eligibility: "મતદાનની પાત્રતા",
    eligibilitySub: "તપાસો કે તમે ફેરફાર માટે તૈયાર છો કે નહીં",
    dob: "જન્મ તારીખ",
    checkEligibility: "પાત્રતા તપાસો",
    eligible: "🎉 તમે મતદાન માટે પાત્ર છો!",
    notEligible: "તમે હજુ પાત્ર નથી",
    startRegistration: "નોંધણી શરૂ કરો",
    setReminder: "રિમાઇન્ડર સેટ કરો",
    registration: "નોંધણી",
    registrationSub: "આગળ વધવા માટે તમારી પ્રોફાઇલ પૂર્ણ કરો",
    email: "ઇમેઇલ સરનામું",
    mobile: "મોબાઇલ નંબર (વૈકલ્પિક)",
    continue: "ચાલુ રાખો",
    verification: "ચકાસણી",
    verificationSub: "તમારા ઇમેઇલ પર મોકલેલો કોડ દાખલ કરો",
    verifyOtp: "OTP ચકાસો",
    resendCode: "કોડ ફરીથી મોકલો",
    changeEmail: "ઇમેઇલ બદલો",
    journey: "મતદાન પ્રવાસ",
    journeySub: "તમારી પ્રગતિ ટ્રૅક કરો",
    continueJourney: "ಪ್ರವಾಸ ಚાલુ રાખો",
    findBooth: "બૂથ વિગતો શોધો",
    welcome: "સહાયકમાં સ્વાગત છે",
    onboardingSub: "તમને શરૂ કરવા માટે ઝડપી માર્ગદર્શિકા",
    boothDetails: "બૂથ વિગતો",
    findMyBooth: "મારું બૂથ શોધો",
    selectCandidate: "ઉમેદવાર પસંદ કરો",
    evmConfirm: "EVM પુષ્ટિ",
    confirmVote: "મતની પુષ્ટિ કરો",
    cancel: "રદ કરો",
    voteRecorded: "મત સફળતાપૂર્વક નોંધાયો!",
    returnHome: "મુખ્ય સ્ક્રીન પર જાઓ",
    downloadReceipt: "રસીદ ડાઉનલોડ કરો",
    referenceId: "સંદર્ભ ID",
    back: "પાછા",
    pincode: "શહેર અથવા પિનકોડ",
    step1: "પાત્રતા",
    step2: "નોંધણી",
    step3: "ચકાસણી",
    step4: "મતદાન",
    helpTitle: "અમે કેવી રીતે મદદ કરી શકીએ?",
    helpSub: "તમારી સમસ્યા પસંદ કરો",
    resolved: "ઉકેલાઈ ગયું",
    dashboard: "ડેશબોર્ડ",
    issue1: "મતદાર યાદીમાં નામ નથી",
    issue2: "મતદાર ID માં ખોટી વિગતો",
    issue3: "નવી મતદાર નોંધણી",
    issue4: "સરનામું ફેરફાર",
    mobileView: "મોબાઇલ વ્યૂ",
    webView: "વેબ વ્યૂ",
    healthMeter: "નાગરિક આરોગ્ય સ્કોર",
    quickActions: "ઝડપી કાર્યો",
    roadmap: "ચૂંટણી રોડમેપ",
    notif1: "18 વર્ષથી ઉપરના તમામ નાગરિકો પાત્ર છે.",
    notif2: "તમારું મતદાન મથક શોધવા માટે બૂથ સર્ચનો ઉપયોગ કરો.",
    assistantTitle: "નાગરિક સહાયક",
    assistantGreet: "નમસ્તે! હું તમને આજે કેવી રીતે મદદ કરી શકું?",
    askBooth: "મારું બૂથ ક્યાં છે?",
    askDocs: "કયા દસ્તાવેજોની જરૂર છે?",
    askHow: "મતદાન કેવી રીતે કરવું?",
    suggestion1: "પાત્રતા તપાસો",
    suggestion2: "મારું બૂથ શોધો",
    suggestion3: "મતદાન માર્ગદર્શિકા",
    votingGuideTitle: "મતદાન માર્ગદર્શિકા",
    votingGuideSub: "મતદાન પ્રક્રિયા વિશે તમારે જાણવાની જરૂર હોય તે બધું",
    guideStep1: "તમારું આઈડી સાથે રાખો",
    guideStep1Desc: "તમારું મતદાર આઈડી અથવા આધાર કાર્ડ લાવો.",
    guideStep2: "તમારો બૂથ ઓળખો",
    guideStep2Desc: "અમારા બૂથ ફાઇન્ડરનો ઉપયોગ કરો.",
    guideStep3: "ચકાસણી અને શાહી",
    guideStep3Desc: "અધિકારી તમારી આઈડી ચકાસશે અને શાહી લગાવશે.",
    guideStep4: "તમારો મત આપો",
    guideStep4Desc: "તમારા ઉમેદવાર માટે EVM બટન દબાવો.",
    startSimulation: "મતદાન સિમ્યુલેશન શરૂ કરો",
    greeting: "નમસ્તે",
    greetingSub: "તમારું વ્યક્તિગત નાગરિક કેન્દ્ર. ચાલો તમને મતદાન માટે તૈયાર કરીએ.",
    readyMsg: "🎉 તમે ચૂંટણીના દિવસ માટે 100% તૈયાર છો!",
    pendingMsg: "100% સુધી પહોંચવા માટે વધુ પગલાં પૂર્ણ કરો",
    notifBadge: "AI",
    online: "ઓનલાઇન",
    typing: "ટાઇપ કરી રહ્યું છે...",
    suggestionsLabel: "સૂચનો:",
    downloadSlip: "તમારી ડિજિટલ મતદાર કાપલી અત્યારે જ ડાઉનલોડ કરો!",
    roadmapDesc1: "તપાસો કે તમે મતદાન માટે પાત્ર છો કે નહીં",
    roadmapDesc2: "ચકાસણી માટે તમારી પ્રોફાઇલ નોંધણી કરો",
    roadmapDesc3: "તમારા મતદાન મથકનું સ્થાન શોધો",
    roadmapDesc4: "EVM મશીનનો ઉપયોગ કરવાનો અભ્યાસ કરો"
  },
  ml: {
    appTitle: "സഹായക്",
    electionLive: "തിരഞ്ഞെടുപ്പ് 2026 ലൈവ്",
    eligibility: "വോട്ടിംഗ് യോഗ്യത",
    eligibilitySub: "നിങ്ങൾ മാറ്റത്തിന് തയ്യാറാണോ എന്ന് പരിശോധിക്കുക",
    dob: "ജനനതീയതി",
    checkEligibility: "യോഗ്യത പരിശോധിക്കുക",
    eligible: "🎉 നിങ്ങൾ വോട്ട് ചെയ്യാൻ യോഗ്യനാണ്!",
    notEligible: "നിങ്ങൾ ഇതുവരെ യോഗ്യനല്ല",
    startRegistration: "രജിസ്ട്രേഷൻ ആരംഭിക്കുക",
    setReminder: "റിമൈൻഡർ സജ്ജമാക്കുക",
    registration: "രജിസ്ട്രേഷൻ",
    registrationSub: "തുടരുന്നതിന് നിങ്ങളുടെ പ്രൊഫൈൽ പൂർത്തിയാക്കുക",
    email: "ഇമെയിൽ വിലാസം",
    mobile: "മൊബൈൽ നമ്പർ (ഓപ്ഷണൽ)",
    continue: "തുടരുക",
    verification: "പരിശോധന",
    verificationSub: "നിങ്ങളുടെ ഇമെയിലിലേക്ക് അയച്ച കോഡ് നൽകുക",
    verifyOtp: "OTP പരിശോധിക്കുക",
    resendCode: "കോഡ് വീണ്ടും അയയ്ക്കുക",
    changeEmail: "ഇമെയിൽ മാറ്റുക",
    journey: "വോട്ടിംഗ് യാത്ര",
    journeySub: "നിങ്ങളുടെ പുരോഗതി ട്രാക്ക് ചെയ്യുക",
    continueJourney: "യാത്ര തുടരുക",
    findBooth: "ബൂത്ത് വിവരങ്ങൾ കണ്ടെത്തുക",
    welcome: "സഹായക്കിലേക്ക് സ്വാഗതം",
    onboardingSub: "ആരംഭിക്കുന്നതിനുള്ള ദ്രുത ഗൈഡ്",
    boothDetails: "ബൂത്ത് വിവരങ്ങൾ",
    findMyBooth: "എന്റെ ബൂത്ത് കണ്ടെത്തുക",
    selectCandidate: "സ്ഥാനാർത്ഥിയെ തിരഞ്ഞെടുക്കുക",
    evmConfirm: "EVM സ്ഥിരീകരണം",
    confirmVote: "വോട്ട് സ്ഥിരീകരിക്കുക",
    cancel: "റദ്ദാക്കുക",
    voteRecorded: "വോട്ട് വിജയകരമായി രേഖപ്പെടുത്തി!",
    returnHome: "പ്രധാന സ്ക്രീനിലേക്ക് പോകുക",
    downloadReceipt: "രസീത് ഡൗൺലോഡ് ചെയ്യുക",
    referenceId: "റഫറൻസ് ഐഡി",
    back: "പിന്നിലേക്ക്",
    pincode: "നഗരം അല്ലെങ്കിൽ പിൻകോഡ്",
    step1: "യോഗ്യത",
    step2: "രജിസ്ട്രേഷൻ",
    step3: "പരിശോധന",
    step4: "വോട്ടിംഗ്",
    helpTitle: "ഞങ്ങൾക്ക് എങ്ങനെ സഹായിക്കാം?",
    helpSub: "നിങ്ങളുടെ പ്രശ്നം തിരഞ്ഞെടുക്കുക",
    resolved: "പരിഹരിച്ചു",
    dashboard: "ഡാഷ്‌ബോർഡ്",
    issue1: "വോട്ടർ പട്ടികയിൽ പേരില്ല",
    issue2: "വോട്ടർ আইഡിയിൽ തെറ്റായ വിവരങ്ങൾ",
    issue3: "പുതിയ വോട്ടർ രജിസ്ട്രേഷൻ",
    issue4: "വിലാസം മാറ്റം",
    mobileView: "ಮೊಬೈಲ್ ನೋಟ",
    webView: "വെബ് കാഴ്ച",
    healthMeter: "സിവിക് ഹെൽത്ത് സ്കോർ",
    quickActions: "ദ്രുത നടപടികൾ",
    roadmap: "തിരഞ്ഞെടുപ്പ് റോഡ്മാപ്പ്",
    notif1: "18 വയസ്സിന് മുകളിലുള്ള എല്ലാ പൗരന്മാരും യോഗ്യരാണ്.",
    notif2: "നിങ്ങളുടെ പോളിംഗ് സ്റ്റേഷൻ കണ്ടെത്താൻ ബൂത്ത് സെർച്ച് ഉപയോഗിക്കുക.",
    assistantTitle: "സിവിക് അസിസ്റ്റന്റ്",
    assistantGreet: "നമസ്കാരം! എനിക്ക് ഇന്ന് നിങ്ങളെ എങ്ങനെ സഹായിക്കാനാകും?",
    askBooth: "എന്റെ ബൂത്ത് എവിടെയാണ്?",
    askDocs: "ഏതൊക്കെ രേഖകൾ വേണം?",
    askHow: "എങ്ങനെ വോട്ട് ചെയ്യാം?",
    suggestion1: "യോഗ്യത പരിശോധിക്കുക",
    suggestion2: "എന്റെ ബൂത്ത് കണ്ടെത്തുക",
    suggestion3: "വോട്ടിംഗ് ഗൈഡ്",
    votingGuideTitle: "വോട്ടിംഗ് ഗೈഡ്",
    votingGuideSub: "വോട്ടിംഗ് പ്രക്രിയയെക്കുറിച്ച് നിങ്ങൾ അറിയേണ്ടതെല്ലാം",
    guideStep1: "നിങ്ങളുടെ ഐഡി കരുതുക",
    guideStep1Desc: "നിങ്ങളുടെ വോട്ടർ ഐഡി അല്ലെങ്കിൽ ആധാർ കാർഡ് കൊണ്ടുവരിക.",
    guideStep2: "ബൂത്ത് കണ്ടെത്തുക",
    guideStep2Desc: "ഞങ്ങളുടെ ബൂത്ത് ഫൈൻഡർ ഉപയോഗിക്കുക.",
    guideStep3: "പരിശോധനയും മഷിയും",
    guideStep3Desc: "ഉദ്യോഗസ്ഥൻ ഐഡി പരിശോധിക്കുകയും മഷി പുരട്ടുകയും ചെയ്യും.",
    guideStep4: "വോട്ട് രേഖപ്പെടുത്തുക",
    guideStep4Desc: "സ്ഥാനാർത്ഥിക്കായി ഇവിഎം ബട്ടൺ അമർത്തുക.",
    startSimulation: "വോട്ടിംഗ് സിമുലേഷൻ ആരംഭിക്കുക",
    greeting: "നമസ്കാരം",
    greetingSub: "നിങ്ങളുടെ വ്യക്തിഗത സിവിക് ഹബ്. വോട്ടിംഗിനായി നിങ്ങളെ സജ്ಜരാക്കാം.",
    readyMsg: "🎉 തിരഞ്ഞെടുപ്പ് ദിനത്തിനായി നിങ്ങൾ 100% തയ്യാറാണ്!",
    pendingMsg: "100% എത്താൻ കൂടുതൽ ഘട്ടങ്ങൾ പൂർത്തിയാക്കുക",
    notifBadge: "AI",
    online: "ഓൺലൈൻ",
    typing: "ടൈപ്പ് ചെയ്യുന്നു...",
    suggestionsLabel: "നിർദ്ദേശങ്ങൾ:",
    downloadSlip: "നിങ്ങളുടെ ഡിജിറ്റൽ വോട്ടർ സ്ലിപ്പ് ഇപ്പോൾ ഡൗൺലോഡ് ചെയ്യുക!",
    roadmapDesc1: "നിങ്ങൾ വോട്ടിംഗിന് യോഗ്യനാണോ എന്ന് പരിശോധിക്കുക",
    roadmapDesc2: "പരിശോധനയ്ക്കായി നിങ്ങളുടെ പ്രൊഫൈൽ രജിസ്റ്റർ ചെയ്യുക",
    roadmapDesc3: "നിങ്ങളുടെ പോളിംഗ് ബൂത്ത് ലൊക്കേഷൻ കണ്ടെത്തുക",
    roadmapDesc4: "ഇവിഎം മെഷീൻ ഉപയോഗിക്കുന്നത് പരിശീലിക്കുക"
  },
  pa: {
    appTitle: "ਸਹਾਇਕ",
    electionLive: "ਚੋਣਾਂ 2026 ਲਾਈਵ",
    eligibility: "ਵੋਟਿੰਗ ਯੋਗਤਾ",
    eligibilitySub: "ਜਾਂਚ ਕਰੋ ਕਿ ਕੀ ਤੁਸੀਂ ਬਦਲਾਅ ਲਈ ਤਿਆਰ ਹੋ",
    dob: "ਜਨਮ ਮਿਤੀ",
    checkEligibility: "ਯੋਗਤਾ ਦੀ ਜਾਂਚ ਕਰੋ",
    eligible: "🎉 ਤੁਸੀਂ ਵੋਟ ਪਾਉਣ ਦੇ ਯੋਗ ਹੋ!",
    notEligible: "ਤੁਸੀਂ ਅਜੇ ਯੋਗ ਨਹੀਂ ਹੋ",
    startRegistration: "ਰਜਿਸਟ੍ਰੇਸ਼ਨ ਸ਼ੁਰੂ ਕਰੋ",
    setReminder: "ਰਿਮਾਈਂਡਰ ਸੈੱਟ ਕਰੋ",
    registration: "ਰਜਿਸਟ੍ਰੇਸ਼ਨ",
    registrationSub: "ਅੱਗੇ ਵਧਣ ਲਈ ਆਪਣੀ ਪ੍ਰੋਫਾਈਲ ਪੂਰੀ ਕਰੋ",
    email: "ਈਮੇਲ ਪਤਾ",
    mobile: "ਮੋਬਾਈਲ ਨੰਬਰ (ਵਿਕਲਪਿਕ)",
    continue: "ਜਾਰੀ ਰੱਖੋ",
    verification: "ਪੜਤਾਲ",
    verificationSub: "ਤੁਹਾਡੀ ਈਮੇਲ 'ਤੇ ਭੇਜਿਆ ਗਿਆ ਕੋਡ ਦਰਜ ਕਰੋ",
    verifyOtp: "OTP ਦੀ ਪੜਤਾਲ ਕਰੋ",
    resendCode: "ਕੋਡ ਦੁਬਾਰਾ ਭੇਜੋ",
    changeEmail: "ਈਮੇਲ ਬਦਲੋ",
    journey: "ਵੋਟਿੰਗ ਯਾਤਰਾ",
    journeySub: "ਆਪਣੀ ਪ੍ਰਗਤੀ ਨੂੰ ਟ੍ਰੈਕ ਕਰੋ",
    continueJourney: "ਯਾਤਰਾ ਜਾਰੀ ਰੱਖੋ",
    findBooth: "ਬੂਥ ਦੇ ਵੇਰਵੇ ਲੱਭੋ",
    welcome: "ਸਹਾਇਕ ਵਿੱਚ ਤੁਹਾਡਾ ਸੁਆਗਤ ਹੈ",
    onboardingSub: "ਸ਼ੁਰੂਆਤ ਕਰਨ ਲਈ ਤੁਰੰਤ ਗਾਈਡ",
    boothDetails: "ਬੂਥ ਦੇ ਵੇਰਵੇ",
    findMyBooth: "ਮੇਰਾ ਬੂਥ ਲੱਭੋ",
    selectCandidate: "ਉਮੀਦਵਾਰ ਚੁਣੋ",
    evmConfirm: "EVM ਪੁਸ਼ਟੀਕਰਨ",
    confirmVote: "ਵੋਟ ਦੀ ਪੁਸ਼ਟੀ ਕਰੋ",
    cancel: "ਰੱਦ ਕਰੋ",
    voteRecorded: "ਵੋਟ ਸਫਲਤਾਪੂਰਵਕ ਦਰਜ ਕੀਤੀ ਗਈ!",
    returnHome: "ਮੁੱਖ ਸਕ੍ਰੀਨ 'ਤੇ ਜਾਓ",
    downloadReceipt: "ਰਸੀਦ ਡਾਊਨਲੋਡ ਕਰੋ",
    referenceId: "ਹਵਾਲਾ ID",
    back: "ਪਿੱਛੇ",
    pincode: "ਸ਼ਹਿਰ ਜਾਂ ਪਿੰਨ ਕੋਡ",
    step1: "ਯੋਗਤਾ",
    step2: "ਰਜਿਸਟ੍ਰੇਸ਼ਨ",
    step3: "ਪੜਤਾਲ",
    step4: "ਵੋਟਿੰਗ",
    helpTitle: "ਅਸੀਂ ਕਿਵੇਂ ਮਦਦ ਕਰ ਸਕਦੇ ਹਾਂ?",
    helpSub: "ਆਪਣੀ ਸਮੱਸਿਆ ਚੁਣੋ",
    resolved: "ਹੱਲ ਹੋ ਗਿਆ",
    dashboard: "ਡੈਸ਼ਬੋਰਡ",
    issue1: "ਵੋਟਰ ਸੂਚੀ ਵਿੱਚ ਨਾਮ ਨਹੀਂ ਹੈ",
    issue2: "ਵੋਟਰ ਆਈਡੀ ਵਿੱਚ ਗਲਤ ਵੇਰਵੇ",
    issue3: "ਨਵੀਂ ਵੋਟਰ ਰਜਿਸਟ੍ਰੇਸ਼ਨ",
    issue4: "ਪਤਾ ਬਦਲਣਾ",
    mobileView: "ਮੋਬਾਈਲ ਵਿਊ",
    webView: "ਵੈੱਬ ਵਿਊ",
    healthMeter: "ਨਾਗਰਿਕ ਸਿਹਤ ਸਕੋਰ",
    quickActions: "ਤੁਰੰਤ ਕਾਰਵਾਈਆਂ",
    roadmap: "ਚੋਣ ਰੋਡਮੈਪ",
    notif1: "18 ਸਾਲ ਤੋਂ ਉੱਪਰ ਦੇ ਸਾਰੇ ਨਾਗਰਿਕ ਯੋਗ ਹਨ।",
    notif2: "ਆਪਣੇ ਪੋਲਿੰਗ ਸਟੇਸ਼ਨ ਨੂੰ ਲੱਭਣ ਲਈ ਬੂਥ ਸਰਚ ਦੀ ਵਰਤੋਂ ਕਰੋ।",
    assistantTitle: "ਨਾਗਰਿਕ ਸਹਾਇਕ",
    assistantGreet: "ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ! ਮੈਂ ਅੱਜ ਤੁਹਾਡੀ ਕਿਵੇਂ ਮਦਦ ਕਰ ਸਕਦਾ ਹਾਂ?",
    askBooth: "ਮੇਰਾ ਬੂਥ ਕਿੱਥੇ ਹੈ?",
    askDocs: "ਕਿਹੜੇ ਦਸਤਾਵੇਜ਼ ਚਾਹੀਦੇ ਹਨ?",
    askHow: "ਵੋਟ ਕਿਵੇਂ ਪਾਉਣੀ ਹੈ?",
    suggestion1: "ਯੋਗਤਾ ਦੀ ਜਾਂਚ ਕਰੋ",
    suggestion2: "ਮੇਰਾ ਬੂਥ ਲੱਭੋ",
    suggestion3: "ਵੋਟਿੰਗ ਗਾਈਡ",
    votingGuideTitle: "ਵੋਟਿੰਗ ਗਾਈਡ",
    votingGuideSub: "ਵੋਟਿੰਗ ਪ੍ਰਕਿਰਿਆ ਬਾਰੇ ਸਭ ਕੁਝ ਜੋ ਤੁਹਾਨੂੰ ਜਾਣਨ ਦੀ ਜ਼ਰੂਰਤ ਹੈ",
    guideStep1: "ਆਪਣੀ ਆਈਡੀ ਨਾਲ ਰੱਖੋ",
    guideStep1Desc: "ਆਪਣਾ ਵੋਟਰ ਆਈਡੀ ਜਾਂ ਆਧਾਰ ਕਾਰਡ ਲਿਆਓ।",
    guideStep2: "ਆਪਣਾ ਬੂਥ ਲੱਭੋ",
    guideStep2Desc: "ਸਾਡੇ ਬੂਥ ਫਾਈਂਡਰ ਦੀ ਵਰਤੋਂ ਕਰੋ।",
    guideStep3: "ਪੜਤਾਲ ਅਤੇ ਸਿਆਹੀ",
    guideStep3Desc: "ਅਧਿਕਾਰੀ ਤੁਹਾਡੀ ਆਈਡੀ ਦੀ ਪੜਤਾਲ ਕਰੇਗਾ ਅਤੇ ਸਿਆਹੀ ਲਗਾਏਗਾ।",
    guideStep4: "ਆਪਣੀ ਵੋਟ ਪਾਓ",
    guideStep4Desc: "ਆਪਣੇ ਉਮੀਦਵਾਰ ਲਈ ਈਵੀਐਮ ਬਟਨ ਦਬਾਓ।",
    startSimulation: "ਵੋਟਿੰਗ ਸਿਮੂਲੇਸ਼ਨ ਸ਼ੁਰੂ ਕਰੋ",
    greeting: "ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ",
    greetingSub: "ਤੁਹਾਡਾ ਨਿੱਜੀ ਨਾਗਰਿਕ ਹੱਬ। ਆਓ ਤੁਹਾਨੂੰ ਵੋਟ ਪਾਉਣ ਲਈ ਤਿਆਰ ਕਰੀਏ।",
    readyMsg: "🎉 ਤੁਸੀਂ ਚੋਣ ਦਿਨ ਲਈ 100% ਤਿਆਰ ਹੋ!",
    pendingMsg: "100% ਤੱਕ ਪਹੁੰਚਣ ਲਈ ਹੋਰ ਕਦਮ ਪੂਰੇ ਕਰੋ",
    notifBadge: "AI",
    online: "ਔਨਲਾਈਨ",
    typing: "ਟਾਈਪ ਕਰ ਰਿਹਾ ਹੈ...",
    suggestionsLabel: "ਸੁਝਾਅ:",
    downloadSlip: "ਆਪਣੀ ਡਿਜੀਟਲ ਵੋਟਰ ਸਲਿੱਪ ਹੁਣੇ ਡਾਊਨਲੋਡ ਕਰੋ!",
    roadmapDesc1: "ਜਾਂਚ ਕਰੋ ਕਿ ਕੀ ਤੁਸੀਂ ਵੋਟ ਪਾਉਣ ਦੇ ਯੋਗ ਹੋ",
    roadmapDesc2: "ਪੜਤਾਲ ਲਈ ਆਪਣੀ ਪ੍ਰੋਫਾਈਲ ਰਜਿਸਟਰ ਕਰੋ",
    roadmapDesc3: "ਆਪਣੇ ਪੋਲਿੰਗ ਬੂਥ ਦੀ ਸਥਿਤੀ ਲੱਭੋ",
    roadmapDesc4: "ਈਵੀਐਮ ਮਸ਼ੀਨ ਦੀ ਵਰਤੋਂ ਕਰਨ ਦਾ ਅਭਿਆਸ ਕਰੋ"
  },
};



const Logo = ({ size = 32 }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="app-logo-svg">
    <rect width="40" height="40" rx="8" fill="url(#logo-grad)" />
    <path d="M12 20L18 26L28 14" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M10 32H30" stroke="white" strokeWidth="3" strokeLinecap="round" />
    <defs>
      <linearGradient id="logo-grad" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
        <stop stopColor="#0ea5e9" />
        <stop offset="1" stopColor="#1e40af" />
      </linearGradient>
    </defs>
  </svg>
);

function App() {
  const [lang, setLang] = useState('en');
  const [viewMode, setViewMode] = useState('mobile');
  const t = TRANSLATIONS[lang] || TRANSLATIONS['en'];

  const [screen, setScreen] = useState('dashboard'); 
  const [currentStepIndex, setCurrentStepIndex] = useState(0); 

  // Chatbot State with Persistence
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState(() => {
    try {
      const saved = localStorage.getItem('sahayak_chat');
      return saved ? JSON.parse(saved) : [{ role: 'assistant', text: t.assistantGreet }];
    } catch (e) {
      console.error("Error loading chat from localStorage:", e);
      return [{ role: 'assistant', text: t.assistantGreet }];
    }
  });

  // Persist chat
  React.useEffect(() => {
    localStorage.setItem('sahayak_chat', JSON.stringify(chatMessages));
  }, [chatMessages]);
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
  const [selectedCandidate, setSelectedCandidate] = useState(null);

  const handleReset = () => {
    setScreen('dashboard');
    setCurrentStepIndex(0);
    setDob('');
    setEmail('');
    setMobile('');
    setOtp('');
    setSelectedCandidate(null);
    setEligibilityResult(null);
    setError('');
    setVotingDetails(null);
    // Optional: Reset chat too? Maybe not, keep it for continuity.
  };

  const cycleLanguage = () => {
    const langs = ['en', 'hi', 'mr', 'bn', 'te', 'ta', 'kn', 'gu', 'ml', 'pa'];
    const nextIndex = (langs.indexOf(lang) + 1) % langs.length;
    setLang(langs[nextIndex]);
  };

  const calculateEligibility = useCallback(() => {
    if (!dob || loading) return;
    
    if (checkEligibility(dob)) {
      setEligibilityResult({
        eligible: true,
        message: "🎉 You are eligible to vote!",
        buttonText: "Start Registration"
      });
    } else {
      const birthDate = new Date(dob);
      const eligibilityDate = new Date(birthDate);
      eligibilityDate.setFullYear(birthDate.getFullYear() + 18);
      setEligibilityResult({
        eligible: false,
        message: "You are not eligible yet",
        subMessage: `You will be eligible on ${eligibilityDate.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}`,
        buttonText: "Set Reminder"
      });
    }
  }, [dob, loading]);

  const handleContinue = useCallback(async () => {
    if (loading) return;
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
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify({ action: 'send_otp', email })
      });
      const data = await res.json();
      
      if (data.success !== false) {
        setOtp('');
        setResendMsg('');
        setScreen('otp');
      } else {
        setError(data.message || 'Failed to send OTP. Please try again.');
      }
    } catch (err) {
      setError('Network error. Please check your connection.');
    } finally {
      setLoading(false);
    }
  }, [email, mobile, loading]);

  const handleVerifyOtp = useCallback(async () => {
    if (loading) return;
    setError('');
    
    if (!otp || otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify({ action: 'verify_otp', email, otp })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setCurrentStepIndex(2);
        setScreen('dashboard');
      } else {
        setError(data.message || 'Invalid OTP. Please check your email and try again.');
      }
    } catch (err) {
      setError('Network error. Please check your connection.');
    } finally {
      setLoading(false);
    }
  }, [email, otp, loading]);

  const handleResend = useCallback(async () => {
    if (loading) return;
    setResendMsg('');
    setError('');
    setLoading(true);
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
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
    } finally {
      setLoading(false);
    }
    setTimeout(() => setResendMsg(''), 3000);
  }, [email, loading]);

  const handleFindDetails = useCallback(async () => {
    if (!locationInput || loading) return;

    setLoading(true);
    setError('');
    setVotingDetails(null);

    const cleanInput = normalizeLocationInput(locationInput);
    if (!cleanInput) {
      setError('Please enter a valid city or 6-digit pincode');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify({ action: 'find_booth', input: cleanInput })
      });

      const data = await res.json();
      
      if (data.success && data.booth) {
        const formattedData = formatBoothData(data);
        if (formattedData) {
          setVotingDetails(formattedData);
        } else {
          setError(`Invalid booth data format received.`);
        }
      } else {
        setError(data.message || `No booth found for "${locationInput}". Try another location.`);
      }
    } catch (err) {
      setError('Network error. Please check your connection.');
    } finally {
      setLoading(false);
    }
  }, [locationInput, loading]);

  const handleMarkAsDone = useCallback(() => {
    setCurrentStepIndex(prev => Math.min(prev + 1, 3));
    setScreen('journey');
  }, []);

  const handleViewMap = () => {
    if (votingDetails?.address) {
      const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(votingDetails.address)}`;
      window.open(url, '_blank');
    }
  };

  const handleGetDirections = () => {
    if (votingDetails?.address) {
      const url = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(votingDetails.address)}`;
      window.open(url, '_blank');
    }
  };

  const LoadingSpinner = () => <div className="spinner"></div>;

  const renderEligibility = () => (
    <div className="card">
      <div className="card-header">
        <h1 className="card-title">{t.eligibility}</h1>
        <p className="card-subtitle">{t.eligibilitySub}</p>
      </div>
      
      <div className="input-field">
        <input 
          type="date" 
          id="dob"
          value={dob} 
          onChange={(e) => setDob(e.target.value)} 
          max={new Date().toISOString().split("T")[0]}
          placeholder=" "
        />
        <label htmlFor="dob">{t.dob}</label>
      </div>

      <button className="btn btn-primary" onClick={calculateEligibility} disabled={!dob || loading}>
        {loading ? <LoadingSpinner /> : t.checkEligibility}
      </button>

      {eligibilityResult && (
        <div className={`mt-4 p-4 rounded-xl text-center ${eligibilityResult.eligible ? 'bg-emerald-50' : 'bg-slate-50'}`} style={{ 
          background: eligibilityResult.eligible ? '#f0fdf4' : '#f8fafc',
          padding: '24px',
          borderRadius: '20px',
          border: `1px solid ${eligibilityResult.eligible ? '#10b981' : '#e2e8f0'}`
        }}>
          <p className={`text-xl font-bold mb-2 ${eligibilityResult.eligible ? 'text-emerald-600' : 'text-slate-600'}`} style={{ color: eligibilityResult.eligible ? '#059669' : '#475569' }}>
            {eligibilityResult.message}
          </p>
          {eligibilityResult.subMessage && <p className="text-sm italic mb-4 text-slate-500">{eligibilityResult.subMessage}</p>}
          <button 
            className={`btn ${eligibilityResult.eligible ? 'btn-primary' : 'btn-outline'} mt-2`} 
            onClick={eligibilityResult.eligible ? () => { setScreen('registration'); setCurrentStepIndex(1); } : undefined}
          >
            {eligibilityResult.buttonText}
          </button>
        </div>
      )}
    </div>
  );

  const renderRegistration = () => (
    <div className="card">
      <div className="card-header">
        <h1 className="card-title">{t.registration}</h1>
        <p className="card-subtitle">{t.registrationSub}</p>
      </div>
 
      <div className="input-field">
        <input
          type="email"
          id="email"
          placeholder=" "
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoFocus
        />
        <label htmlFor="email">{t.email}</label>
      </div>
 
      <div className="input-field mt-2">
        <input
          type="number"
          id="mobile"
          placeholder=" "
          value={mobile}
          onChange={(e) => setMobile(e.target.value)}
        />
        <label htmlFor="mobile">{t.mobile}</label>
      </div>

      {error && <div className="error-banner">{error}</div>}
      
      <button className="btn btn-primary mt-2" onClick={handleContinue} disabled={loading}>
        {loading ? <LoadingSpinner /> : t.continue}
        {!loading && <ChevronRight size={20} />}
      </button>
    </div>
  );

  const renderOtp = () => (
    <div className="card">
      <div className="card-header">
        <h1 className="card-title">{t.verification}</h1>
        <p className="card-subtitle">{t.verificationSub}</p>
      </div>

      <div className="otp-group">
        <input
          className="otp-box"
          type="text"
          maxLength="6"
          placeholder="●●●●●●"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          autoFocus
        />
      </div>

      {error && <div className="error-banner">{error}</div>}
      {resendMsg && <p className="text-center text-success text-sm">{resendMsg}</p>}

      <button className="btn btn-primary" onClick={handleVerifyOtp} disabled={loading}>
        {loading ? <LoadingSpinner /> : t.verifyOtp}
      </button>

      <button className="btn btn-outline" onClick={handleResend} disabled={loading}>
        {t.resendCode}
      </button>

      <button className="btn btn-secondary" onClick={() => setScreen('registration')}>
        <ArrowLeft size={18} /> {t.changeEmail}
      </button>
    </div>
  );
  const renderDashboard = () => {
    let readinessScore = 0;
    if (eligibilityResult?.eligible) readinessScore += 25;
    if (currentStepIndex >= 2) readinessScore += 25;
    if (votingDetails) readinessScore += 25;
    if (selectedCandidate) readinessScore += 25;

    const JOURNEY_MAP = [
      { id: 'eligibility', step: 'Step 1', title: t.step1, done: eligibilityResult?.eligible, desc: t.roadmapDesc1, icon: <UserCheck size={20} /> },
      { id: 'registration', step: 'Step 2', title: t.step2, done: currentStepIndex >= 2, desc: t.roadmapDesc2, icon: <ClipboardList size={20} /> },
      { id: 'voting_details', step: 'Step 3', title: t.step3, done: !!votingDetails, desc: t.roadmapDesc3, icon: <MapPin size={20} /> },
      { id: 'candidates', step: 'Step 4', title: t.step4, done: !!selectedCandidate, desc: t.roadmapDesc4, icon: <Vote size={20} /> }
    ];

    return (
      <div className="dashboard-container animate-fade-in">
        
        {/* Personalized Greeting */}
        <header className="greeting-section">
          <h1 className="greeting-title" style={{ fontSize: '26px' }}>
            Your step-by-step voting assistant
          </h1>
          <p className="greeting-sub">
            {t.greetingSub}
          </p>
        </header>

        {/* Civic Health Meter */}
        <div className="premium-health-card">
          <div className="health-header">
            <div className="health-title-group">
              <div className="health-icon-bg">
                <Activity size={24} />
              </div>
              <div>
                <h2 style={{ fontSize: '18px', fontWeight: 700 }}>{t.healthMeter}</h2>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{readinessScore === 100 ? t.readyMsg : t.pendingMsg}</p>
              </div>
            </div>
            <div className="score-display">
              <span className="score-value">{readinessScore}</span>
              <span className="score-unit">%</span>
            </div>
          </div>
          <div className="progress-track">
            <div className="progress-glow" style={{ width: `${readinessScore}%` }}></div>
            <div className="progress-fill" style={{ width: `${readinessScore}%` }}></div>
          </div>
        </div>

        {/* The 4-Step Guided Journey */}
        <section className="section-container">
          <h3 className="section-title">{t.roadmap}</h3>
          <div className="journey-linear-flow">
            {JOURNEY_MAP.map((step, idx) => (
              <div 
                key={idx} 
                className={`journey-card ${step.done ? 'completed' : (idx === 0 || JOURNEY_MAP[idx-1].done ? 'active' : 'locked')}`}
                onClick={() => (idx === 0 || JOURNEY_MAP[idx-1].done) && setScreen(step.id)}
              >
                <div className="journey-step-indicator">{step.step}</div>
                <div className="journey-card-content">
                  <div className="journey-icon-box">
                    {step.done ? <CheckCircle2 size={24} color="#10b981" /> : step.icon}
                  </div>
                  <div className="journey-details">
                    <h4>{step.title}</h4>
                    <p>{step.desc}</p>
                  </div>
                  <ChevronRight size={20} className="journey-arrow" />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Quick Help for Blockers */}
        <section className="section-container">
          <h3 className="section-title">{t.quickActions}</h3>
          <div className="help-links-grid">
            <div className="help-item-card" onClick={() => setScreen('issue')}>
              <AlertCircle size={20} color="var(--warning)" />
              <span>Fix voting-related problems</span>
            </div>
          </div>
        </section>

      </div>
    );
  };




  const renderIssue = () => (
    <div className="card">
      <div className="card-header">
        <h1 className="card-title">{t.helpTitle}</h1>
        <p className="card-subtitle">{t.helpSub}</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {[
          { id: 'solution_name_not_in_list', text: t.issue1 },
          { id: 'solution_wrong_details', text: t.issue2 },
          { id: 'solution_new_registration', text: t.issue3 },
          { id: 'solution_address_change', text: t.issue4 }
        ].map(item => (
          <button key={item.id} className="btn btn-outline" style={{ justifyContent: 'space-between', padding: '20px' }} onClick={() => setScreen(item.id)}>
            {item.text}
            <ChevronRight size={18} />
          </button>
        ))}
      </div>
    </div>
  );

  const renderSolution = (title, content) => (
    <div className="card">
      <div className="card-header">
        <h1 className="card-title">{title}</h1>
      </div>
      <div style={{ padding: '24px', background: '#f8fafc', borderRadius: '20px', border: '1px solid #e2e8f0', lineHeight: 1.6, marginBottom: '24px' }}>
        {content}
      </div>
      <div style={{ display: 'flex', gap: '12px' }}>
        <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setScreen('dashboard')}>{t.dashboard}</button>
        <button className="btn btn-primary" style={{ flex: 1 }} onClick={handleMarkAsDone}>{t.resolved}</button>
      </div>
    </div>
  );

  const renderVotingDetails = () => (
    <div className="card">
      <div className="card-header">
        <h1 className="card-title">{t.boothDetails}</h1>
        <p className="card-subtitle">{t.findBooth}</p>
      </div>

      <div className="input-field">
        <input
          type="text"
          id="location"
          placeholder=" "
          value={locationInput}
          onChange={(e) => setLocationInput(e.target.value)}
        />
        <label htmlFor="location">{t.pincode}</label>
      </div>

      <button className="btn btn-primary" onClick={handleFindDetails} disabled={loading}>
        {loading ? <LoadingSpinner /> : t.findMyBooth}
      </button>

      {error && <div className="error-banner">{error}</div>}

      {votingDetails && (
        <div className="mt-4" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="p-4" style={{ background: 'white', borderRadius: '20px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
            <h3 style={{ color: 'var(--primary-navy)', fontSize: '18px', fontWeight: 700, marginBottom: '16px' }}>{votingDetails.booth}</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', gap: '12px' }}>
                <MapPin size={18} color="var(--accent-blue)" />
                <p style={{ fontSize: '14px' }}>{votingDetails.address}</p>
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <Calendar size={18} color="var(--accent-blue)" />
                <p style={{ fontSize: '14px' }}>{votingDetails.date}</p>
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <Clock size={18} color="var(--accent-blue)" />
                <p style={{ fontSize: '14px' }}>{votingDetails.time}</p>
              </div>
            </div>

            <div className="map-preview">
              <iframe
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                allowFullScreen
                src={`https://maps.google.com/maps?q=${encodeURIComponent(votingDetails.address)}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
              ></iframe>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
              <button className="btn btn-outline" style={{ flex: 1 }} onClick={handleViewMap}>Map</button>
              <button className="btn btn-outline" style={{ flex: 1 }} onClick={handleGetDirections}>Directions</button>
            </div>
          </div>
          
          <button className="btn btn-success" onClick={() => setScreen('candidates')}>
            Proceed to Vote
          </button>
        </div>
      )}

      <button className="btn btn-secondary" onClick={() => setScreen('journey')}>
        <ArrowLeft size={18} /> {t.back}
      </button>
    </div>
  );

  const renderCandidateSelection = () => (
    <div className="card">
      <div className="card-header">
        <h1 className="card-title">{t.selectCandidate}</h1>
        <p className="card-subtitle">{t.evmConfirm}</p>
      </div>

      <div className="candidate-list">
        {['Party A', 'Party B', 'Party C', 'NOTA'].map(candidate => (
          <div 
            key={candidate}
            className={`candidate-item ${selectedCandidate === candidate ? 'selected' : ''}`}
            onClick={() => setSelectedCandidate(candidate)}
          >
            <div>
              <p style={{ fontWeight: 600 }}>{candidate}</p>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Parliamentary Election 2026</p>
            </div>
            <div style={{ width: '24px', height: '24px', borderRadius: '50%', border: '2px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {selectedCandidate === candidate && <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'var(--accent-blue)' }}></div>}
            </div>
          </div>
        ))}
      </div>

      <button className="btn btn-primary mt-4" disabled={!selectedCandidate} onClick={() => setScreen('evm')}>
        {t.continue}
      </button>

      <button className="btn btn-outline" onClick={() => setScreen('voting_details')}>
        <ArrowLeft size={18} /> {t.back}
      </button>
    </div>
  );

  const renderEVM = () => (
    <div className="evm-machine">
      <div className="card-header">
        <h2 style={{ color: 'white', fontSize: '20px', marginBottom: '24px' }}>{t.evmConfirm}</h2>
      </div>
      
      <div className="evm-display">
        <p style={{ color: '#94a3b8', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '8px' }}>Selected Candidate</p>
        <h3 style={{ fontSize: '32px', color: '#38bdf8', fontWeight: 700 }}>{selectedCandidate}</h3>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <button className="btn evm-confirm-btn" onClick={() => setScreen('vote_success')}>
          {t.confirmVote}
        </button>
        
        <button className="btn btn-outline" style={{ color: '#94a3b8', borderColor: '#334155' }} onClick={() => setScreen('candidates')}>
          {t.cancel}
        </button>
      </div>

      <div className="mt-8 text-center">
        <p style={{ fontSize: '10px', color: '#475569', textTransform: 'uppercase' }}>Secure Voting System v2.4</p>
      </div>
    </div>
  );

  const renderVoteSuccess = () => (
    <div className="card text-center animate-slide-up">
      <div className="success-icon-wrapper">
        <div className="success-icon-bg">
          <CheckCircle2 size={48} color="#fff" />
        </div>
      </div>
      
      <h1 className="card-title premium-gradient-text">{t.voteRecorded}</h1>
      <p className="card-subtitle">{t.onboardingSub}</p>
      
      <div className="confirmation-badge">
        <p className="badge-label">{t.referenceId}</p>
        <p className="badge-value">VOTE-2026-SYK-9912</p>
      </div>

      <div className="success-footer-actions">
        <button className="btn btn-primary w-full" onClick={handleReset}>
          <Home size={18} style={{ marginRight: '8px' }} /> {t.returnHome}
        </button>
        <button className="btn btn-outline w-full" style={{ marginTop: '12px' }} onClick={() => window.print()}>
          <Download size={18} style={{ marginRight: '8px' }} /> {t.downloadReceipt}
        </button>
      </div>
    </div>
  );


  return (
    <div className={`app-container ${viewMode}-mode`}>
      <div className="mesh-bg"></div>
      <header className="app-header">
        <div className="header-brand">
          <div className="header-branding">
            <Vote size={32} color="var(--accent-blue)" />
            <div className="brand-text-stack">
              <span className="header-title">{t.appTitle}</span>
              <span className="header-tagline">{t.tagline}</span>
            </div>
          </div>
        </div>
        <div className="header-status">
          <div className="header-controls">
            <div className="view-toggle-group">
              <button 
                className={`toggle-btn ${viewMode === 'mobile' ? 'active' : ''}`}
                onClick={() => setViewMode('mobile')}
                title={t.mobileView}
              >
                <Smartphone size={18} />
                <span className="hide-mobile">{t.mobileView}</span>
              </button>
              <button 
                className={`toggle-btn ${viewMode === 'web' ? 'active' : ''}`}
                onClick={() => setViewMode('web')}
                title={t.webView}
              >
                <Monitor size={18} />
                <span className="hide-mobile">{t.webView}</span>
              </button>
            </div>
            <button className="lang-toggle" onClick={cycleLanguage}>
              <Languages size={18} />
              <span style={{textTransform: 'uppercase'}}>{lang}</span>
            </button>
          </div>
          <div className="status-indicator hide-mobile">
            <span className="status-dot"></span>
            <span className="status-text">{t.electionLive}</span>
          </div>
        </div>
      </header>

      <main className="main-content">
        {screen === 'dashboard' && renderDashboard()}
        {screen === 'eligibility' && renderEligibility()}
        {screen === 'registration' && renderRegistration()}
        {screen === 'otp' && renderOtp()}
        {screen === 'issue' && renderIssue()}
        {screen === 'solution_name_not_in_list' && renderSolution(t.issue1, t.sol1)}
        {screen === 'solution_wrong_details' && renderSolution(t.issue2, t.sol2)}
        {screen === 'solution_new_registration' && renderSolution(t.issue3, t.sol3)}
        {screen === 'solution_address_change' && renderSolution(t.issue4, t.sol4)}
        {screen === 'voting_details' && renderVotingDetails()}
        {screen === 'candidates' && renderCandidateSelection()}
        {screen === 'evm' && renderEVM()}
        {screen === 'vote_success' && renderVoteSuccess()}
      </main>

      {/* Render AI Assistant Globally */}
      <SmartAIAssistant 
        t={t} 
        lang={lang} 
        chatMessages={chatMessages} 
        setChatMessages={setChatMessages} 
        isChatOpen={isChatOpen} 
        setIsChatOpen={setIsChatOpen} 
      />
    </div>
  );
}

const SmartAIAssistant = ({ t, lang, chatMessages, setChatMessages, isChatOpen, setIsChatOpen }) => {
  const [isTyping, setIsTyping] = useState(false);
  const chatBodyRef = React.useRef(null);

  React.useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [chatMessages, isTyping, isChatOpen]);
  
  const suggestions = [
    { text: t.askDocs, id: 'docs' },
    { text: t.askBooth, id: 'booth' },
    { text: t.askHow, id: 'how' }
  ];

  const handleSuggestionClick = (suggestion) => {
    setChatMessages(prev => [...prev, { role: 'user', text: suggestion.text }]);
    setIsTyping(true);
    
    // Simulate AI response based on language and suggestion
    setTimeout(() => {
      let response = "";
      if (suggestion.id === 'docs') {
        response = lang === 'hi' ? "आपको अपने मतदाता पहचान पत्र या आधार कार्ड, पैन कार्ड या ड्राइविंग लाइसेंस जैसे किसी भी सरकारी पहचान पत्र की आवश्यकता होगी।" : 
                   lang === 'mr' ? "तुम्हाला तुमचे मतदार ओळखपत्र किंवा आधार कार्ड, पॅन कार्ड किंवा ड्रायव्हिंग लायसन्स यांसारख्या कोणत्याही सरकारी ओळखपत्राची आवश्यकता असेल." :
                   "You need your Voter ID card or any government-issued ID like Aadhaar, PAN card, or Driving License.";
      }
      else if (suggestion.id === 'booth') {
        response = lang === 'hi' ? "आप डैशबोर्ड के 'बूथ खोजें' अनुभाग में अपना पिनकोड या शहर दर्ज करके अपना बूथ पा सकते हैं।" :
                   lang === 'mr' ? "तुम्ही डॅशबोर्डच्या 'बूथ शोधा' विभागात तुमचा पिनकोड किंवा शहर टाकून तुमचा बूथ शोधू शकता." :
                   "You can find your booth by entering your pincode or city in the 'Find Booth' section of the dashboard.";
      }
      else if (suggestion.id === 'how') {
        response = lang === 'hi' ? "वोट डालने के लिए, चुनाव के दिन अपने निर्धारित बूथ पर जाएं, अपनी पहचान सत्यापित करें, अमिट स्याही का निशान लगाएं और अपने पसंदीदा उम्मीदवार के लिए ईवीएम पर बटन दबाएं।" :
                   lang === 'mr' ? "मतदान करण्यासाठी, निवडणुकीच्या दिवशी तुमच्या नियुक्त बूथला भेट द्या, तुमची ओळख सत्यापित करा, शाई लावून घ्या आणि तुमच्या पसंतीच्या उमेदवारासाठी ईव्हीएमवरील बटण दाबा." :
                   "To vote, visit your assigned booth on election day, verify your identity, get the indelible ink mark, and press the button on the EVM for your chosen candidate.";
      }
      
      setChatMessages(prev => [...prev, { role: 'assistant', text: response }]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="ai-assistant-wrapper">
      {isChatOpen && (
        <div className="chat-window animate-scale-in">
          <div className="chat-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div className="assistant-avatar">
                <MessageCircle size={20} color="white" />
              </div>
              <div>
                <h4 style={{ color: 'white', fontSize: '15px', fontWeight: 700 }}>{t.assistantTitle}</h4>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <div className="online-dot"></div>
                  <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '11px' }}>{t.online}</span>
                </div>
              </div>
            </div>
            <button className="close-chat" onClick={() => setIsChatOpen(false)} aria-label="Close Chat">
              <X size={20} color="white" />
            </button>
          </div>
          
          <div className="chat-body" ref={chatBodyRef}>
            {chatMessages.map((msg, i) => (
              <div key={i} className={`message-bubble ${msg.role}`}>
                {msg.text}
              </div>
            ))}
            {isTyping && (
              <div className="typing-indicator">
                <div className="typing-dot"></div>
                <div className="typing-dot"></div>
                <div className="typing-dot"></div>
              </div>
            )}
          </div>

          <div className="chat-footer">
            <p className="suggestion-label">{t.suggestionsLabel}</p>
            <div className="suggestions-grid">
              {suggestions.map(s => (
                <button key={s.id} className="suggestion-chip" onClick={() => handleSuggestionClick(s)} aria-label={s.text}>
                  {s.text}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
      
      <button className={`floating-assistant-btn ${isChatOpen ? 'active' : ''}`} onClick={() => setIsChatOpen(!isChatOpen)} aria-label="Toggle AI Assistant">
        {isChatOpen ? <X size={28} /> : <MessageCircle size={28} />}
        {!isChatOpen && <span className="btn-badge">{t.notifBadge}</span>}
      </button>
    </div>
  );
};

export default App;
