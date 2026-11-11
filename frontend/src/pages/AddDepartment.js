// frontend/src/pages/AddDepartment.js
import React, { useState } from 'react';
import axios from 'axios';

export default function AddDepartment() {
  const [form, setForm] = useState({
    name: '',
    description: '',
    manager: '',
    location: ''
  });
  const [msg, setMsg] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = e =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await axios.post('/api/departments', form);
      setMsg({ type: 'success', text: '🎉 Department added successfully!' });
      setForm({ name: '', description: '', manager: '', location: '' });
      setTimeout(() => setMsg(null), 4000);
    } catch (err) {
      setMsg({ type: 'error', text: '❌ Error: ' + (err.response?.data?.error || err.message) });
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '14px 16px',
    marginBottom: '18px',
    borderRadius: '20px',
    border: '2px solid #e2e8f0',
    fontSize: '0.95rem',
    transition: 'all 0.25s',
    background: '#ffffff',
    fontFamily: 'inherit'
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <div className="fade-in" style={{
        background: 'white',
        borderRadius: '40px',
        padding: '40px',
        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.15)',
        border: '1px solid rgba(139,92,246,0.15)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{
            width: '70px',
            height: '70px',
            background: 'linear-gradient(135deg, #8b5cf6, #c084fc)',
            borderRadius: '30px',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '32px',
            marginBottom: '16px',
            boxShadow: '0 15px 30px -10px rgba(139,92,246,0.4)'
          }}>🏢</div>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '8px', background: 'linear-gradient(135deg, #1e1b4b, #4c1d95)', backgroundClip: 'text', WebkitBackgroundClip: 'text', color: 'transparent' }}>
            Create Department
          </h2>
          <p style={{ color: '#64748b' }}>Build your organizational structure to your standars</p>
        </div>
        
        {msg && (
          <div style={{
            background: msg.type === 'success' ? 'linear-gradient(135deg, #d1fae5, #a7f3d0)' : 'linear-gradient(135deg, #fee2e2, #fecaca)',
            color: msg.type === 'success' ? '#065f46' : '#991b1b',
            padding: '14px 20px',
            borderRadius: '24px',
            marginBottom: '28px',
            fontWeight: 600,
            fontSize: '0.85rem',
            textAlign: 'center'
          }}>
            {msg.text}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <input name="name" placeholder="Department name *" value={form.name} onChange={handleChange} style={inputStyle} required onFocus={(e)=>e.target.style.borderColor='#8b5cf6'} onBlur={(e)=>e.target.style.borderColor='#e2e8f0'}/>
          <input name="description" placeholder="Description" value={form.description} onChange={handleChange} style={inputStyle} />
          <input name="manager" placeholder="Manager name" value={form.manager} onChange={handleChange} style={inputStyle} />
          <input name="location" placeholder="Location" value={form.location} onChange={handleChange} style={inputStyle} />
          <button type="submit" disabled={isSubmitting} style={{
            background: 'linear-gradient(135deg, #8b5cf6, #c084fc)',
            color: 'white',
            border: 'none',
            borderRadius: '40px',
            padding: '14px 28px',
            fontSize: '1rem',
            fontWeight: 700,
            width: '100%',
            cursor: isSubmitting ? 'not-allowed' : 'pointer',
            transition: 'transform 0.2s',
            boxShadow: '0 10px 20px -8px rgba(139,92,246,0.5)'
          }}>
            {isSubmitting ? '⏳ Creating...' : '✨ Create Department'}
          </button>
        </form>
      </div>
    </div>
  );
}
