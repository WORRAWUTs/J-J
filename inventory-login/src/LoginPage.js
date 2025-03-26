import React, { useState } from 'react';
import axios from 'axios';

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('username', username);
      formData.append('password', password);

      const response = await axios.post('http://localhost:8000/token', formData);
      setToken(response.data.access_token);
      alert('เข้าสู่ระบบสำเร็จ! Token: ' + response.data.access_token);
    } catch (err) {
      setError(err.response?.data?.detail || 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ');
      alert('เกิดข้อผิดพลาด: ' + (err.response?.data?.detail || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ccc' }}>
      <h2>เข้าสู่ระบบ</h2>
      {error && <div style={{ color: 'red', marginBottom: '15px' }}>{error}</div>}
      {token && <div style={{ color: 'green', marginBottom: '15px' }}>เข้าสู่ระบบสำเร็จ!</div>}
      
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>ชื่อผู้ใช้:</label>
          <input 
            type="text" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>รหัสผ่าน:</label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        <button 
          type="submit" 
          disabled={loading}
          style={{ padding: '10px 15px', backgroundColor: '#4A90E2', color: 'white', border: 'none' }}
        >
          {loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
        </button>
      </form>
      
      {token && (
        <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
          <h3>Token:</h3>
          <p style={{ wordBreak: 'break-all' }}>{token}</p>
        </div>
      )}
    </div>
  );
}

export default LoginPage;