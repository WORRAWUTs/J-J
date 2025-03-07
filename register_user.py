import requests

# URL ของ API
BASE_URL = "http://localhost:8000"

def register_user():
    """ลงทะเบียนผู้ใช้ใหม่"""
    user_data = {
        "username": "testuser",
        "email": "testuser@example.com",
        "password": "password123",
        "first_name": "Test",
        "last_name": "User",
        "phone": "0812345678",
        "role": "User",
        "profile_pic": ""
    }
    
    response = requests.post(f"{BASE_URL}/register", json=user_data)
    
    if response.status_code == 200:
        print("ลงทะเบียนสำเร็จ!")
        print(response.json())
        return True
    else:
        print(f"ลงทะเบียนไม่สำเร็จ: {response.status_code}")
        print(response.text)
        return False

if __name__ == "__main__":
    register_user() 