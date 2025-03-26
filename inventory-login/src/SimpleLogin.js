import React, { useState } from 'react';

function SimpleLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`ชื่อผู้ใช้: ${username}\nรหัสผ่าน: ${password}`);
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ccc' }}>
      <h2>เข้าสู่ระบบ</h2>
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
          style={{ padding: '10px 15px', backgroundColor: '#4A90E2', color: 'white', border: 'none' }}
        >
          เข้าสู่ระบบ
        </button>
      </form>
    </div>
  );
}

export default SimpleLogin;