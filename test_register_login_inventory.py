import requests
import json
import time

# URL ของ API
BASE_URL = "http://127.0.0.1:8001"

def wait_for_server():
    print("รอ server...")
    max_retries = 5
    retry_count = 0
    while retry_count < max_retries:
        try:
            response = requests.get(f"{BASE_URL}/")
            if response.status_code == 200:
                return True
        except:
            pass
        time.sleep(2)
        retry_count += 1
    return False

def register_user():
    """ลงทะเบียนผู้ใช้ใหม่"""
    print("\n1. ลงทะเบียนผู้ใช้ใหม่...")
    
    # ข้อมูลผู้ใช้สำหรับทดสอบ
    user_data = {
        "username": "testuser_new5",
        "password": "testpassword123",
        "email": "test_new5@example.com",
        "first_name": "Test",
        "last_name": "User",
        "role": "User",
        "profile_picture": None,
        "is_deleted": False
    }
    
    response = requests.post(f"{BASE_URL}/auth/register", json=user_data)
    print(f"Response body: {response.text}")
    
    if response.status_code == 201:
        print("ลงทะเบียนสำเร็จ")
        return True
    else:
        print(f"ลงทะเบียนไม่สำเร็จ: {response.status_code}")
        print(response.text)
        return False

def login():
    """เข้าสู่ระบบ"""
    print("\n2. เข้าสู่ระบบ...")
    login_data = {
        "username": "testuser_new5",
        "password": "testpassword123"
    }
    
    response = requests.post(f"{BASE_URL}/auth/login", json=login_data)
    print(f"Response body: {response.text}")
    
    if response.status_code == 200:
        token_data = response.json()
        print("เข้าสู่ระบบสำเร็จ")
        return token_data.get("access_token")
    else:
        print(f"เข้าสู่ระบบไม่สำเร็จ: {response.status_code}")
        print(response.text)
        return None

def add_inventory(token):
    """เพิ่มข้อมูล Inventory"""
    print("\n3. เพิ่มข้อมูล inventory...")
    headers = {"Authorization": f"Bearer {token}"}
    
    inventory_data = {
        "type": "HDD",
        "name_product": "WD Black 6TB",
        "part_number": "WD6003FZEX",
        "serial_number": "WD987654322",
        "location": "1st",
        "sub_location": "Rack A-3",
        "status": "Available",
        "health": "Good"
    }
    
    response = requests.post(f"{BASE_URL}/inventory/", json=inventory_data, headers=headers)
    print(f"Response body: {response.text}")
    
    if response.status_code == 201:
        print("เพิ่มข้อมูล inventory สำเร็จ")
        return True
    else:
        print(f"เพิ่มข้อมูล inventory ไม่สำเร็จ: {response.status_code}")
        print(response.text)
        return False

def main():
    print("=== เริ่มต้นการทดสอบ ===")
    
    if not wait_for_server():
        print("ไม่สามารถเชื่อมต่อกับ server ได้")
        return
        
    if not register_user():
        print("ไม่สามารถลงทะเบียนได้")
        return
        
    token = login()
    if not token:
        print("ไม่สามารถเข้าสู่ระบบได้")
        return
        
    if not add_inventory(token):
        print("ไม่สามารถเพิ่มข้อมูล inventory ได้")
        return
        
    print("\n=== การทดสอบเสร็จสิ้น ===")

if __name__ == "__main__":
    main() 