import React from 'react';
import { Document, Page, Text, View, StyleSheet, PDFViewer, Image } from '@react-pdf/renderer';
import styled from 'styled-components';

const PreviewContainer = styled.div`
  width: 100%;
  max-width: 800px;
  height: 800px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

// PDF styles
const styles = StyleSheet.create({
  page: {
    padding: 30,
    backgroundColor: '#ffffff',
    display: 'flex',
    flexDirection: 'column'
  },
  header: {
    marginBottom: 20,
    padding: 10,
    borderBottom: 1,
    borderBottomColor: '#2563eb'
  },
  title: {
    fontSize: 28,
    marginBottom: 10,
    color: '#2563eb',
    textAlign: 'center',
    fontWeight: 'bold'
  },
  subtitle: {
    fontSize: 18,
    color: '#2563eb',
    textAlign: 'center',
    fontWeight: 'bold'
  },
  section: {
    margin: 10,
    padding: 10,
    borderBottom: 1,
    borderBottomColor: '#e5e7eb'
  },
  itemTitle: {
    fontSize: 18,
    color: '#2563eb',
    marginBottom: 10,
    fontWeight: 'bold'
  },
  label: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 5
  },
  value: {
    fontSize: 14,
    marginBottom: 10
  },
  description: {
    fontSize: 12,
    lineHeight: 1.5,
    marginTop: 10
  },
  price: {
    fontSize: 14,
    color: '#2563eb',
    marginTop: 10,
    textAlign: 'right'
  },
  totalSection: {
    margin: 10,
    padding: 10,
    marginTop: 20
  },
  totalPrice: {
    fontSize: 18,
    color: '#2563eb',
    textAlign: 'right',
    fontWeight: 'bold'
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    borderTop: 1,
    borderTopColor: '#e5e7eb',
    paddingTop: 20,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: 10,
    color: '#666666'
  },
  footerLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10
  },
  footerRight: {
    flex: 1,
    textAlign: 'right'
  },
  logo: {
    width: 50,
    height: 50,
    marginRight: 10,
    objectFit: 'contain'
  },
  contentWrapper: {
    flex: 1,
    marginBottom: 100 // Space for footer
  }
});

// Separate PDF Document component
export const PDFDocument = ({ formData }) => {
  const calculateTotal = () => {
    return formData.items.reduce((total, item) => {
      return total + (parseFloat(item.price) || 0);
    }, 0);
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.contentWrapper}>
          <View style={styles.header}>
            <Text style={styles.title}>
              Verdivurdering{'\n'}
              <Text style={styles.subtitle}>for {formData.recipient || ''}</Text>
            </Text>
          </View>

          {formData.items.map((item, index) => (
            <View key={item.id} style={styles.section}>
              <Text style={styles.itemTitle}>{item.name || `Item ${index + 1}`}</Text>

              <Text style={styles.label}>Beskrivelse</Text>
              <Text style={styles.description}>
                {item.description || 'No description provided'}
              </Text>

              <Text style={styles.price}>
                Pris: {Number(item.price || 0).toFixed(2)} NOK
              </Text>
            </View>
          ))}

          <View style={styles.totalSection}>
            <Text style={styles.totalPrice}>
              Netto: {calculateTotal().toFixed(2)} NOK{'\n'}
              + MVA: {(calculateTotal() * 0.25).toFixed(2)} NOK{'\n'}
              Total: {(calculateTotal() * 1.25).toFixed(2)} NOK
            </Text>
          </View>
        </View>

        <View style={styles.footer}>
          <View style={styles.footerLeft}>
            <Image 
              src="https://mlvri.vercel.app/images/pop_no_bg.png"
              style={styles.logo}
            />
            <View>
              <Text>LukMeg</Text>
              <Text>Nordbybråten 16, 1592 Våler</Text>
            </View>
          </View>
          <View style={styles.footerRight}>
            <Text>Tel: +47 998 54 333</Text>
            <Text>Email: lukmegnorge@gmail.com</Text>
            <Text>https://mlvri.vercel.app/</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};

const PDFPreview = ({ formData }) => {
  return (
    <PreviewContainer>
      <PDFViewer width="100%" height="100%">
        <PDFDocument formData={formData} />
      </PDFViewer>
    </PreviewContainer>
  );
};

export default PDFPreview; 