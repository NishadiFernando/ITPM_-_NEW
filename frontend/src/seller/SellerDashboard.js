import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './SellerDashboard.css';

function SellerDashboard() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/submissions');
      if (!response.ok) {
        throw new Error('Failed to fetch submissions');
      }
      const data = await response.json();
      setSubmissions(data);
        setError(null);
    } catch (err) {
        setError('Failed to fetch your saree listings. Please try again later.');
      console.error('Error fetching submissions:', err);
    } finally {
        setLoading(false);
    }
  };

  const handleUpdate = (submission) => {
    navigate('/', { 
      state: { 
        isUpdate: true,
        submission: submission
      }
      });
  };

  const handleDelete = async (submissionId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/submissions/${submissionId}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Failed to delete submission');
      }

      // Remove the deleted submission from the state
      setSubmissions(prev => prev.filter(sub => sub._id !== submissionId));
      setShowDeleteModal(false);
      setSelectedSubmission(null);
    } catch (err) {
      console.error('Error deleting submission:', err);
      setError('Failed to delete submission. Please try again.');
    }
  };

  const openDeleteModal = (submission) => {
    setSelectedSubmission(submission);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setSelectedSubmission(null);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Approved':
        return 'status-approved';
      case 'Rejected':
        return 'status-rejected';
      default:
        return 'status-pending';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="seller-dashboard">
      <div className="sidebar">
        <h1 className="logo">Punarvasthra</h1>
        <nav>
          <Link to="/" className="nav-link">Submit New Saree</Link>
          <Link to="/seller-dashboard" className="nav-link active">My Submissions</Link>
        </nav>
        <Link to="/" className="logout-link">Logout</Link>
      </div>

      <div className="main-content">
      <h1>Seller Dashboard</h1>
        
        {location.state?.message && (
          <div className="success-message">
            {location.state.message}
          </div>
        )}

        <div className="dashboard-section">
      <h2>Your Saree Listings</h2>

      {loading ? (
        <div className="loading-spinner">Loading...</div>
      ) : error ? (
            <div className="error-message">{error}</div>
          ) : submissions.length === 0 ? (
            <div className="no-submissions">
              <p>You haven't submitted any sarees yet.</p>
              <Link to="/" className="submit-new-btn">Submit Your First Saree</Link>
            </div>
          ) : (
            <div className="submissions-grid">
              {submissions.map((submission) => (
                <div key={submission._id} className="submission-card">
                  <div className="submission-image">
                    {submission.sareeImage ? (
                      <img 
                        src={`http://localhost:5000${submission.sareeImage}`}
                        alt="Saree"
                      />
                    ) : (
                      <div className="no-image">No Image Available</div>
                    )}
                  </div>
                  <div className="submission-details">
                    <div className="submission-header">
                      <h3>{submission.materialType}</h3>
                      <span className={`status-badge ${getStatusColor(submission.status)}`}>
                        {submission.status}
                      </span>
                    </div>
                    <div className="submission-info">
                      <p><strong>Condition:</strong> {submission.sareeCondition}</p>
                      <p><strong>Quantity:</strong> {submission.numberOfSaree}</p>
                      <p><strong>Appointment:</strong> {formatDate(submission.preferredDate)} at {submission.preferredTime}</p>
                      <p><strong>Branch:</strong> {submission.preferredBranch}</p>
                      <p><strong>Submitted:</strong> {formatDate(submission.submissionDate)}</p>
                    </div>
                    <div className="submission-actions">
                    <button
                        className="action-btn update-btn"
                        onClick={() => handleUpdate(submission)}
                        disabled={submission.status !== 'Pending'}
                    >
                      Update
                    </button>
                    <button
                        className="action-btn delete-btn"
                        onClick={() => openDeleteModal(submission)}
                        disabled={submission.status !== 'Pending'}
                    >
                      Delete
                    </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedSubmission && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Confirm Delete</h2>
              <button className="close-btn" onClick={closeDeleteModal}>×</button>
              </div>
            <div className="modal-body">
              <p>Are you sure you want to delete this submission?</p>
              <p>This action cannot be undone.</p>
              <div className="modal-actions">
                <button 
                  className="action-btn delete-btn"
                  onClick={() => handleDelete(selectedSubmission._id)}
                >
                  Delete
                </button>
                <button
                  className="action-btn cancel-btn"
                  onClick={closeDeleteModal}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SellerDashboard;