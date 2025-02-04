# LukMeg Verdivurdering

A web application for generating value assessment PDFs and sending them via email.

## Features

- Create value assessments with multiple items
- Generate PDF documents
- Send assessments via email
- View previous assessments
- Responsive design

## Tech Stack

- React
- Vite
- Tailwind CSS
- Firebase Storage
- PDF Generation with @react-pdf/renderer

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

## Environment Variables

Create a `.env` file with the following variables:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Firebase account
- EmailJS account

## Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd mkdoc
```

2. Install dependencies:
```bash
npm install
```

3. Create a Firebase project:
- Go to [Firebase Console](https://console.firebase.google.com/)
- Create a new project
- Enable Storage service
- Get your Firebase configuration

4. Set up EmailJS:
- Create an account at [EmailJS](https://www.emailjs.com/)
- Create an email service
- Create an email template
- Get your service ID, template ID, and user ID

5. Configure environment variables:
- Copy `.env.example` to `.env`
- Fill in your Firebase and EmailJS credentials

```bash
cp .env.example .env
```

## Usage

1. Fill in the form with document details:
   - Name
   - Price
   - Description
   - Email address

2. Preview the generated PDF in real-time

3. Click "Generate PDF" to:
   - Create the PDF
   - Upload it to Firebase Storage
   - Send an email with the download link

## Technologies Used

- React
- Vite
- Firebase Storage
- EmailJS
- react-pdf
- pdf-lib
- styled-components

## License

MIT
