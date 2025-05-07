import React, { useState } from 'react';
import axios from 'axios';

const PriceCalculator = () => {
  const [item, setItem] = useState('');
  const [quantity, setQuantity] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setResult(null);
    setError('');

    try {
      const response = await axios.post('http://localhost:5000/api/calculate', {
        item,
        quantity
      });
      setResult(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Error calculating price');
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Item Name:</label>
          <input type="text" value={item} onChange={(e) => setItem(e.target.value)} required />
        </div>
        <div>
          <label>Quantity:</label>
          <input type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} required />
        </div>
        <button type="submit">Calculate</button>
      </form>

      {result && (
        <div>
          <h3>Result</h3>
          <p><strong>Item:</strong> {result.item}</p>
          <p><strong>Unit Price:</strong> {result.unit_price}</p>
          <p><strong>Total Price:</strong> {result.total_price}</p>
        </div>
      )}

      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default PriceCalculator;
