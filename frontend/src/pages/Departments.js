// frontend/src/pages/Departments.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DepartmentCard from '../components/DepartmentCard';

const API = '/api/departments';

export default function Departments() {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(API).then(res => {
      setDepartments(res.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '80px' }}>⏳ Loading departments...</div>;
  }

  return (
    <div className="fade-in">
      <div style={{ marginBottom: '40px' }}>
        <h2 style={{ fontSize: '2.5rem', fontWeight: 800, margin: 0, background: 'linear-gradient(135deg, #1e1b4b, #8b5cf6)', backgroundClip: 'text', WebkitBackgroundClip: 'text', color: 'transparent' }}>📁 Departments</h2>
        <p style={{ color: '#64748b', marginTop: '10px', fontSize: '1rem' }}>{departments.length} active team{departments.length !== 1 ? 's' : ''} member</p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px,1fr))', gap: '28px' }}>
        {departments.map(d => <DepartmentCard key={d._id} dept={d} />)}
      </div>
      {departments.length === 0 && (
        <div style={{ textAlign: 'center', background: 'linear-gradient(135deg, #faf5ff, #f3e8ff)', borderRadius: '48px', padding: '70px 30px', marginTop: '30px' }}>
          <span style={{ fontSize: '5rem' }}>🏢</span>
          <h3 style={{ marginTop: '16px', color: '#4c1d95' }}>No departments yet</h3>
          <p style={{ color: '#6b21a5' }}>Create your first department to start organizing teams</p>
        </div>
      )}
    </div>
  );
}
