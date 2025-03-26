import React, { useState } from 'react';
import axios from 'axios';
import './LoginRegister.css';

const LoginWithRegister = () => {
  // สถานะสำหรับการเข้าสู่ระบบ
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  // สถานะสำหรับการลงทะเบียน
  const [showRegister, setShowRegister] = useState(false);
  const [registerData, setRegisterData] = useState({
    username: '',
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    phone: ''
  });
  const [registerError, setRegisterError] = useState('');
  const [registerSuccess, setRegisterSuccess] = useState('');
  const [registerLoading, setRegisterLoading] = useState(false);

  // จัดการข้อมูลฟอร์มลงทะเบียนที่เปลี่ยนแปลง
  const handleRegisterChange = (e) => {
    const { name, value } = e.target;
    setRegisterData({
      ...registerData,
      [name]: value
    });
  };

  // จัดการการส่งฟอร์มลงทะเบียน
  const handleRegister = async (e) => {
    e.preventDefault();
    setRegisterLoading(true);
    setRegisterError('');
    setRegisterSuccess('');

    try {
      await axios.post('http://localhost:8000/users/', registerData);
      setRegisterSuccess('ลงทะเบียนสำเร็จ! กรุณาเข้าสู่ระบบ');
      setShowRegister(false);
      setUsername(registerData.username);
    } catch (err) {
      console.error('Registration error:', err);
      let errorMessage = 'เกิดข้อผิดพลาดในการลงทะเบียน โปรดตรวจสอบข้อมูลและลองอีกครั้ง';
      
      if (err.response?.data) {
        if (typeof err.response.data.detail === 'object') {
          // ถ้า detail เป็น object แปลงเป็น string
          errorMessage = JSON.stringify(err.response.data.detail);
        } else if (typeof err.response.data.detail === 'string') {
          // ถ้า detail เป็น string ใช้ได้เลย
          errorMessage = err.response.data.detail;
        } else if (typeof err.response.data === 'string') {
          // กรณี response.data เป็น string
          errorMessage = err.response.data;
        }
      }
      
      setRegisterError(errorMessage);
    }
  };

  // จัดการการส่งฟอร์มล็อกอิน
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setToken('');

    try {
      const formData = new FormData();
      formData.append('username', username);
      formData.append('password', password);

      const response = await axios.post('http://localhost:8000/token', formData);
      setToken(response.data.access_token);
    } catch (err) {
      console.error('Login error:', err);
      if (err.code === 'ERR_NETWORK' || err.code === 'ERR_CONNECTION_REFUSED') {
        setError('ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้ โปรดตรวจสอบว่าเซิร์ฟเวอร์กำลังทำงานอยู่');
      } else {
        setError(err.response?.data?.detail || 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง');
      }
    } finally {
      setLoading(false);
    }
  };

  // ทดสอบเรียกข้อมูลผู้ใช้ (ตัวอย่างเสริม)
  const [userId, setUserId] = useState(1);
  const [userData, setUserData] = useState(null);
  const [userLoading, setUserLoading] = useState(false);
  const [userError, setUserError] = useState('');

  const fetchUserData = async () => {
    if (!token) {
      setUserError('กรุณาเข้าสู่ระบบก่อน');
      return;
    }

    setUserLoading(true);
    setUserError('');
    setUserData(null);

    try {
      const response = await axios.get(`http://localhost:8000/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUserData(response.data);
    } catch (err) {
      console.error('Error fetching user data:', err);
      setUserError(err.response?.data?.detail || 'เกิดข้อผิดพลาดในการเรียกข้อมูลผู้ใช้');
    } finally {
      setUserLoading(false);
    }
  };

  return (
    <div className="auth-container">
      {/* ส่วนล็อกอิน */}
      <div className="auth-card">
        <h2>เข้าสู่ระบบ</h2>
        
        {error && <div className="error-message">{error}</div>}
        {token && <div className="success-message">เข้าสู่ระบบสำเร็จ!</div>}
        
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="username">ชื่อผู้ใช้</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">รหัสผ่าน</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
          </button>
        </form>
        
        <div className="auth-footer">
          <p>ยังไม่มีบัญชี? <button 
            className="btn-link" 
            onClick={() => setShowRegister(true)}
          >
            ลงทะเบียน
          </button></p>
        </div>

        {token && (
          <div className="token-container">
            <h3>ข้อมูล Token</h3>
            <p className="token-text">{token}</p>
          </div>
        )}
      </div>

      {/* ส่วนทดสอบการเรียกข้อมูลผู้ใช้ (แสดงหลังจากเข้าสู่ระบบ) */}
      {token && (
        <div className="auth-card">
          <h2>ทดสอบเรียกข้อมูลผู้ใช้</h2>
          
          <div className="user-test-controls">
            <div className="form-group">
              <label htmlFor="userId">ID ผู้ใช้</label>
              <input
                type="number"
                id="userId"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                min="1"
              />
            </div>
            
            <button 
              className="btn-secondary" 
              onClick={fetchUserData}
              disabled={userLoading}
            >
              {userLoading ? 'กำลังโหลด...' : 'เรียกข้อมูล'}
            </button>
          </div>
          
          {userError && <div className="error-message">{userError}</div>}
          
          {userData && (
            <div className="data-container">
              <h3>ข้อมูลผู้ใช้</h3>
              <pre>{JSON.stringify(userData, null, 2)}</pre>
            </div>
          )}
        </div>
      )}
      
      {/* ฟอร์มลงทะเบียน (Modal) */}
      {showRegister && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>ลงทะเบียนผู้ใช้ใหม่</h2>
              <button 
                className="btn-close" 
                onClick={() => setShowRegister(false)}
              >
                &times;
              </button>
            </div>
            
            {registerError && <div className="error-message">{registerError}</div>}
            {registerSuccess && <div className="success-message">{registerSuccess}</div>}
            
            <form onSubmit={handleRegister}>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="reg-username">ชื่อผู้ใช้ *</label>
                  <input
                    type="text"
                    id="reg-username"
                    name="username"
                    value={registerData.username}
                    onChange={handleRegisterChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="reg-email">อีเมล *</label>
                  <input
                    type="email"
                    id="reg-email"
                    name="email"
                    value={registerData.email}
                    onChange={handleRegisterChange}
                    required
                  />
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="reg-firstname">ชื่อ *</label>
                  <input
                    type="text"
                    id="reg-firstname"
                    name="first_name"
                    value={registerData.first_name}
                    onChange={handleRegisterChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="reg-lastname">นามสกุล *</label>
                  <input
                    type="text"
                    id="reg-lastname"
                    name="last_name"
                    value={registerData.last_name}
                    onChange={handleRegisterChange}
                    required
                  />
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="reg-phone">เบอร์โทรศัพท์ *</label>
                  <input
                    type="tel"
                    id="reg-phone"
                    name="phone"
                    value={registerData.phone}
                    onChange={handleRegisterChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="reg-password">รหัสผ่าน *</label>
                  <input
                    type="password"
                    id="reg-password"
                    name="password"
                    value={registerData.password}
                    onChange={handleRegisterChange}
                    required
                  />
                </div>
              </div>
              
              <div className="form-action">
                <button 
                  type="button" 
                  className="btn-secondary"
                  onClick={() => setShowRegister(false)}
                >
                  ยกเลิก
                </button>
                <button 
                  type="submit" 
                  className="btn-primary"
                  disabled={registerLoading}
                >
                  {registerLoading ? 'กำลังลงทะเบียน...' : 'ลงทะเบียน'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginWithRegister;