import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './SellerForm.css';

function SellerForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    contactNumber: '',
    email: '',
    address: '',
    numberOfSaree: '',
    sareeCondition: '',
    materialType: '',
    sareeImage: null,
    preferredDate: '',
    preferredTime: '',
    preferredBranch: '',
    termsAccepted: false,
    policyAccepted: false
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    
    // Full Name validation
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full Name is required';
    }

    // Contact Number validation
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(formData.contactNumber)) {
      newErrors.contactNumber = 'Please enter a valid 10-digit contact number';
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Address validation
    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }

    // Required field validations
    if (!formData.numberOfSaree) {
      newErrors.numberOfSaree = 'Please select number of sarees';
    }
    if (!formData.sareeCondition) {
      newErrors.sareeCondition = 'Please select saree condition';
    }
    if (!formData.materialType) {
      newErrors.materialType = 'Please select material type';
    }
    if (!formData.preferredDate) {
      newErrors.preferredDate = 'Please select preferred date';
    }
    if (!formData.preferredTime) {
      newErrors.preferredTime = 'Please select preferred time';
    }
    if (!formData.preferredBranch) {
      newErrors.preferredBranch = 'Please enter preferred branch';
    }
    if (!formData.termsAccepted) {
      newErrors.termsAccepted = 'You must accept the terms and conditions';
    }
    if (!formData.policyAccepted) {
      newErrors.policyAccepted = 'You must accept the company policies';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setSubmitting(true);
      try {
        // Create FormData object to handle file upload
        const submissionData = new FormData();
        
        // Append all form fields to FormData
        Object.keys(formData).forEach(key => {
          if (key === 'sareeImage') {
            if (formData[key]) {
              submissionData.append(key, formData[key]);
            }
          } else {
            submissionData.append(key, formData[key]);
          }
        });

        // Add submission date and initial status
        submissionData.append('submissionDate', new Date().toISOString());
        submissionData.append('status', 'Pending');

        // Send data to backend
        const response = await fetch('http://localhost:5000/api/submissions', {
          method: 'POST',
          body: submissionData,
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || 'Failed to submit form');
        }

        console.log('Form submitted successfully:', result);
        
        // Navigate to seller dashboard with success message
        navigate('/seller-dashboard', { 
          state: { 
            submissionId: result.submissionId,
            message: 'Form submitted successfully! Your submission is pending approval.' 
          }
        });
      } catch (error) {
        console.error('Error submitting form:', error);
        setErrors(prev => ({
          ...prev,
          submit: error.message || 'Failed to submit form. Please try again.'
        }));
      } finally {
        setSubmitting(false);
      }
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'file' ? files[0] : value
    }));
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="seller-form-container">
      <div className="sidebar">
        <h1 className="logo">Punarvasthra</h1>
        <nav>
          <Link to="/add-details" className="nav-link">Add details</Link>
          <Link to="/admin" className="nav-link">Admin</Link>
        </nav>
        <Link to="/" className="logout-link">Logout</Link>
      </div>

      <div className="form-content">
        <h1>Appointment Form Details for Sellers</h1>
        
        {errors.submit && (
          <div className="error-message global">{errors.submit}</div>
        )}
        
        <form onSubmit={handleSubmit} className="appointment-form">
          {/* Seller Information */}
          <div className="form-section">
            <h2>Seller Information</h2>
            <div className="form-group">
              <label>Full Name:</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
              />
              {errors.fullName && <span className="error">{errors.fullName}</span>}
            </div>

            <div className="form-group">
              <label>Contact Number:</label>
              <input
                type="tel"
                name="contactNumber"
                value={formData.contactNumber}
                onChange={handleChange}
              />
              {errors.contactNumber && <span className="error">{errors.contactNumber}</span>}
            </div>

            <div className="form-group">
              <label>Email:</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
              {errors.email && <span className="error">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label>Address:</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
              />
              {errors.address && <span className="error">{errors.address}</span>}
            </div>
          </div>

          {/* Seller Details */}
          <div className="form-section">
            <h2>Seller Details</h2>
            <div className="form-group">
              <label>Number of saree:</label>
              <select
                name="numberOfSaree"
                value={formData.numberOfSaree}
                onChange={handleChange}
              >
                <option value="">Select number of sarees</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
              </select>
              {errors.numberOfSaree && <span className="error">{errors.numberOfSaree}</span>}
            </div>

            <div className="form-group">
              <label>Saree Condition:</label>
              <select
                name="sareeCondition"
                value={formData.sareeCondition}
                onChange={handleChange}
              >
                <option value="">Select condition</option>
                <option value="New">New</option>
                <option value="Gently Used">Gently Used</option>
                <option value="Needs Repair">Needs Repair</option>
              </select>
              {errors.sareeCondition && <span className="error">{errors.sareeCondition}</span>}
            </div>

            <div className="form-group">
              <label>Material Type:</label>
              <select
                name="materialType"
                value={formData.materialType}
                onChange={handleChange}
              >
                <option value="">Select material type</option>
                <option value="Cotton saree">Cotton saree</option>
                <option value="Silk saree">Silk saree</option>
                <option value="Linen saree">Linen saree</option>
                <option value="Georgette saree">Georgette saree</option>
                <option value="Chiffon saree">Chiffon saree</option>
                <option value="Net saree">Net saree</option>
                <option value="Banaras saree">Banaras saree</option>
                <option value="Kanchipuram saree">Kanchipuram saree</option>
                <option value="Batik saree">Batik saree</option>
              </select>
              {errors.materialType && <span className="error">{errors.materialType}</span>}
            </div>

            <div className="form-group">
              <label>Photo of saree:</label>
              <input
                type="file"
                name="sareeImage"
                accept="image/*"
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Appointment Details */}
          <div className="form-section">
            <h2>Appointment Details</h2>
            <div className="form-group">
              <label>Preferred Date for Appointment:</label>
              <input
                type="date"
                name="preferredDate"
                min={today}
                value={formData.preferredDate}
                onChange={handleChange}
              />
              {errors.preferredDate && <span className="error">{errors.preferredDate}</span>}
            </div>

            <div className="form-group">
              <label>Preferred Time for Appointment:</label>
              <input
                type="time"
                name="preferredTime"
                value={formData.preferredTime}
                onChange={handleChange}
              />
              {errors.preferredTime && <span className="error">{errors.preferredTime}</span>}
            </div>

            <div className="form-group">
              <label>Preferred Branch:</label>
              <input
                type="text"
                name="preferredBranch"
                value={formData.preferredBranch}
                onChange={handleChange}
              />
              {errors.preferredBranch && <span className="error">{errors.preferredBranch}</span>}
            </div>
          </div>

          {/* Terms & Conditions */}
          <div className="form-section">
            <h2>Terms & Conditions</h2>
            <div className="terms-box">
              <ol>
                <li>Ensure all sarees are clean and in the condition stated</li>
                <li>Appointments must be attended on time</li>
                <li>Payment will be processed after inspection</li>
                <li>No refunds for rejected sarees</li>
                <li>Provide accurate contact details for communication</li>
              </ol>
            </div>
            <div className="checkbox-group">
              <input
                type="checkbox"
                name="termsAccepted"
                checked={formData.termsAccepted}
                onChange={handleChange}
                id="terms"
              />
              <label htmlFor="terms">I accept</label>
              {errors.termsAccepted && <span className="error">{errors.termsAccepted}</span>}
            </div>
          </div>

          {/* Agreement to Company Policies */}
          <div className="form-section">
            <h2>Agreement to Company Policies</h2>
            <div className="terms-box">
              <ol>
                <li>Follow the company's pricing guidelines</li>
                <li>Respect the inspection process</li>
                <li>Maintain confidentiality of transactions</li>
                <li>Adhere to ethical selling practices</li>
                <li>Report any issues promptly</li>
              </ol>
            </div>
            <div className="checkbox-group">
              <input
                type="checkbox"
                name="policyAccepted"
                checked={formData.policyAccepted}
                onChange={handleChange}
                id="policy"
              />
              <label htmlFor="policy">I accept</label>
              {errors.policyAccepted && <span className="error">{errors.policyAccepted}</span>}
            </div>
          </div>

          <button 
            type="submit" 
            className="submit-button" 
            disabled={submitting}
          >
            {submitting ? 'Submitting...' : 'Submit'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default SellerForm;