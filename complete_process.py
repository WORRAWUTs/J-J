import requests
import json
import time

# URL ของ API
BASE_URL = "http://localhost:8000"

def register_user():
    """ลงทะเบียนผู้ใช้ใหม่"""
    # สร้าง username แบบไม่ซ้ำโดยใช้ timestamp
    timestamp = int(time.time())
    username = f"user{timestamp}"
    
    user_data = {
        "username": username,
        "email": f"{username}@example.com",
        "password": "password123",
        "first_name": "Test",
        "last_name": "User",
        "phone": f"08{timestamp % 100000000:08d}",
        "role": "User",
        "profile_pic": ""
    }
    
    print(f"กำลังลงทะเบียนผู้ใช้: {username}")
    
    response = requests.post(f"{BASE_URL}/register", json=user_data)
    
    if response.status_code == 200:
        print("ลงทะเบียนสำเร็จ!")
        print(response.json())
        return user_data
    else:
        print(f"ลงทะเบียนไม่สำเร็จ: {response.status_code}")
        print(response.text)
        return None

def login(username, password):
    """ล็อกอินเพื่อรับ token"""
    login_data = {
        "username": username,
        "password": password
    }
    
    print(f"กำลังล็อกอินด้วย username: {username}")
    
    response = requests.post(f"{BASE_URL}/login", json=login_data)
    
    if response.status_code == 200:
        token_data = response.json()
        print("ล็อกอินสำเร็จ!")
        print(f"Token: {token_data['access_token']}")
        return token_data["access_token"]
    else:
        print(f"ล็อกอินไม่สำเร็จ: {response.status_code}")
        print(response.text)
        return None

def add_inventory(token):
    """เพิ่มข้อมูล Inventory"""
    # สร้าง part_number และ serial_number แบบไม่ซ้ำโดยใช้ timestamp
    timestamp = int(time.time())
    
    inventory_data = {
        "type": "HDD",
        "name_product": f"Seagate Barracuda 1TB {timestamp}",
        "part_number": f"ST1000DM{timestamp % 1000:03d}",
        "serial_number": f"SN{timestamp}",
        "location": "1st",
        "sub_location": "Rack A",
        "status": "Available",
        "health": "Good"
    }
    
    print(f"กำลังเพิ่มข้อมูล Inventory: {inventory_data['name_product']}")
    
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    
    response = requests.post(f"{BASE_URL}/inventory", json=inventory_data, headers=headers)
    
    if response.status_code == 201:
        print("เพิ่มข้อมูล Inventory สำเร็จ!")
        print(json.dumps(response.json(), indent=4, ensure_ascii=False))
        return True
    else:
        print(f"เพิ่มข้อมูลไม่สำเร็จ: {response.status_code}")
        print(response.text)
        return False

if __name__ == "__main__":
    # ขั้นตอนที่ 1: ลงทะเบียนผู้ใช้ใหม่
    user_data = register_user()
    
    if user_data:
        # ขั้นตอนที่ 2: ล็อกอินเพื่อรับ token
        token = login(user_data["username"], user_data["password"])
        
        if token:
            # ขั้นตอนที่ 3: เพิ่มข้อมูล Inventory
            add_inventory(token)
            
    print("เสร็จสิ้นกระบวนการทั้งหมด") 