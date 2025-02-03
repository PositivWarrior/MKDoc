# MKDoc - PDF Document Generator

A React application for creating and managing PDF documents with live preview, Firebase storage integration, and email notifications.

## Features

- Create PDF documents with a user-friendly form interface
- Live PDF preview as you type
- Upload generated PDFs to Firebase Storage
- Send email notifications with download links
- Modern and responsive UI

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

## Development

Run the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Building for Production

```bash
npm run build
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
