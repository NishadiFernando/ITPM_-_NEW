const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    },
    tls: {
        rejectUnauthorized: false
    }
});

const sendCustomizationRequestEmail = async (requestData, tailor) => {
    try {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: tailor.email,
            subject: 'New Customization Request',
            html: `
                <h2>New Customization Request</h2>
                <p><strong>Customer Name:</strong> ${requestData.name}</p>
                <p><strong>Product Type:</strong> ${requestData.productType}</p>
                <p><strong>Material:</strong> ${requestData.material}</p>
                <p><strong>Color Description:</strong> ${requestData.colorDescription}</p>
                <p><strong>Special Notes:</strong> ${requestData.specialNotes || 'None'}</p>
            `
        };

        await transporter.sendMail(mailOptions);
        return true;
    } catch (error) {
        console.error('Email sending failed:', error);
        return false;
    }
};

const sendTailorDetailsToCustomer = async (customerEmail, customerName, tailor) => {
    try {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: customerEmail,
            subject: 'Your Assigned Tailor Details',
            html: `
                <h2>Hello ${customerName},</h2>
                <p>Your request has been assigned to:</p>
                <h3>${tailor.name}</h3>
                <p><strong>Specialization:</strong> ${tailor.specialization.join(', ')}</p>
                <p><strong>Contact:</strong> ${tailor.phone}</p>
                <p><strong>Email:</strong> ${tailor.email}</p>
            `
        };

        await transporter.sendMail(mailOptions);
        return true;
    } catch (error) {
        console.error('Error sending tailor details email:', error);
        return false;
    }
};

const sendOrderConfirmation = async (customerEmail, customerName, tailor, orderDetails) => {
    try {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: customerEmail,
            subject: 'Customization Request Confirmation',
            html: `
                <h2>Thank you for your customization request, ${customerName}!</h2>
                <h3>Order Details:</h3>
                <p><strong>Order ID:</strong> ${orderDetails.orderId}</p>
                <p><strong>Product Type:</strong> ${orderDetails.productType}</p>
                <p><strong>Material:</strong> ${orderDetails.material}</p>
                <p><strong>Status:</strong> ${orderDetails.status}</p>
                <h3>Assigned Tailor:</h3>
                <p><strong>Name:</strong> ${tailor.name}</p>
                <p><strong>Contact:</strong> ${tailor.phone}</p>
                <p><strong>Email:</strong> ${tailor.email}</p>
            `
        };

        await transporter.sendMail(mailOptions);
        return true;
    } catch (error) {
        console.error('Error sending order confirmation email:', error);
        return false;
    }
};

// Verify transporter configuration
transporter.verify(function(error, success) {
    if (error) {
        console.error('SMTP configuration error:', error);
    } else {
        console.log('Email server is ready to send messages');
    }
});

module.exports = {
    sendCustomizationRequestEmail,
    sendTailorDetailsToCustomer,
    sendOrderConfirmation
};