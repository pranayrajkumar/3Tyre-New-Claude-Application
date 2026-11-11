// frontend/src/pages/Employees.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import EmployeeCard from '../components/EmployeeCard';

const API = '/api/employees';

export default function Employees() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const res = await axios.get(API);
      console.log('Fetched employees:', res.data);
      setEmployees(res.data);
    } catch (err) {
      console.error('Error fetching employees:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API}/${id}`);
      await fetchEmployees(); // Refresh after delete
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  const filteredEmployees = employees.filter(emp => {
    const matchesSearch = emp.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          emp.jobTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          emp.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || emp.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  if (loading) return <div style={{ textAlign: 'center', padding: '80px' }}>⏳ Loading employees...</div>;

  return (
    <div className="fade-in">
      <div style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
        <div>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 800, margin: 0, background: 'linear-gradient(135deg, #1e1b4b, #ec4899)', backgroundClip: 'text', WebkitBackgroundClip: 'text', color: 'transparent' }}>👥 Team Members Available</h2>
          <p style={{ color: '#64748b', marginTop: '10px', fontSize: '1rem' }}>{filteredEmployees.length} of {employees.length} employees displayed</p>
        </div>
        <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
          <input
            type="text"
            placeholder="🔍 Search by name, role, email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              padding: '12px 20px',
              borderRadius: '40px',
              border: '2px solid #e2e8f0',
              width: '260px',
              fontSize: '0.9rem',
              background: 'white',
              transition: 'all 0.25s'
            }}
            onFocus={(e)=>e.target.style.borderColor='#8b5cf6'}
            onBlur={(e)=>e.target.style.borderColor='#e2e8f0'}
          />
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} style={{
            padding: '12px 20px',
            borderRadius: '40px',
            border: '2px solid #e2e8f0',
            background: 'white',
            fontWeight: 600,
            fontSize: '0.85rem',
            cursor: 'pointer'
          }}>
            <option value="all">All status</option>
            <option value="active">🟢 Active</option>
            <option value="inactive">🔴 Inactive</option>
          </select>
        </div>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px,1fr))', gap: '28px' }}>
        {filteredEmployees.map(emp => (
          <EmployeeCard key={emp._id} employee={emp} onDelete={handleDelete} />
        ))}
      </div>
      
      {filteredEmployees.length === 0 && (
        <div style={{ textAlign: 'center', background: 'linear-gradient(135deg, #fef2f2, #fce7f3)', borderRadius: '48px', padding: '70px 30px', marginTop: '30px' }}>
          <span style={{ fontSize: '5rem' }}>👀</span>
          <h3 style={{ marginTop: '16px', color: '#9d174d' }}>No employees found</h3>
          <p style={{ color: '#be185d' }}>Try adjusting your search or add a new employee</p>
        </div>
      )}
    </div>
  );
}
