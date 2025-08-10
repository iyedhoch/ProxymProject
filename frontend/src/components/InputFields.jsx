import React from 'react';
import './InputFields.css';

function InputField({ label, type, value, onChange }) {
  return (
    <div style={{ marginBottom: '16px' }}>
      <label>{label}:</label><br />
      <input type={type} 
      value={value} 
      onChange={onChange} 
      required />
    </div>
  );
}

export default InputField;