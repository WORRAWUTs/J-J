import requests
import json

# URL ของ API
BASE_URL = "http://localhost:8000"

def login():
    """ล็อกอินเพื่อรับ token"""
    login_data = {
        "username": "your_username",  # เปลี่ยนเป็น username ของคุณ
        "password": "your_password"   # เปลี่ยนเป็น password ของคุณ
    }
    
    response = requests.post(f"{BASE_URL}/login", json=login_data)
    
    if response.status_code == 200:
        token_data = response.json()
        return token_data["access_token"]
    else:
        print(f"ล็อกอินไม่สำเร็จ: {response.status_code}")
        print(response.text)
        return None

def add_inventory(token):
    """เพิ่มข้อมูล Inventory"""
    inventory_data = {
        "type": "HDD",
        "name_product": "Seagate Barracuda 1TB",
        "part_number": "ST1000DM010",
        "serial_number": "SN12345678",
        "location": "1st",
        "sub_location": "Rack A",
        "status": "Available",
        "health": "Good"
    }
    
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    
    response = requests.post(f"{BASE_URL}/inventory", json=inventory_data, headers=headers)
    
    if response.status_code == 201:
        print("เพิ่มข้อมูล Inventory สำเร็จ!")
        print(json.dumps(response.json(), indent=4))
    else:
        print(f"เพิ่มข้อมูลไม่สำเร็จ: {response.status_code}")
        print(response.text)

if __name__ == "__main__":
    # ล็อกอินเพื่อรับ token
    token = login()
    
    if token:
        # เพิ่มข้อมูล Inventory
        add_inventory(token) 