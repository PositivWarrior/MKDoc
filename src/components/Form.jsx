import React from 'react';
import styled from 'styled-components';

const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 2rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 500px;
`;

const ItemContainer = styled.div`
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
  position: relative;
`;

const ItemHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const ItemTitle = styled.h3`
  margin: 0;
  font-size: 1.1rem;
  color: #374151;
`;

const RemoveButton = styled.button`
  background: #ef4444;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.5rem;
  cursor: pointer;
  font-size: 0.875rem;
  
  &:hover {
    background: #dc2626;
  }
`;

const AddItemButton = styled.button`
  background: #10b981;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.75rem;
  cursor: pointer;
  font-weight: 600;
  margin-bottom: 1rem;
  
  &:hover {
    background: #059669;
  }
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-weight: 600;
  color: #333;
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  &:focus {
    outline: none;
    border-color: #2563eb;
  }
`;

const TextArea = styled.textarea`
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  min-height: 100px;
  resize: vertical;
  &:focus {
    outline: none;
    border-color: #2563eb;
  }
`;

const TotalPrice = styled.div`
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 2px solid #e5e7eb;
  font-weight: 600;
  font-size: 1.1rem;
  color: #2563eb;
  text-align: right;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  background-color: ${props => props.variant === 'secondary' ? '#4f46e5' : '#2563eb'};
  color: white;
  border: none;
  border-radius: 4px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
  flex: 1;
  
  &:hover {
    background-color: ${props => props.variant === 'secondary' ? '#4338ca' : '#1d4ed8'};
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const Form = ({ onSubmit, onChange, formData, disabled, onAddItem, onRemoveItem, onUpdateItem }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleItemChange = (itemId, field, value) => {
    onUpdateItem(itemId, field, value);
  };

  const calculateTotal = () => {
    return formData.items.reduce((total, item) => {
      return total + (parseFloat(item.price) || 0);
    }, 0);
  };

  return (
    <FormContainer onSubmit={handleSubmit}>
      <InputGroup>
        <Label htmlFor="recipient">For (person/bedrift)</Label>
        <Input
          type="text"
          id="recipient"
          value={formData.recipient || ''}
          onChange={(e) => onChange({ ...formData, recipient: e.target.value })}
          placeholder="Skriv inn navn på person eller bedrift"
          required
        />
      </InputGroup>

      <AddItemButton type="button" onClick={onAddItem}>
        + Add Item
      </AddItemButton>

      {formData.items.map((item, index) => (
        <ItemContainer key={item.id}>
          <ItemHeader>
            <ItemTitle>Item {index + 1}</ItemTitle>
            <RemoveButton
              type="button"
              onClick={() => onRemoveItem(item.id)}
            >
              Remove
            </RemoveButton>
          </ItemHeader>

          <InputGroup>
            <Label htmlFor={`name-${item.id}`}>Tittel</Label>
            <Input
              type="text"
              id={`name-${item.id}`}
              value={item.name}
              onChange={(e) => handleItemChange(item.id, 'name', e.target.value)}
              required
            />
          </InputGroup>

          <InputGroup>
            <Label htmlFor={`price-${item.id}`}>Pris (NOK)</Label>
            <Input
              type="number"
              id={`price-${item.id}`}
              value={item.price}
              onChange={(e) => handleItemChange(item.id, 'price', e.target.value)}
              required
              step="0.01"
              min="0"
              placeholder="0.00"
            />
          </InputGroup>

          <InputGroup>
            <Label htmlFor={`description-${item.id}`}>Beskrivelse</Label>
            <TextArea
              id={`description-${item.id}`}
              value={item.description}
              onChange={(e) => handleItemChange(item.id, 'description', e.target.value)}
              required
            />
          </InputGroup>
        </ItemContainer>
      ))}

      <TotalPrice>
        Netto: {calculateTotal().toFixed(2)} NOK
        <br />
        + MVA: {(calculateTotal() * 0.25).toFixed(2)} NOK
        <br />
        Total: {(calculateTotal() * 1.25).toFixed(2)} NOK
      </TotalPrice>

      <ButtonGroup>
        <Button type="submit" disabled={disabled}>
          Generate PDF
        </Button>
        <Button 
          type="button" 
          variant="secondary" 
          disabled={disabled}
          onClick={() => onSubmit(formData, true)}
        >
          Send Email
        </Button>
      </ButtonGroup>
    </FormContainer>
  );
};

export default Form; 