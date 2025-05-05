import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import CustomNavbar from '../Navbar';

const CustomizationForm = ({ isWebsiteSaree = false }) => {
  const navigate = useNavigate();
  const { type } = useParams();
  
  const [step, setStep] = useState(1); // Add this for form steps
  const [showSuccess, setShowSuccess] = useState(false); // Add a new state for success message

  // Measurement fields definition
  const measurementFields = {
    lehenga: [
      { name: 'waistCircumference', label: 'Waist Circumference (inches)', description: 'Around the natural waist' },
      { name: 'hipCircumference', label: 'Hip Circumference (inches)', description: 'Around the fullest part of hips' },
      { name: 'skirtLength', label: 'Skirt Length (inches)', description: 'From waist to desired length' },
      { name: 'flare', label: 'Flare (Ghera) Circumference (inches)', description: 'The bottom circumference of the skirt' }
    ],
    'website-lehenga': [
      { name: 'waistCircumference', label: 'Waist Circumference (inches)', description: 'Around the natural waist' },
      { name: 'hipCircumference', label: 'Hip Circumference (inches)', description: 'Around the fullest part of hips' },
      { name: 'skirtLength', label: 'Skirt Length (inches)', description: 'From waist to desired length' },
      { name: 'flare', label: 'Flare (Ghera) Circumference (inches)', description: 'The bottom circumference of the skirt' }
    ],
    bags: [
      { name: 'width', label: 'Width (inches)', description: 'Side to side measurement' },
      { name: 'height', label: 'Height (inches)', description: 'Top to bottom measurement' },
      { name: 'depth', label: 'Depth (inches)', description: 'Thickness of the bag' },
      { name: 'strapLength', label: 'Strap Length (inches)', description: 'Length of handle or strap' }
    ],
    kitchen: [
      { name: 'apronLength', label: 'Apron Length (inches)', description: 'Neck to knee/desired length' },
      { name: 'waistCircumference', label: 'Waist Circumference (inches)', description: 'Around the waist' },
      { name: 'neckStrapLength', label: 'Neck Strap Length (inches)', description: 'Around the neck for proper fitting' },
      { name: 'waistTieLength', label: 'Waist Tie Length (inches)', description: 'Length of ties for tying at the back' }
    ],
    frock: [
      { name: 'bustCircumference', label: 'Bust Circumference (inches)', description: 'Around the fullest part of the bust' },
      { name: 'waistCircumference', label: 'Waist Circumference (inches)', description: 'Around the narrowest part of the waist' },
      { name: 'hipCircumference', label: 'Hip Circumference (inches)', description: 'Around the widest part of the hips' },
      { name: 'shoulderWidth', label: 'Shoulder Width (inches)', description: 'Shoulder to shoulder measurement' }
    ],
    'home-decor': [
      { name: 'cushionWidth', label: 'Width (inches)', description: 'Measure from edge to edge' },
      { name: 'cushionHeight', label: 'Height (inches)', description: 'Measure from edge to edge' },
      { name: 'thickness', label: 'Thickness (inches)', description: 'If making a cushion with padding' },
      { name: 'zipperSize', label: 'Zipper Size (inches)', description: 'If adding an opening' }
    ],
    bedding: [
      { name: 'bedWidth', label: 'Bed Width (inches)', description: 'Measure mattress width' },
      { name: 'bedLength', label: 'Bed Length (inches)', description: 'Measure mattress length' },
      { name: 'dropLength', label: 'Drop Length (inches)', description: 'Extra fabric for tucking or hanging over the sides' }
    ]
  };
  
  // Extract the type from the URL path
  const getFormType = () => {
    const path = window.location.pathname;
    const pathParts = path.split('/');
    const lastPart = pathParts[pathParts.length - 1];
    
    // Handle special cases
    if (lastPart === 'website-lehenga') {
      return 'lehenga';
    }
    return lastPart;
  };

  const formType = getFormType();
  const isWebsiteItem = isWebsiteSaree || formType === 'website-lehenga';

  const [formData, setFormData] = useState({
    // Common fields
    name: '',
    email: '',
    phone: '',
    address: '',
    images: null,
    material: '',
    colorDescription: '',
    tailor: '',
    specialNotes: '',
    termsAccepted: false,
    sareeId: '',
    isWebsiteSaree: isWebsiteItem,

    // All possible measurements fields
    // Lehenga
    waistCircumference: '',
    hipCircumference: '',
    skirtLength: '',
    flare: '',

    // Bag
    width: '',
    height: '',
    depth: '',
    strapLength: '',

    // Kitchen Linen
    apronLength: '',
    neckStrapLength: '',
    waistTieLength: '',

    // Frock
    bustCircumference: '',
    shoulderWidth: '',

    // Cushions
    cushionWidth: '',
    cushionHeight: '',
    thickness: '',
    zipperSize: '',

    // Bedsheets
    bedWidth: '',
    bedLength: '',
    dropLength: '',
  });

  const [tailors, setTailors] = useState([]);

  useEffect(() => {
    fetchTailors();
  }, []);

  const fetchTailors = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/tailors/active');
      setTailors(response.data);
    } catch (error) {
      console.error('Error fetching tailors:', error);
    }
  };

  const styles = {
    container: {
      width: '100%', // Changed from maxWidth to width
      margin: '0 auto',
      padding: '40px 20px',
      background: 'linear-gradient(135deg, #2C3E50 0%, #3498db 100%)',
      minHeight: '100vh',
    },
    section: {
      backgroundColor: '#f0f0f0', // Updated to light gray
      padding: '30px',
      borderRadius: '15px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      marginBottom: '30px',
      width: '100%', // Added to ensure full width
    },
    formWrapper: {
      maxWidth: '1000px', // Added to contain form width
      margin: '0 auto',
    },
    header: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: '30px',
    },
    backButton: {
      display: 'flex',
      alignItems: 'center',
      textDecoration: 'none',
      color: '#ffffff',
      fontSize: '16px',
      padding: '12px 24px',
      borderRadius: '8px',
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      border: '1px solid rgba(255, 255, 255, 0.3)',
      transition: 'all 0.3s ease',
      cursor: 'pointer',
    },
    backButtonText: {
      marginLeft: '8px',
      fontWeight: '500',
    },
    title: {
      color: '#ffffff', // Changed to white
      fontSize: '2.2rem',
      marginBottom: '30px',
      fontFamily: "'Poppins', sans-serif",
      fontWeight: '600',
      marginLeft: '20px', // Added spacing between back button and title
    },
    sectionTitle: {
      fontSize: '1.5rem',
      color: '#333',
      marginBottom: '20px',
    },
    formGroup: {
      marginBottom: '20px',
    },
    label: {
      display: 'block',
      marginBottom: '8px',
      fontWeight: 'bold',
      color: '#333',
    },
    input: {
      width: '100%',
      padding: '10px',
      borderRadius: '5px',
      border: '1px solid #ddd',
      fontSize: '16px',
    },
    textArea: {
      width: '100%',
      padding: '10px',
      borderRadius: '5px',
      border: '1px solid #ddd',
      fontSize: '16px',
      minHeight: '100px',
    },
    submitButton: {
      backgroundColor: '#FF1493',
      color: 'white',
      padding: '12px 30px',
      border: 'none',
      borderRadius: '5px',
      fontSize: '18px',
      cursor: 'pointer',
      transition: 'background-color 0.3s',
    },
    checkbox: {
      marginRight: '10px',
    },
    stepIndicator: {
      display: 'flex',
      justifyContent: 'center',
      marginBottom: '30px',
    },
    step: {
      width: '30px',
      height: '30px',
      borderRadius: '50%',
      backgroundColor: '#ddd',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '0 10px',
      color: '#333',
    },
    activeStep: {
      backgroundColor: '#FF1493',
      color: 'white',
    },
    nextButton: {
      backgroundColor: '#1565C0',
      color: 'white',
      padding: '12px 30px',
      border: 'none',
      borderRadius: '5px',
      fontSize: '18px',
      cursor: 'pointer',
      transition: 'background-color 0.3s',
      marginTop: '20px',
    },
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const formDataToSend = new FormData();
      
      // Append all text fields
      formDataToSend.append('name', formData.name);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('phone', formData.phone);
      formDataToSend.append('address', formData.address);
      formDataToSend.append('productType', formType);
      formDataToSend.append('material', formData.material);
      formDataToSend.append('colorDescription', formData.colorDescription);
      formDataToSend.append('measurements', JSON.stringify(getMeasurementData()));
      formDataToSend.append('specialNotes', formData.specialNotes);
      formDataToSend.append('tailor', formData.tailor);
      formDataToSend.append('isWebsiteItem', isWebsiteSaree || formType === 'website-lehenga');
      formDataToSend.append('itemId', formData.sareeId);
      formDataToSend.append('status', 'pending');

      // Append images
      if (formData.images) {
        for (let i = 0; i < formData.images.length; i++) {
          formDataToSend.append('images', formData.images[i]);
        }
      }

      console.log('Submitting request...'); // Debug log

      const response = await axios.post(
        'http://localhost:5000/api/customization-requests',
        formDataToSend,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      
      if (response.status === 201) {
        setShowSuccess(true); // Show success interface instead of alert
        setFormData({
          name: '',
          email: '',
          phone: '',
          address: '',
          images: null,
          material: '',
          colorDescription: '',
          tailor: '',
          specialNotes: '',
          termsAccepted: false,
          sareeId: '',
          isWebsiteSaree: isWebsiteItem,
          // Reset all measurement fields
          waistCircumference: '',
          hipCircumference: '',
          skirtLength: '',
          flare: '',
          width: '',
          height: '',
          depth: '',
          strapLength: '',
          apronLength: '',
          neckStrapLength: '',
          waistTieLength: '',
          bustCircumference: '',
          shoulderWidth: '',
          cushionWidth: '',
          cushionHeight: '',
          thickness: '',
          zipperSize: '',
          bedWidth: '',
          bedLength: '',
          dropLength: '',
        });
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Failed to submit customization request. Please try again.');
    }
  };

  const getMeasurementData = () => {
    const measurements = {};
    const fields = measurementFields[formType] || [];
    
    fields.forEach(field => {
      if (formData[field.name]) {
        measurements[field.label] = formData[field.name];
      }
    });

    return measurements;
  };

  const handleTailorSelect = (e) => {
    const selectedTailorId = e.target.value;
    setFormData({ ...formData, tailor: selectedTailorId });
  };

  const handleNext = () => {
    // Validate first step
    if (!formData.name || !formData.email || !formData.phone || !formData.address 
        || !formData.tailor || !formData.material || !formData.colorDescription) {
      alert('Please fill all required fields');
      return;
    }
    setStep(2);
  };

  const handleBack = () => {
    setStep(1);
  };

  const renderCommonFields = () => (
    <div style={styles.section}>
      <h2 style={styles.sectionTitle}>Customer Information</h2>
      
      <div style={styles.formGroup}>
        <label style={styles.label}>Name *</label>
        <input
          type="text"
          style={styles.input}
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>Email Address *</label>
        <input
          type="email"
          style={styles.input}
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>Phone Number *</label>
        <input
          type="tel"
          style={styles.input}
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          required
        />
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>Delivery Address *</label>
        <textarea
          style={styles.textArea}
          value={formData.address}
          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          required
        />
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>Select Tailor *</label>
        <select
          style={styles.input}
          value={formData.tailor}
          onChange={handleTailorSelect}
          required
        >
          <option value="">Select a Tailor</option>
          {tailors.map((tailor) => (
            <option key={tailor._id} value={tailor._id}>
              {tailor.name} - {tailor.specialization.join(', ')}
            </option>
          ))}
        </select>
      </div>

      <div style={styles.formGroup}>
        <label style={styles.checkbox}>
          <input
            type="checkbox"
            checked={formData.isWebsiteSaree}
            onChange={(e) => setFormData({ ...formData, isWebsiteSaree: e.target.checked })}
          />
          This is a saree from your website
        </label>
      </div>

      {isWebsiteItem && (
        <div style={styles.formGroup}>
          <label style={styles.label}>Item ID *</label>
          <input
            type="text"
            style={styles.input}
            value={formData.sareeId}
            onChange={(e) => setFormData({ ...formData, sareeId: e.target.value })}
            required
            placeholder={formType === 'website-lehenga' ? "Enter Lehenga ID" : "Enter Saree ID"}
          />
        </div>
      )}

      <div style={styles.formGroup}>
        <label style={styles.label}>Upload Images (Front & Back) *</label>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => setFormData({ ...formData, images: e.target.files })}
          required
        />
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>Material *</label>
        <select
          style={styles.input}
          value={formData.material}
          onChange={(e) => setFormData({ ...formData, material: e.target.value })}
          required
        >
          <option value="">Select Material</option>
          <option value="Silk">Silk</option>
          <option value="Cotton">Cotton</option>
          <option value="Georgette">Georgette</option>
          <option value="Chiffon">Chiffon</option>
          <option value="Crepe">Crepe</option>
          <option value="Linen">Linen</option>
          <option value="Wool">Wool</option>
          <option value="Polyester">Polyester</option>
          <option value="Canvas">Canvas</option>
          <option value="Denim">Denim</option>
          <option value="Other">Other</option>
        </select>
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>Color & Pattern Description *</label>
        <textarea
          style={styles.textArea}
          value={formData.colorDescription}
          onChange={(e) => setFormData({ ...formData, colorDescription: e.target.value })}
          required
          placeholder="Please describe the colors and patterns you want in detail..."
        />
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>Special Instructions or Notes</label>
        <textarea
          style={styles.textArea}
          value={formData.specialNotes}
          onChange={(e) => setFormData({ ...formData, specialNotes: e.target.value })}
          placeholder="Any special requirements, damages to fix, or additional notes..."
        />
      </div>
    </div>
  );

  const renderMeasurements = () => {
    // If it's a website-lehenga, use lehenga measurements
    const effectiveType = formType === 'website-lehenga' ? 'lehenga' : formType;
    const fields = measurementFields[effectiveType] || [];
    
    console.log('Form Type:', formType); // Debug log
    console.log('Effective Type:', effectiveType); // Debug log
    console.log('Available Fields:', fields); // Debug log

    return (
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Measurements</h2>
        {fields.map((field) => (
          <div key={field.name} style={styles.formGroup}>
            <label style={styles.label}>
              {field.label} *
              <small style={{ display: 'block', color: '#666', fontSize: '0.9em' }}>
                {field.description}
              </small>
            </label>
            <input
              type="number"
              style={styles.input}
              value={formData[field.name]}
              onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
              required
              step="0.1"
            />
          </div>
        ))}
      </div>
    );
  };

  const getTitleByType = () => {
    const titles = {
      lehenga: 'Lehenga',
      'website-lehenga': 'Website Lehenga',
      bags: 'Bag',
      kitchen: 'Kitchen Linen',
      frock: 'Frock',
      'home-decor': 'Home Decor',
      bedding: 'Bedsheet'
    };
    return titles[formType] || 'Item';
  };

  const SuccessMessage = () => (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '40px',
        borderRadius: '15px',
        textAlign: 'center',
        maxWidth: '500px',
        width: '90%'
      }}>
        <div style={{ fontSize: '60px', marginBottom: '20px' }}>✅</div>
        <h2 style={{ 
          color: '#2C3E50',
          marginBottom: '20px',
          fontSize: '24px'
        }}>
          Customization Request Submitted Successfully!
        </h2>
        <p style={{
          color: '#666',
          marginBottom: '30px'
        }}>
          Our team will review your request and contact you shortly.
        </p>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '15px'
        }}>
          <button
            onClick={() => navigate('/sareehome')}
            style={{
              padding: '12px 24px',
              backgroundColor: '#1565C0',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '16px',
              transition: 'background-color 0.3s'
            }}
            onMouseEnter={e => e.target.style.backgroundColor = '#0D47A1'}
            onMouseLeave={e => e.target.style.backgroundColor = '#1565C0'}
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <CustomNavbar />
      <div style={styles.container}>
        {showSuccess ? (
          <SuccessMessage />
        ) : (
          <div style={styles.formWrapper}>
            <div style={styles.header}>
              <button 
                onClick={() => navigate(-1)} 
                style={styles.backButton}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.3)'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)'}
              >
                <span>←</span>
                <span style={styles.backButtonText}>Back</span>
              </button>
              <h1 style={styles.title}>{getTitleByType()} Customization Form</h1>
            </div>

            <div style={styles.stepIndicator}>
              <div style={{...styles.step, ...(step === 1 ? styles.activeStep : {})}}>1</div>
              <div style={{...styles.step, ...(step === 2 ? styles.activeStep : {})}}>2</div>
            </div>

            <form onSubmit={handleSubmit}>
              {step === 1 ? (
                <div>
                  {renderCommonFields()}
                  <button 
                    type="button" 
                    style={styles.nextButton}
                    onClick={handleNext}
                  >
                    Next
                  </button>
                </div>
              ) : (
                <div>
                  {renderMeasurements()}
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
                    <button 
                      type="button" 
                      style={{...styles.nextButton, backgroundColor: '#666'}}
                      onClick={handleBack}
                    >
                      Back
                    </button>
                    <div style={styles.formGroup}>
                      <label style={styles.checkbox}>
                        <input
                          type="checkbox"
                          checked={formData.termsAccepted}
                          onChange={(e) => setFormData({ ...formData, termsAccepted: e.target.checked })}
                          required
                        />
                        I agree to the customization policies
                      </label>
                    </div>
                    <button 
                      type="submit" 
                      style={styles.submitButton}
                      onMouseEnter={(e) => e.target.style.backgroundColor = '#FF1493DD'}
                      onMouseLeave={(e) => e.target.style.backgroundColor = '#FF1493'}
                    >
                      Submit
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>
        )}
      </div>
    </>
  );
};

export default CustomizationForm;