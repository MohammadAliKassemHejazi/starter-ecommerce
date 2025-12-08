import requests
import json
import sys

BASE_URL = "http://localhost:5300/api"

USERS = {
    "admin": {
        "email": "admin@store.com",
        "password": "admin123",
        "role": "ADMIN"
    },
    "customer": {
        "email": "customer@test.com",
        "password": "customer123",
        "role": "CUSTOMER"
    },
    "super_admin": {
        "email": "super@admin.com",
        "password": "superpass123",
        "role": "SUPER_ADMIN"
    }
}

TOKENS = {}

def login():
    print(f"Logging in users...")
    for name, creds in USERS.items():
        try:
            response = requests.post(f"{BASE_URL}/auth/login", json={
                "email": creds["email"],
                "password": creds["password"]
            })
            if response.status_code == 200:
                data = response.json()
                if 'data' in data and 'token' in data['data']:
                     TOKENS[name] = data['data']['token']
                     print(f"✅ Logged in {name}")
                elif 'token' in data:
                     TOKENS[name] = data['token']
                     print(f"✅ Logged in {name}")
                else:
                    print(f"❌ Failed to login {name}: Token not found in response: {data}")
            else:
                print(f"❌ Failed to login {name}: {response.status_code} - {response.text}")
        except Exception as e:
            print(f"❌ Exception logging in {name}: {e}")

def test_endpoint(method, endpoint, user=None, expected_status=200, data=None):
    headers = {}
    if user:
        if user in TOKENS:
            headers["Authorization"] = f"Bearer {TOKENS[user]}"
        else:
            print(f"⚠️ User {user} not logged in, skipping test for {endpoint}")
            return

    url = f"{BASE_URL}{endpoint}"
    
    try:
        if method.upper() == "GET":
            response = requests.get(url, headers=headers)
        elif method.upper() == "POST":
            response = requests.post(url, headers=headers, json=data)
        elif method.upper() == "PUT":
            response = requests.put(url, headers=headers, json=data)
        elif method.upper() == "DELETE":
            response = requests.delete(url, headers=headers)
        elif method.upper() == "PATCH":
            response = requests.patch(url, headers=headers, json=data)
        else:
            print(f"Unsupported method {method}")
            return

        status_match = response.status_code == expected_status
        result_icon = "✅" if status_match else "❌"
        print(f"{result_icon} [{method}] {endpoint} | User: {user if user else 'Unauth'} | Expected: {expected_status} | Actual: {response.status_code}")
        
        if not status_match:
            print(f"   Response: {response.text}")

    except Exception as e:
        print(f"❌ Exception testing {endpoint}: {e}")

def run_tests():
    login()
    
    print("\n--- Testing Permission Strategy ---\n")

    # 1. User Management
    print("\n--- User Management (/users) ---")
    # Fetch users (creator) - Protected
    test_endpoint("GET", "/users", "admin", 200)
    test_endpoint("GET", "/users", "customer", 403) # Assuming customer can't list users
    test_endpoint("GET", "/users", None, 401)

    # Create User
    new_user = {
        "name": "New User",
        "email": "newuser@example.com",
        "password": "password123",
        "phone": "1234567890"
    }
    # Check if we can create with admin
    # Assuming CreateUserRequest schema matches
    test_endpoint("POST", "/users", "admin", 201, new_user) 
    
    # 2. Roles (Admin Only)
    print("\n--- Roles (/admin/roles) ---")
    test_endpoint("GET", "/admin/roles", "admin", 200)
    test_endpoint("GET", "/admin/roles", "customer", 403) # Should be forbidden
    test_endpoint("GET", "/admin/roles", None, 401)

    # 3. Permissions (Admin Only)
    print("\n--- Permissions (/admin/permissions) ---")
    test_endpoint("GET", "/admin/permissions", "admin", 200)
    test_endpoint("GET", "/admin/permissions", "customer", 403)
    test_endpoint("GET", "/admin/permissions", None, 401)

    # 4. Products (Shop/Store)
    print("\n--- Products (/shop/getall) ---")
    # Assuming public read
    test_endpoint("GET", "/shop/getall", None, 200)
    
    # Create product (Store owner/Admin)
    new_product = {
        "name": "Test Product",
        "price": 100,
        "description": "A test product"
    }
    test_endpoint("POST", "/shop/create", "admin", 201, new_product)
    test_endpoint("POST", "/shop/create", "customer", 403, new_product) # Customer shouldn't be able to create products
    
    # 5. Orders
    print("\n--- Orders ---")
    test_endpoint("GET", "/orders/last", "customer", 200) # Own orders
    test_endpoint("GET", "/orders/last", None, 401)
    
    # Admin orders
    test_endpoint("GET", "/admin/orders", "admin", 200)
    test_endpoint("GET", "/admin/orders", "customer", 403)

if __name__ == "__main__":
    run_tests()
