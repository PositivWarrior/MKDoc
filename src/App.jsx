import { useState, useEffect } from 'react'
import styled from 'styled-components'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { pdf } from '@react-pdf/renderer'

import { storage } from './firebase/firebaseConfig'
import Header from './components/Header'
import Form from './components/Form'
import PDFPreview, { PDFDocument } from './components/PDFPreview'

const AppContainer = styled.div`
  min-height: 100vh;
  background-color: #f8fafc;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`

const MainContent = styled.main`
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
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
      recipient: '',
      items: [{
        id: Date.now(),
        name: '',
        price: '',
        description: ''
      }]
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
      return await pdf(<PDFDocument formData={formData} />).toBlob()
    } catch (error) {
      console.error('Error generating PDF:', error)
      throw error
    }
  }

  const uploadToFirebase = async (pdfBlob) => {
    const fileName = `documents/verdivurdering-${formData.recipient}-${Date.now()}.pdf`
    const fileRef = ref(storage, fileName)
    
    try {
      const snapshot = await uploadBytes(fileRef, pdfBlob)
      return await getDownloadURL(snapshot.ref)
    } catch (error) {
      console.error('Error uploading to Firebase:', error)
      throw error
    }
  }

  const handleSubmit = async (data, shouldSendEmail = false) => {
    setLoading(true)
    try {
      const pdfBlob = await generatePDF()
      
      if (shouldSendEmail) {
        // Upload to Firebase only if sending email
        const downloadURL = await uploadToFirebase(pdfBlob)
        
        // Calculate total with MVA
        const nettoTotal = formData.items.reduce((total, item) => total + (parseFloat(item.price) || 0), 0)
        const totalWithMVA = (nettoTotal * 1.25).toFixed(2)
        
        // Create email content
        const subject = encodeURIComponent(`Verdivurdering for ${formData.recipient}`)
        const body = encodeURIComponent(`
Her er verdivurdering for ${formData.recipient} på totalt ${totalWithMVA} NOK (inkl. MVA).

Last ned dokumentet her: ${downloadURL}

Med vennlig hilsen,
LukMeg
        `)
        
        // Open Gmail compose window
        window.open(`https://mail.google.com/mail/?view=cm&fs=1&su=${subject}&body=${body}`, '_blank')
      } else {
        // For direct download, use the blob URL instead of Firebase
        const blobUrl = URL.createObjectURL(pdfBlob)
        const link = document.createElement('a')
        link.href = blobUrl
        link.download = `verdivurdering-${formData.recipient}-${Date.now()}.pdf`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(blobUrl) // Clean up the blob URL
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
