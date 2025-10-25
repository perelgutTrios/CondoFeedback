import React, { useState } from 'react';
import emailjs from '@emailjs/browser';
import { FeedbackStorage } from './services/FeedbackStorage';
import { CryptoUtils } from './services/CryptoUtils';
import './App.css';

function App() {
  const [copyPM, setCopyPM] = useState(false);
  const [anonymous, setAnonymous] = useState(false);
  const [formData, setFormData] = useState({
    familyName: '',
    unitNumber: '',
    topics: [], // Changed to array for multiple selections
    urgency: 'Other',
    subject: '',
    comment: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const errors = [];
    
    // Check if at least one topic is selected
    if (formData.topics.length === 0) {
      errors.push('Please select at least one topic');
    }
    
    // Check if urgency is selected (not default)
    if (formData.urgency === 'Other') {
      errors.push('Please select an urgency level');
    }
    
    // Check if subject is filled
    if (!formData.subject.trim()) {
      errors.push('Please enter a subject');
    }
    
    // Check if either name/unit is provided OR anonymous is checked
    const hasNameInfo = formData.familyName.trim() || formData.unitNumber.trim();
    if (!hasNameInfo && !anonymous) {
      errors.push('Please provide your family name/unit number OR check the anonymous option');
    }
    
    return errors;
  };

  const isFormValid = () => {
    return validateForm().length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTopicChange = (topic) => {
    setFormData(prev => ({
      ...prev,
      topics: prev.topics.includes(topic) 
        ? prev.topics.filter(t => t !== topic)
        : [...prev.topics, topic]
    }));
  };

  const handleSubmit = async (buttonType) => {
    const validationErrors = validateForm();
    
    if (validationErrors.length > 0) {
      alert('Please fix the following issues:\n\n' + validationErrors.join('\n'));
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Save submission locally first (most reliable)
      const submissionData = {
        familyName: anonymous ? 'ANONYMOUS' : formData.familyName,
        unitNumber: anonymous ? '0' : formData.unitNumber,
        topics: formData.topics.join(', '), // Join topics with comma for storage
        urgency: formData.urgency,
        subject: formData.subject,
        comment: formData.comment || 'No comment provided',
        isAnonymous: anonymous,
        copyPM: copyPM,
        buttonType: buttonType
      };
      
      const storageResult = FeedbackStorage.saveSubmission(submissionData);
      
      // EmailJS configuration - REPLACE THESE WITH YOUR ACTUAL EMAILJS CREDENTIALS
      const serviceID = 'service_qva1rqm';     // From EmailJS Email Services
      const templateID = 'template_ry5de2o';   // From EmailJS Email Templates  
      const publicKey = 'CoVhsU9wD16o75WI-';     // From EmailJS Account settings

      const templateParams = {
        to_email: 'perelgut@gmail.com',
        from_name: submissionData.familyName,
        unit_number: submissionData.unitNumber,
        topic: submissionData.topics, // Now contains multiple topics
        urgency: submissionData.urgency,
        subject: submissionData.subject,
        message: submissionData.comment,
        button_type: buttonType,
        submission_id: storageResult.id || 'Not saved'
      };

      let emailStatus = '';
      
      try {
        // Check if EmailJS is configured
        if (serviceID === 'YOUR_SERVICE_ID_HERE' || templateID === 'YOUR_TEMPLATE_ID_HERE' || publicKey === 'YOUR_PUBLIC_KEY_HERE') {
          // Prototype mode - show what would be sent
          emailStatus = '📧 PROTOTYPE MODE - Email would be sent to perelgut@gmail.com';
        } else {
          // Real email sending
          await emailjs.send(serviceID, templateID, templateParams, publicKey);
          emailStatus = '📧 Email sent to perelgut@gmail.com';
        }
      } catch (emailError) {
        console.error('Email failed:', emailError);
        emailStatus = '⚠️ Email failed (submission still saved locally)';
      }

      // Show comprehensive results
      const successIcon = storageResult.success ? '✅' : '⚠️';
      const totalSubmissions = FeedbackStorage.getSubmissionCount();
      
      alert(`${successIcon} Feedback Submitted Successfully!

Your message about "${formData.subject}" has been processed:

💾 Saved locally (ID: ${storageResult.id || 'Failed'})
${emailStatus}

📊 Total submissions saved: ${totalSubmissions}
📋 Data is automatically backed up in your browser

Details:
Family: ${submissionData.familyName}
Unit: ${submissionData.unitNumber}
Topics: ${submissionData.topics}
Urgency: ${submissionData.urgency}${copyPM && !anonymous ? '\\nCopy PM: Yes' : ''}`);

      // Reset form only if local save was successful
      if (storageResult.success) {
        setFormData({
          familyName: '',
          unitNumber: '',
          topics: [],
          urgency: 'Other',
          subject: '',
          comment: ''
        });
        setCopyPM(false);
        setAnonymous(false);
      }
      
    } catch (error) {
      console.error('Error submitting feedback:', error);
      alert(`❌ Error submitting feedback: ${error.message}\n\nPlease try again or contact the administrator.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      familyName: '',
      unitNumber: '',
      topics: [],
      urgency: 'Other',
      subject: '',
      comment: ''
    });
    setCopyPM(false);
    setAnonymous(false);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault(); // Prevent default form submission
  };

  return (
    <div className="container">
      <header className="header">
        <img 
          src="https://theessex.ca/wp-content/uploads/2016/12/cropped-cropped-The-Essexlogo.jpg" 
          alt="The Essex Logo" 
          style={{
            height: '60px',
            marginBottom: '10px',
            display: 'block',
            margin: '0 auto 15px auto'
          }}
        />
        🏢 Condo Feedback Portal
      </header>
      <form className="form" onSubmit={handleFormSubmit}>
        <label>
          <input
            type="checkbox"
            checked={anonymous}
            onChange={(e) => setAnonymous(e.target.checked)}
          />
          Submit Anonymously
        </label>

        <div className="name-unit-row">
          <div className="name-field">
            <label>Family Name</label>
            <input 
              type="text" 
              name="familyName"
              value={formData.familyName}
              onChange={handleInputChange}
              maxLength="100" 
              disabled={anonymous}
              placeholder={anonymous ? "Anonymous submission" : "Enter family name"}
              style={{ opacity: anonymous ? 0.5 : 1 }}
            />
          </div>

          <div className="unit-field">
            <label>Unit Number</label>
            <input 
              type="text" 
              name="unitNumber"
              value={formData.unitNumber}
              onChange={handleInputChange}
              maxLength="10" 
              disabled={anonymous}
              placeholder={anonymous ? "Anonymous submission" : "Enter unit number"}
              style={{ opacity: anonymous ? 0.5 : 1 }}
            />
          </div>
        </div>

        <div className="topic-urgency-row">
          <div className="topic-field">
            <label>Topics * (Select all that apply)</label>
            <div className="topic-checkboxes">
              {[
                'Plumbing',
                'HVAC',
                'Hallway',
                'In-Unit',
                'Lobby',
                'Garage',
                'Recreation Facilities',
                'Party Room',
                'Meeting Rooms',
                'Golf Room',
                'Fitness Room',
                'Pool and Hot Tub',
                'Pool Tables',
                'Lockers',
                'Noise',
                'Smells',
                'Leaks',
                'Other'
              ].map(topic => (
                <label key={topic} className="topic-checkbox">
                  <input
                    type="checkbox"
                    checked={formData.topics.includes(topic)}
                    onChange={() => handleTopicChange(topic)}
                  />
                  {topic}
                </label>
              ))}
            </div>
          </div>

          <div className="urgency-field">
            <label>Urgency *</label>
            <select 
              name="urgency"
              value={formData.urgency}
              onChange={handleInputChange}
            >
              <option value="Other">-- Select Urgency --</option>
              <option>Urgent (Must report to concierge as well as here)</option>
              <option>Important</option>
              <option>Troublesome</option>
              <option>Compliments</option>
            </select>
          </div>
        </div>

        <label>Subject *</label>
        <input 
          type="text" 
          name="subject"
          value={formData.subject}
          onChange={handleInputChange}
          maxLength="150" 
          placeholder="Enter subject"
        />

        <label>Comment</label>
        <textarea 
          name="comment"
          value={formData.comment}
          onChange={handleInputChange}
          maxLength="2500"
          placeholder="Enter your comment or feedback"
        ></textarea>

        <div className="alternative">
          <button 
            type="button" 
            className="cancel"
            onClick={handleCancel}
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button 
            type="button" 
            className="send"
            onClick={() => handleSubmit('General Submit')}
            disabled={isSubmitting || !isFormValid()}
          >
            {isSubmitting ? 'Sending...' : 'Submit'}
          </button>
          <label>
            <input
              type="checkbox"
              checked={copyPM}
              onChange={() => setCopyPM(!copyPM)}
            />
            Copy Property Manager
          </label>
        </div>
      </form>

      {/* Admin Panel */}
      <AdminPanel />
    </div>
  );
}

// Password-Protected Admin Panel Component
function AdminPanel() {
  const [submissionCount, setSubmissionCount] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginError, setLoginError] = useState('');

  const updateCount = () => {
    setSubmissionCount(FeedbackStorage.getSubmissionCount());
  };

  const checkAuthStatus = () => {
    setIsAuthenticated(CryptoUtils.isAdminLoggedIn());
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setLoginError('');
    
    try {
      const result = await CryptoUtils.loginAdmin(password);
      
      if (result.success) {
        setIsAuthenticated(true);
        setPassword('');
        setLoginError('');
        updateCount();
        // Extend session on activity
        CryptoUtils.extendSession();
      } else {
        setLoginError(result.message);
        setPassword('');
      }
    } catch (error) {
      setLoginError('Authentication error occurred');
      setPassword('');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    CryptoUtils.logoutAdmin();
    setIsAuthenticated(false);
    setIsExpanded(false);
    setPassword('');
    setLoginError('');
  };

  const handleExportCSV = () => {
    CryptoUtils.extendSession();
    const result = FeedbackStorage.exportAsCSV();
    if (result.success) {
      alert(`✅ Exported ${result.count} submissions to ${result.filename}`);
      updateCount();
    }
  };

  const handleExportJSON = () => {
    CryptoUtils.extendSession();
    const result = FeedbackStorage.exportAsJSON();
    if (result.success) {
      alert(`✅ Backup created: ${result.filename}`);
      updateCount();
    }
  };

  const handleClearData = () => {
    CryptoUtils.extendSession();
    const result = FeedbackStorage.clearAllSubmissions();
    if (result.success) {
      alert(result.message);
      updateCount();
    }
  };

  const handleViewRecent = () => {
    CryptoUtils.extendSession();
    const recent = FeedbackStorage.getRecentSubmissions(5);
    if (recent.length === 0) {
      alert('No submissions found');
      return;
    }
    
    const summary = recent.map(sub => 
      `${sub.submittedAt} - ${sub.subject} (${sub.topic})`
    ).join('\\n');
    
    alert(`Recent Submissions (${recent.length}):\\n\\n${summary}\\n\\nUse Export CSV for full details`);
  };

  const handlePanelToggle = () => {
    if (!isAuthenticated) {
      // Show login form
      setIsExpanded(!isExpanded);
    } else {
      // Toggle admin panel
      setIsExpanded(!isExpanded);
      if (isExpanded) {
        CryptoUtils.extendSession();
      }
    }
  };

  // Update count and check auth on component mount
  React.useEffect(() => {
    updateCount();
    checkAuthStatus();
    
    // Check auth status periodically (for session timeout)
    const interval = setInterval(checkAuthStatus, 60000); // Check every minute
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="admin-panel">
      <div className="admin-header" onClick={handlePanelToggle}>
        🔧 Admin Panel ({submissionCount} submissions) {isExpanded ? '▼' : '▶'}
        {isAuthenticated && <span className="auth-indicator"> 🔓</span>}
      </div>
      
      {isExpanded && (
        <div className="admin-content">
          {!isAuthenticated ? (
            // Login Form
            <div className="admin-login">
              <form onSubmit={handleLogin} className="login-form">
                <div className="login-header">
                  🔒 <strong>Admin Access Required</strong>
                </div>
                <div className="login-field">
                  <label htmlFor="adminPassword">Password:</label>
                  <input
                    type="password"
                    id="adminPassword"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter admin password"
                    required
                    disabled={isLoggingIn}
                  />
                </div>
                {loginError && (
                  <div className="login-error">
                    ❌ {loginError}
                  </div>
                )}
                <div className="login-actions">
                  <button 
                    type="submit" 
                    className="admin-btn login" 
                    disabled={isLoggingIn || !password.trim()}
                  >
                    {isLoggingIn ? '🔄 Checking...' : '🔓 Login'}
                  </button>
                </div>
                <div className="login-info">
                  <small>🔒 Secure authentication with SHA-256 encryption</small>
                </div>
              </form>
            </div>
          ) : (
            // Admin Panel Content (only shown when authenticated)
            <>
              <div className="admin-stats">
                <p>📊 Total Submissions: <strong>{submissionCount}</strong></p>
                <p>💾 Storage: Browser localStorage (persistent)</p>
                <p>🔓 Admin session expires in 30 minutes</p>
              </div>
              
              <div className="admin-actions">
                <button onClick={handleViewRecent} className="admin-btn view">
                  👁️ View Recent (5)
                </button>
                <button onClick={handleExportCSV} className="admin-btn export">
                  📊 Export CSV
                </button>
                <button onClick={handleExportJSON} className="admin-btn backup">
                  💾 Backup JSON
                </button>
                <button onClick={handleClearData} className="admin-btn danger">
                  🗑️ Clear All Data
                </button>
                <button onClick={updateCount} className="admin-btn refresh">
                  🔄 Refresh Count
                </button>
                <button onClick={handleLogout} className="admin-btn logout">
                  🔒 Logout
                </button>
              </div>
              
              <div className="admin-info">
                <p><strong>Export CSV:</strong> Open in Excel/Google Sheets for analysis</p>
                <p><strong>Backup JSON:</strong> Technical backup for data migration</p>
                <p><strong>Data Persistence:</strong> Stored in browser, survives page refreshes</p>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default App;