import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { listAllPDFs } from '../firebase/firebaseConfig';

const Container = styled.div`
  margin-top: 2rem;
  width: 100%;
  max-width: 800px;
`;

const Title = styled.h2`
  color: #2563eb;
  margin-bottom: 1rem;
`;

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const PDFItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const PDFInfo = styled.div`
  flex: 1;
`;

const PDFName = styled.h3`
  margin: 0;
  color: #374151;
  font-size: 1rem;
`;

const PDFDate = styled.p`
  margin: 0.25rem 0 0;
  color: #6b7280;
  font-size: 0.875rem;
`;

const Button = styled.a`
  padding: 0.5rem 1rem;
  background-color: #2563eb;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  text-decoration: none;
  font-size: 0.875rem;
  
  &:hover {
    background-color: #1d4ed8;
  }
`;

const PDFList = () => {
  const [pdfs, setPdfs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPDFs();
  }, []);

  const loadPDFs = async () => {
    try {
      const files = await listAllPDFs();
      setPdfs(files);
    } catch (error) {
      console.error('Error loading PDFs:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (timestamp) => {
    return new Date(parseInt(timestamp)).toLocaleString('no-NO', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return <Container>Loading...</Container>;
  }

  return (
    <Container>
      <Title>Tidligere verdivurderinger</Title>
      <List>
        {pdfs.map((pdf) => (
          <PDFItem key={pdf.fullPath}>
            <PDFInfo>
              <PDFName>{pdf.name.split('-')[1]}</PDFName>
              <PDFDate>{formatDate(pdf.createdAt)}</PDFDate>
            </PDFInfo>
            <Button href={pdf.url} target="_blank" rel="noopener noreferrer">
              Åpne PDF
            </Button>
          </PDFItem>
        ))}
      </List>
    </Container>
  );
};

export default PDFList; 