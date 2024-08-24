const { google } = require('googleapis');
const nodemailer = require('nodemailer');
const fs = require('fs');

// Load your service account key
const serviceAccountKey = JSON.parse(fs.readFileSync("mail.json"));

// Impersonate the user email
const userEmail = 'operation@socketspace.com';

// Define the email details
export async function sendEmail(to,subject,text) {
  // Initialize the JWT client
  const auth = new google.auth.JWT({
    email: serviceAccountKey.client_email,
    key: serviceAccountKey.private_key,
    scopes: ['https://www.googleapis.com/auth/gmail.send','https://mail.google.com/'],
    subject: userEmail, // User to impersonate
  });

  // Get access token
  const creds = await auth.authorize();


  // Create a transporter object using nodemailer
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      type: 'OAuth2',
      user: userEmail,
      clientId: serviceAccountKey.client_id,
      clientSecret: serviceAccountKey.client_secret,
      refreshToken: '',
      accessToken: creds.access_token,
    },
  });

  // Set up email data
  const mailOptions = {
    from: `"SocketSpace Operation Team" <operation@socketspace.com>`,
    to: to,
    subject: subject,
    text: `${text}
    
    Operation Team

    linkedin icon instagram icon
    Logo	t:
    m:
    e:
    a:	+62812-2010-0516
    +62812-2010-0516
    operation@socketspace.com
    SocketSpace, BITC Tower, Jl. HMS Mintareja Sarjana Hukum, Baros, Kec. Cimahi Tengah, Kota Cimahi, Jawa Barat 40521, Cimahi City, 40526
    www.socketspace.com
    `,
    replyTo: "operation@socketspace.com",
  };

  // Send the email
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ' + info.response);
  } catch (error) {
    console.error('Error sending email:', error);
  }
}