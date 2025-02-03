import { useState, useEffect } from 'react'
import styled from 'styled-components'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { pdf } from '@react-pdf/renderer'
import emailjs from 'emailjs-com'

import { storage } from './firebase/firebaseConfig'
import Header from './components/Header'
import Form from './components/Form'
import PDFPreview from './components/PDFPreview'

const AppContainer = styled.div`
  min-height: 100vh;
  background-color: #f8fafc;
  display: flex;
  flex-direction: column;
  align-items: center;
`

const MainContent = styled.main`
  width: 100%;
  max-width: 1400px;
  margin: 2rem auto;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;

  .content-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 4rem;
    width: 100%;
    justify-content: center;
    align-items: start;
    max-width: 1200px;
    margin: 0 auto;
  }

  @media (max-width: 1024px) {
    padding: 1rem;
    
    .content-grid {
      grid-template-columns: 1fr;
      max-width: 800px;
      gap: 2rem;
    }
  }
`

const App = () => {
  const [formData, setFormData] = useState(() => {
    const savedData = localStorage.getItem('formData')
    return savedData ? JSON.parse(savedData) : {
      items: [{
        id: Date.now(),
        name: '',
        price: '',
        description: ''
      }],
      email: ''
    }
  })

  useEffect(() => {
    localStorage.setItem('formData', JSON.stringify(formData))
  }, [formData])

  const [loading, setLoading] = useState(false)

  const handleFormChange = (newData) => {
    setFormData(newData)
  }

  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, {
        id: Date.now(),
        name: '',
        price: '',
        description: ''
      }]
    }))
  }

  const removeItem = (itemId) => {
    if (formData.items.length === 1) {
      alert('You must have at least one item')
      return
    }
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter(item => item.id !== itemId)
    }))
  }

  const updateItem = (itemId, field, value) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.map(item => 
        item.id === itemId 
          ? { ...item, [field]: value }
          : item
      )
    }))
  }

  const generatePDF = async () => {
    try {
      const PDFDocument = (
        <PDFPreview formData={formData} />
      )
      return await pdf(PDFDocument).toBlob()
    } catch (error) {
      console.error('Error generating PDF:', error)
      throw error
    }
  }

  const uploadToFirebase = async (pdfBlob) => {
    const fileName = `documents/${formData.name}-${Date.now()}.pdf`
    const fileRef = ref(storage, fileName)
    
    try {
      const snapshot = await uploadBytes(fileRef, pdfBlob)
      return await getDownloadURL(snapshot.ref)
    } catch (error) {
      console.error('Error uploading to Firebase:', error)
      throw error
    }
  }

  const sendEmail = async (downloadURL) => {
    try {
      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        {
          to_email: formData.email,
          to_name: formData.name,
          download_link: downloadURL,
        },
        import.meta.env.VITE_EMAILJS_USER_ID
      )
    } catch (error) {
      console.error('Error sending email:', error)
      throw error
    }
  }

  const handleSubmit = async (data, shouldSendEmail = false) => {
    setLoading(true)
    try {
      const pdfBlob = await generatePDF()
      const downloadURL = await uploadToFirebase(pdfBlob)
      
      if (shouldSendEmail) {
        // Calculate total with MVA
        const nettoTotal = formData.items.reduce((total, item) => total + (parseFloat(item.price) || 0), 0)
        const totalWithMVA = (nettoTotal * 1.25).toFixed(2)
        
        // Create email content
        const subject = encodeURIComponent('Verdivurdering')
        const body = encodeURIComponent(`
Her er din verdivurdering på totalt ${totalWithMVA} NOK (inkl. MVA).

Last ned dokumentet her: ${downloadURL}

Med vennlig hilsen,
LukMeg
        `)
        
        // Open Gmail compose window
        window.open(`https://mail.google.com/mail/?view=cm&fs=1&su=${subject}&body=${body}`, '_blank')
        setLoading(false)
      } else {
        // Create a temporary link to download the PDF
        const link = document.createElement('a')
        link.href = downloadURL
        link.download = `verdivurdering-${Date.now()}.pdf`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        alert('PDF generated successfully!')
      }
    } catch (error) {
      console.error('Operation failed:', error)
      alert('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AppContainer>
      <Header />
      <MainContent>
        <div className="content-grid">
          <Form
            formData={formData}
            onChange={handleFormChange}
            onSubmit={handleSubmit}
            disabled={loading}
            onAddItem={addItem}
            onRemoveItem={removeItem}
            onUpdateItem={updateItem}
          />
          <PDFPreview formData={formData} />
        </div>
      </MainContent>
    </AppContainer>
  )
}

export default App
