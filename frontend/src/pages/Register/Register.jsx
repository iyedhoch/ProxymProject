import React, { useState } from 'react';
import axios from 'axios';
import InputField from '../../components/InputFields';
import { useNavigate } from "react-router-dom";
import './Register.css';
function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:8002/api/auth/register', {
        name,
        email,
        password
      });

      console.log('Response:', response.data);
      alert('User registered successfully!');
    } catch (error) {
      console.error('Error:', error.response?.data || error.message);
      alert('Registration failed. Check console for details.');
    }
  };

  return (
    <div className="register-container1">
      
      {/*<h2>Create an Account</h2>*/}

      <form onSubmit={handleSubmit}>
        <h2>Create an Account</h2>

        {/*<label>Full Name:</label>*/}
        
        <InputField
          placeholder='Full Name'
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        {/*<label>Email:</label>*/}
        
        <InputField
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        {/*<label>Password:</label>*/}
        
        <InputField
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit">Register</button>
        <button 
        type="button"
        onClick={() => navigate("/login")}>
        login</button>
      </form>
    </div>
  );
}

export default Register;
