import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const CustomizationForm = ({ isWebsiteSaree = false }) => {
  const navigate = useNavigate();
  const { type } = useParams();
  
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
      maxWidth: '800px',
      margin: '0 auto',
      padding: '40px 20px',
    },
    header: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: '30px',
    },
    backButton: {
      background: 'none',
      border: 'none',
      fontSize: '24px',
      cursor: 'pointer',
      marginRight: '20px',
    },
    title: {
      fontSize: '2rem',
      color: '#FF1493',
      marginBottom: '30px',
    },
    section: {
      backgroundColor: 'white',
      padding: '30px',
      borderRadius: '15px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      marginBottom: '30px',
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
        // Show success message
        alert('Your customization request has been submitted successfully! You will receive an email with tailor details shortly.');
        
        // Reset form
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

        // Reset file input
        const fileInput = document.querySelector('input[type="file"]');
        if (fileInput) {
          fileInput.value = '';
        }

        // Redirect to home page after a short delay
        setTimeout(() => {
          window.location.href = '/';
        }, 2000);
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

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button onClick={() => navigate(-1)} style={styles.backButton}>
          ←
        </button>
        <h1 style={styles.title}>{getTitleByType()} Customization Form</h1>
      </div>

      <form onSubmit={handleSubmit}>
        {renderCommonFields()}
        {renderMeasurements()}

        <div style={styles.formGroup}>
          <label style={styles.checkbox}>
            <input
              type="checkbox"
              checked={formData.termsAccepted}
              onChange={(e) => setFormData({ ...formData, termsAccepted: e.target.checked })}
              required
            />
            I agree to the customization policies and understand that alterations cannot be undone.
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
      </form>
    </div>
  );
};

export default CustomizationForm; 