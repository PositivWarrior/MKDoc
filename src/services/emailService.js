import axios from 'axios';

const SENDGRID_API_ENDPOINT = 'https://api.sendgrid.com/v3/mail/send';

export const sendEmailWithAttachment = async (to, subject, content, attachmentData) => {
  try {
    const base64File = btoa(String.fromCharCode.apply(null, new Uint8Array(attachmentData)));
    
    const emailData = {
      personalizations: [{
        to: [{ email: to }]
      }],
      from: { email: import.meta.env.VITE_SENDGRID_FROM_EMAIL },
      subject: subject,
      content: [{
        type: 'text/html',
        value: content
      }],
      attachments: [{
        content: base64File,
        filename: 'verdivurdering.pdf',
        type: 'application/pdf',
        disposition: 'attachment'
      }]
    };

    const response = await axios.post(SENDGRID_API_ENDPOINT, emailData, {
      headers: {
        'Authorization': `Bearer ${import.meta.env.VITE_SENDGRID_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    return response.data;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
} 