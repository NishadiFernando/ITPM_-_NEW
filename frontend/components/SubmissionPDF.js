import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 30,
  },
  header: {
    marginBottom: 20,
    borderBottom: 1,
    borderBottomColor: '#4F032A',
    paddingBottom: 10,
  },
  title: {
    fontSize: 24,
    color: '#4F032A',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  logo: {
    fontSize: 18,
    color: '#D4AF37',
    marginBottom: 5,
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
  submissionDetails: {
    marginBottom: 15,
  },
  label: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 3,
  },
  value: {
    fontSize: 14,
    marginBottom: 8,
  },
  status: {
    fontSize: 14,
    padding: '4 8',
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  image: {
    width: 200,
    height: 200,
    marginVertical: 10,
    alignSelf: 'center',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: 'center',
    color: '#666666',
    borderTop: 1,
    borderTopColor: '#4F032A',
    paddingTop: 10,
  },
});

// Create Document Component
const SubmissionPDF = ({ submission }) => {
  const getStatusStyle = (status) => {
    const baseStyle = { ...styles.status };
    switch (status) {
      case 'Pending':
        baseStyle.backgroundColor = '#fff3cd';
        baseStyle.color = '#856404';
        break;
      case 'Approved':
        baseStyle.backgroundColor = '#d4edda';
        baseStyle.color = '#155724';
        break;
      case 'Rejected':
        baseStyle.backgroundColor = '#f8d7da';
        baseStyle.color = '#721c24';
        break;
      default:
        break;
    }
    return baseStyle;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.logo}>Punarvasthra</Text>
          <Text style={styles.title}>Submission Details</Text>
        </View>

        {/* Main Content */}
        <View style={styles.section}>
          <View style={styles.submissionDetails}>
            <Text style={styles.label}>Submission ID</Text>
            <Text style={styles.value}>{submission._id}</Text>

            <Text style={styles.label}>Status</Text>
            <Text style={getStatusStyle(submission.status)}>{submission.status}</Text>

            <Text style={styles.label}>Saree Type</Text>
            <Text style={styles.value}>{submission.materialType}</Text>

            <Text style={styles.label}>Seller Information</Text>
            <Text style={styles.value}>Name: {submission.fullName}</Text>
            <Text style={styles.value}>Contact: {submission.contact}</Text>
            <Text style={styles.value}>Email: {submission.email}</Text>

            <Text style={styles.label}>Submission Date</Text>
            <Text style={styles.value}>{formatDate(submission.createdAt)}</Text>

            <Text style={styles.label}>Additional Details</Text>
            <Text style={styles.value}>Condition: {submission.condition}</Text>
            <Text style={styles.value}>Quantity: {submission.quantity}</Text>
            <Text style={styles.value}>Price Range: {submission.priceRange}</Text>
          </View>

          {submission.imageUrl && (
            <>
              <Text style={styles.label}>Saree Image</Text>
              <Image style={styles.image} src={`http://localhost:5000${submission.imageUrl}`} />
            </>
          )}
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text>Generated on {new Date().toLocaleDateString()}</Text>
          <Text>Punarvasthra - Saree Reselling Platform</Text>
        </View>
      </Page>
    </Document>
  );
};

export default SubmissionPDF; 