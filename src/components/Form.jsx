import PropTypes from 'prop-types';
import { sendEmailWithAttachment } from '../services/emailService';
import { useState } from 'react';

const Form = ({ onSubmit, onChange, formData, disabled, onAddItem, onRemoveItem, onUpdateItem }) => {
  const [recipientEmail, setRecipientEmail] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Generate PDF first
      const pdfData = await onSubmit(formData);
      
      // Calculate totals for email body
      const nettoTotal = formData.items.reduce((total, item) => total + (parseFloat(item.price) || 0), 0);
      const mva = nettoTotal * 0.25;
      const totalWithMVA = nettoTotal + mva;

      // Create itemized list
      const itemsList = formData.items
        .map(item => `${item.name}: ${Number(item.price).toFixed(2)} NOK`)
        .join('\n');

      // Prepare email content
      const subject = encodeURIComponent(`Verdivurdering for ${formData.recipient}`);
      const body = encodeURIComponent(`
Hei!

Her er verdivurdering for ${formData.recipient}:

${itemsList}

Netto: ${nettoTotal.toFixed(2)} NOK
MVA (25%): ${mva.toFixed(2)} NOK
Totalt: ${totalWithMVA.toFixed(2)} NOK

Med vennlig hilsen,
LukMeg
Nordbybråten 16, 1592 Våler
Tel: +47 998 54 333
      `);

      // Open Gmail compose in new window
      window.open(
        `https://mail.google.com/mail/u/0/?view=cm&fs=1&to=${encodeURIComponent(recipientEmail)}&su=${subject}&body=${body}`,
        '_blank'
      );
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to process the request. Please try again.');
    }
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
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-8 bg-white rounded-lg shadow-sm w-full max-w-[500px]">
      <div className="flex flex-col gap-2">
        <label htmlFor="recipient" className="font-semibold text-gray-700">
          For (person/bedrift)
        </label>
        <input
          type="text"
          id="recipient"
          value={formData.recipient || ''}
          onChange={(e) => onChange({ ...formData, recipient: e.target.value })}
          placeholder="Skriv inn navn på person eller bedrift"
          required
          className="p-3 border border-gray-200 rounded-md text-base focus:outline-none focus:border-blue-600"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="recipientEmail" className="font-semibold text-gray-700">
          Mottakers e-post
        </label>
        <input
          type="email"
          id="recipientEmail"
          value={recipientEmail}
          onChange={(e) => setRecipientEmail(e.target.value)}
          placeholder="skriv inn e-postadresse"
          required
          className="p-3 border border-gray-200 rounded-md text-base focus:outline-none focus:border-blue-600"
        />
      </div>

      <button 
        type="button" 
        onClick={onAddItem}
        className="bg-emerald-500 text-white border-none rounded-md py-3 cursor-pointer font-semibold mb-4 hover:bg-emerald-600 transition-colors"
      >
        + Add Item
      </button>

      {formData.items.map((item, index) => (
        <div key={item.id} className="border border-gray-200 rounded-lg p-4 mb-4 relative">
          <div className="flex justify-between items-center mb-4">
            <h3 className="m-0 text-lg text-gray-700">Item {index + 1}</h3>
            <button
              type="button"
              onClick={() => onRemoveItem(item.id)}
              className="bg-red-500 text-white border-none rounded-md p-2 text-sm cursor-pointer hover:bg-red-600 transition-colors"
            >
              Remove
            </button>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor={`name-${item.id}`} className="font-semibold text-gray-700">
              Tittel
            </label>
            <input
              type="text"
              id={`name-${item.id}`}
              value={item.name}
              onChange={(e) => handleItemChange(item.id, 'name', e.target.value)}
              required
              className="p-3 border border-gray-200 rounded-md text-base focus:outline-none focus:border-blue-600"
            />
          </div>

          <div className="flex flex-col gap-2 mt-4">
            <label htmlFor={`price-${item.id}`} className="font-semibold text-gray-700">
              Pris (NOK)
            </label>
            <input
              type="number"
              id={`price-${item.id}`}
              value={item.price}
              onChange={(e) => handleItemChange(item.id, 'price', e.target.value)}
              required
              step="0.01"
              min="0"
              placeholder="0.00"
              className="p-3 border border-gray-200 rounded-md text-base focus:outline-none focus:border-blue-600"
            />
          </div>

          <div className="flex flex-col gap-2 mt-4">
            <label htmlFor={`description-${item.id}`} className="font-semibold text-gray-700">
              Beskrivelse
            </label>
            <textarea
              id={`description-${item.id}`}
              value={item.description}
              onChange={(e) => handleItemChange(item.id, 'description', e.target.value)}
              required
              className="p-3 border border-gray-200 rounded-md text-base min-h-[100px] resize-y focus:outline-none focus:border-blue-600"
            />
          </div>
        </div>
      ))}

      <div className="mt-4 pt-4 border-t-2 border-gray-200 font-semibold text-lg text-blue-600 text-right">
        Netto: {calculateTotal().toFixed(2)} NOK
        <br />
        + MVA: {(calculateTotal() * 0.25).toFixed(2)} NOK
        <br />
        Total: {(calculateTotal() * 1.25).toFixed(2)} NOK
      </div>

      <div className="flex gap-4 mt-4">
        <button 
          type="submit" 
          disabled={disabled}
          className="flex-1 py-3 px-6 bg-blue-600 text-white border-none rounded-md font-semibold cursor-pointer transition-colors hover:bg-blue-700 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          Generate PDF
        </button>
        <button 
          type="button"
          disabled={disabled || !recipientEmail}
          onClick={handleSubmit}
          className="flex-1 py-3 px-6 bg-indigo-600 text-white border-none rounded-md font-semibold cursor-pointer transition-colors hover:bg-indigo-700 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          Send Email
        </button>
      </div>
    </form>
  );
};

Form.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  formData: PropTypes.shape({
    recipient: PropTypes.string,
    items: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string,
      price: PropTypes.string,
      description: PropTypes.string
    }))
  }).isRequired,
  disabled: PropTypes.bool,
  onAddItem: PropTypes.func.isRequired,
  onRemoveItem: PropTypes.func.isRequired,
  onUpdateItem: PropTypes.func.isRequired
};

export default Form; 