import React from 'react';
import './InputFields.css';

function InputField({ /*label*/ placeholder, type, value, onChange }) {
  return (
    <div className='input-group' style={{ marginBottom: '16px' }}>
      {/*<label>{label}:</label><br />*/}
      <input className='input-field' type={type} 
      placeholder={placeholder}
      value={value} 
      onChange={onChange} 
      required />
    </div>
  );
}

export default InputField;