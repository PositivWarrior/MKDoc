import { useState, useEffect } from 'react'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { pdf } from '@react-pdf/renderer'

import { storage } from './firebase/firebaseConfig'
import Header from './components/Header'
import Form from './components/Form'
import PDFPreview, { PDFDocument } from './components/PDFPreview'
import PDFList from './components/PDFList'

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
        // Upload to Firebase to get a shareable link
        const downloadURL = await uploadToFirebase(pdfBlob)
        
        // Calculate total with MVA
        const nettoTotal = formData.items.reduce((total, item) => total + (parseFloat(item.price) || 0), 0)
        const totalWithMVA = (nettoTotal * 1.25).toFixed(2)
        
        // Create email content with itemized list
        const itemsList = formData.items
          .map(item => `${item.name}: ${Number(item.price).toFixed(2)} NOK`)
          .join('\n');

        const subject = encodeURIComponent(`Verdivurdering for ${formData.recipient}`)
        const body = encodeURIComponent(`
Hei!

Her er verdivurdering for ${formData.recipient}:

${itemsList}

Netto: ${nettoTotal.toFixed(2)} NOK
MVA (25%): ${(nettoTotal * 0.25).toFixed(2)} NOK
Totalt: ${totalWithMVA} NOK

Last ned dokumentet her: ${downloadURL}

Med vennlig hilsen,
LukMeg
Nordbybråten 16, 1592 Våler
Tel: +47 998 54 333
        `)
        
        // Open Gmail compose window
        window.open(`https://mail.google.com/mail/?view=cm&fs=1&su=${subject}&body=${body}`, '_blank')
      } else {
        // For direct download, use the blob URL
        const blobUrl = URL.createObjectURL(pdfBlob)
        const link = document.createElement('a')
        link.href = blobUrl
        link.download = `verdivurdering-${formData.recipient}-${Date.now()}.pdf`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(blobUrl)
      }
    } catch (error) {
      console.error('Operation failed:', error)
      alert('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col w-full">
      <Header />
      <main className="flex-1 w-full px-4 py-6 md:px-6 lg:px-8">
        <div className="max-w-[1920px] mx-auto">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-8">
            <div className="w-full flex justify-center">
              <Form
                formData={formData}
                onChange={handleFormChange}
                onSubmit={handleSubmit}
                disabled={loading}
                onAddItem={addItem}
                onRemoveItem={removeItem}
                onUpdateItem={updateItem}
              />
            </div>
            <div className="w-full">
              <PDFPreview formData={formData} />
            </div>
            <div className="w-full overflow-hidden">
              <PDFList />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default App
