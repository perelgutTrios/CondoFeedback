import React, { useState } from 'react';
import emailjs from '@emailjs/browser';
import './App.css';

function App() {
  const [copyPM, setCopyPM] = useState(false);
  const [anonymous, setAnonymous] = useState(false);
  const [formData, setFormData] = useState({
    familyName: '',
    unitNumber: '',
    topic: 'No Topic',
    urgency: 'Other',
    subject: '',
    comment: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const errors = [];
    
    // Check if topic is selected (not default)
    if (formData.topic === 'No Topic') {
      errors.push('Please select a topic');
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

  const handleSubmit = async (buttonType) => {
    const validationErrors = validateForm();
    
    if (validationErrors.length > 0) {
      alert('Please fix the following issues:\n\n' + validationErrors.join('\n'));
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // EmailJS configuration (you'll need to set these up)
      const serviceID = 'service_xxxxxxxxx'; // Replace with your EmailJS service ID
      const templateID = 'template_xxxxxxxxx'; // Replace with your EmailJS template ID
      const publicKey = 'your_public_key'; // Replace with your EmailJS public key

      const templateParams = {
        to_email: 'perelgut@gmail.com',
        from_name: anonymous ? 'Anonymous' : formData.familyName,
        unit_number: anonymous ? 'Anonymous' : formData.unitNumber,
        topic: formData.topic,
        urgency: formData.urgency,
        subject: formData.subject,
        message: formData.comment,
        button_type: buttonType,
        copy_pm: copyPM ? 'Yes' : 'No',
        is_anonymous: anonymous ? 'Yes' : 'No'
      };

      // For prototype - just simulate email sending
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Uncomment this when you have EmailJS configured:
      // await emailjs.send(serviceID, templateID, templateParams, publicKey);
      
      alert(`Feedback submitted successfully!\n\nDetails:\nFamily: ${anonymous ? 'Anonymous' : formData.familyName}\nUnit: ${anonymous ? 'Anonymous' : formData.unitNumber}\nTopic: ${formData.topic}\nUrgency: ${formData.urgency}\nSubject: ${formData.subject}\nAnonymous: ${anonymous ? 'Yes' : 'No'}\n\nThis would be sent to: perelgut@gmail.com`);
      
      // Reset form
      setFormData({
        familyName: '',
        unitNumber: '',
        topic: 'No Topic',
        urgency: 'Other',
        subject: '',
        comment: ''
      });
      setCopyPM(false);
      setAnonymous(false);
      
    } catch (error) {
      console.error('Error sending email:', error);
      alert('Error sending feedback. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      familyName: '',
      unitNumber: '',
      topic: 'No Topic',
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
      <header className="header">🏢 Condo Feedback Portal</header>
      <form className="form" onSubmit={handleFormSubmit}>
        <label>
          <input
            type="checkbox"
            checked={anonymous}
            onChange={(e) => setAnonymous(e.target.checked)}
          />
          Submit Anonymously
        </label>

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

        <label>Topic *</label>
        <select 
          name="topic"
          value={formData.topic}
          onChange={handleInputChange}
        >
          <option value="No Topic">-- Select Topic --</option>
          <option>Plumbing</option>
          <option>HVAC</option>
          <option>Hallway</option>
          <option>In-Unit</option>
          <option>Lobby</option>
          <option>Garage</option>
          <option>Recreation Facilities</option>
          <option>Party Room</option>
          <option>Meeting Rooms</option>
          <option>Golf Room</option>
          <option>Fitness Room</option>
          <option>Pool and Hot Tub</option>
          <option>Pool Tables</option>
          <option>Lockers</option>
          <option>Other</option>
        </select>

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
    </div>
  );
}

export default App;