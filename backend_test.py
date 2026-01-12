#!/usr/bin/env python3
"""
Backend API Integration Tests for Admin Dashboard
Tests DummyJSON API endpoints used by the application
"""

import requests
import json
import sys
from datetime import datetime

class DummyJSONAPITester:
    def __init__(self):
        self.base_url = "https://dummyjson.com"
        self.test_results = []
        self.auth_token = None
        
    def log_result(self, test_name, success, message, response_data=None):
        """Log test result"""
        result = {
            'test': test_name,
            'success': success,
            'message': message,
            'timestamp': datetime.now().isoformat(),
            'response_data': response_data
        }
        self.test_results.append(result)
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status}: {test_name} - {message}")
        
    def test_authentication(self):
        """Test DummyJSON authentication endpoint"""
        print("\n=== Testing Authentication ===")
        
        try:
            # Test login with correct credentials
            login_data = {
                "username": "emilys",
                "password": "emilyspass",
                "expiresInMins": 60
            }
            
            response = requests.post(
                f"{self.base_url}/auth/login",
                headers={'Content-Type': 'application/json'},
                json=login_data,
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                # DummyJSON uses 'accessToken' instead of 'token'
                if ('accessToken' in data or 'token' in data) and 'id' in data:
                    self.auth_token = data.get('accessToken') or data.get('token')
                    self.log_result(
                        "Authentication - Valid Login",
                        True,
                        f"Login successful, token received for user {data.get('firstName', 'Unknown')}",
                        {'user_id': data.get('id'), 'username': data.get('username')}
                    )
                else:
                    self.log_result(
                        "Authentication - Valid Login",
                        False,
                        "Login response missing required fields (accessToken/token, id)"
                    )
            else:
                self.log_result(
                    "Authentication - Valid Login",
                    False,
                    f"Login failed with status {response.status_code}: {response.text}"
                )
                
        except Exception as e:
            self.log_result(
                "Authentication - Valid Login",
                False,
                f"Login request failed: {str(e)}"
            )
            
        # Test login with invalid credentials
        try:
            invalid_login_data = {
                "username": "invalid_user",
                "password": "wrong_password",
                "expiresInMins": 60
            }
            
            response = requests.post(
                f"{self.base_url}/auth/login",
                headers={'Content-Type': 'application/json'},
                json=invalid_login_data,
                timeout=10
            )
            
            if response.status_code == 400:
                self.log_result(
                    "Authentication - Invalid Login",
                    True,
                    "Invalid credentials correctly rejected"
                )
            else:
                self.log_result(
                    "Authentication - Invalid Login",
                    False,
                    f"Expected 400 status for invalid credentials, got {response.status_code}"
                )
                
        except Exception as e:
            self.log_result(
                "Authentication - Invalid Login",
                False,
                f"Invalid login test failed: {str(e)}"
            )
    
    def test_users_api(self):
        """Test DummyJSON users endpoints"""
        print("\n=== Testing Users API ===")
        
        # Test users list with pagination
        try:
            response = requests.get(
                f"{self.base_url}/users?limit=10&skip=0",
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                if 'users' in data and 'total' in data and isinstance(data['users'], list):
                    users_count = len(data['users'])
                    total_count = data['total']
                    self.log_result(
                        "Users API - List Users",
                        True,
                        f"Retrieved {users_count} users out of {total_count} total",
                        {'users_returned': users_count, 'total_users': total_count}
                    )
                else:
                    self.log_result(
                        "Users API - List Users",
                        False,
                        "Users list response missing required fields (users, total)"
                    )
            else:
                self.log_result(
                    "Users API - List Users",
                    False,
                    f"Users list request failed with status {response.status_code}"
                )
                
        except Exception as e:
            self.log_result(
                "Users API - List Users",
                False,
                f"Users list request failed: {str(e)}"
            )
        
        # Test user search
        try:
            response = requests.get(
                f"{self.base_url}/users/search?q=john",
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                if 'users' in data and isinstance(data['users'], list):
                    search_results = len(data['users'])
                    self.log_result(
                        "Users API - Search Users",
                        True,
                        f"Search for 'john' returned {search_results} results",
                        {'search_query': 'john', 'results_count': search_results}
                    )
                else:
                    self.log_result(
                        "Users API - Search Users",
                        False,
                        "User search response missing required fields"
                    )
            else:
                self.log_result(
                    "Users API - Search Users",
                    False,
                    f"User search request failed with status {response.status_code}"
                )
                
        except Exception as e:
            self.log_result(
                "Users API - Search Users",
                False,
                f"User search request failed: {str(e)}"
            )
        
        # Test single user fetch
        try:
            response = requests.get(
                f"{self.base_url}/users/1",
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                if 'id' in data and 'firstName' in data and 'email' in data:
                    self.log_result(
                        "Users API - Single User",
                        True,
                        f"Retrieved user: {data.get('firstName')} {data.get('lastName')} ({data.get('email')})",
                        {'user_id': data.get('id'), 'name': f"{data.get('firstName')} {data.get('lastName')}"}
                    )
                else:
                    self.log_result(
                        "Users API - Single User",
                        False,
                        "Single user response missing required fields"
                    )
            else:
                self.log_result(
                    "Users API - Single User",
                    False,
                    f"Single user request failed with status {response.status_code}"
                )
                
        except Exception as e:
            self.log_result(
                "Users API - Single User",
                False,
                f"Single user request failed: {str(e)}"
            )
    
    def test_products_api(self):
        """Test DummyJSON products endpoints"""
        print("\n=== Testing Products API ===")
        
        # Test products list with pagination
        try:
            response = requests.get(
                f"{self.base_url}/products?limit=12&skip=0",
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                if 'products' in data and 'total' in data and isinstance(data['products'], list):
                    products_count = len(data['products'])
                    total_count = data['total']
                    self.log_result(
                        "Products API - List Products",
                        True,
                        f"Retrieved {products_count} products out of {total_count} total",
                        {'products_returned': products_count, 'total_products': total_count}
                    )
                else:
                    self.log_result(
                        "Products API - List Products",
                        False,
                        "Products list response missing required fields (products, total)"
                    )
            else:
                self.log_result(
                    "Products API - List Products",
                    False,
                    f"Products list request failed with status {response.status_code}"
                )
                
        except Exception as e:
            self.log_result(
                "Products API - List Products",
                False,
                f"Products list request failed: {str(e)}"
            )
        
        # Test product search
        try:
            response = requests.get(
                f"{self.base_url}/products/search?q=phone",
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                if 'products' in data and isinstance(data['products'], list):
                    search_results = len(data['products'])
                    self.log_result(
                        "Products API - Search Products",
                        True,
                        f"Search for 'phone' returned {search_results} results",
                        {'search_query': 'phone', 'results_count': search_results}
                    )
                else:
                    self.log_result(
                        "Products API - Search Products",
                        False,
                        "Product search response missing required fields"
                    )
            else:
                self.log_result(
                    "Products API - Search Products",
                    False,
                    f"Product search request failed with status {response.status_code}"
                )
                
        except Exception as e:
            self.log_result(
                "Products API - Search Products",
                False,
                f"Product search request failed: {str(e)}"
            )
        
        # Test category filter
        try:
            response = requests.get(
                f"{self.base_url}/products/category/smartphones",
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                if 'products' in data and isinstance(data['products'], list):
                    category_results = len(data['products'])
                    self.log_result(
                        "Products API - Category Filter",
                        True,
                        f"Category 'smartphones' returned {category_results} products",
                        {'category': 'smartphones', 'results_count': category_results}
                    )
                else:
                    self.log_result(
                        "Products API - Category Filter",
                        False,
                        "Category filter response missing required fields"
                    )
            else:
                self.log_result(
                    "Products API - Category Filter",
                    False,
                    f"Category filter request failed with status {response.status_code}"
                )
                
        except Exception as e:
            self.log_result(
                "Products API - Category Filter",
                False,
                f"Category filter request failed: {str(e)}"
            )
        
        # Test single product fetch
        try:
            response = requests.get(
                f"{self.base_url}/products/1",
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                if 'id' in data and 'title' in data and 'price' in data:
                    self.log_result(
                        "Products API - Single Product",
                        True,
                        f"Retrieved product: {data.get('title')} (${data.get('price')})",
                        {'product_id': data.get('id'), 'title': data.get('title'), 'price': data.get('price')}
                    )
                else:
                    self.log_result(
                        "Products API - Single Product",
                        False,
                        "Single product response missing required fields"
                    )
            else:
                self.log_result(
                    "Products API - Single Product",
                    False,
                    f"Single product request failed with status {response.status_code}"
                )
                
        except Exception as e:
            self.log_result(
                "Products API - Single Product",
                False,
                f"Single product request failed: {str(e)}"
            )
        
        # Test categories list
        try:
            response = requests.get(
                f"{self.base_url}/products/categories",
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                if isinstance(data, list) and len(data) > 0:
                    categories_count = len(data)
                    # Handle both string array and object array formats
                    if isinstance(data[0], dict):
                        # New format: array of objects with slug, name, url
                        sample_categories = [cat.get('name', cat.get('slug', str(cat))) for cat in data[:5]]
                    else:
                        # Old format: array of strings
                        sample_categories = data[:5]
                    
                    self.log_result(
                        "Products API - Categories List",
                        True,
                        f"Retrieved {categories_count} categories. Sample: {', '.join(sample_categories)}",
                        {'categories_count': categories_count, 'sample_categories': sample_categories}
                    )
                else:
                    self.log_result(
                        "Products API - Categories List",
                        False,
                        "Categories list response is not a valid array or is empty"
                    )
            else:
                self.log_result(
                    "Products API - Categories List",
                    False,
                    f"Categories list request failed with status {response.status_code}"
                )
                
        except Exception as e:
            self.log_result(
                "Products API - Categories List",
                False,
                f"Categories list request failed: {str(e)}"
            )
    
    def test_internal_api_routes(self):
        """Test internal Next.js API routes (basic functionality)"""
        print("\n=== Testing Internal API Routes ===")
        
        # Get base URL from environment
        base_url = "https://abroad-navigator.preview.emergentagent.com"
        
        # Test root endpoint
        try:
            response = requests.get(
                f"{base_url}/api/root",
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                if 'message' in data:
                    self.log_result(
                        "Internal API - Root Endpoint",
                        True,
                        f"Root endpoint working: {data['message']}",
                        {'message': data['message']}
                    )
                else:
                    self.log_result(
                        "Internal API - Root Endpoint",
                        False,
                        "Root endpoint response missing message field"
                    )
            else:
                self.log_result(
                    "Internal API - Root Endpoint",
                    False,
                    f"Root endpoint failed with status {response.status_code}"
                )
                
        except Exception as e:
            self.log_result(
                "Internal API - Root Endpoint",
                False,
                f"Root endpoint request failed: {str(e)}"
            )
        
        # Test status endpoint POST
        try:
            status_data = {
                "client_name": "test_client_admin_dashboard"
            }
            
            response = requests.post(
                f"{base_url}/api/status",
                headers={'Content-Type': 'application/json'},
                json=status_data,
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                if 'id' in data and 'client_name' in data:
                    self.log_result(
                        "Internal API - Status POST",
                        True,
                        f"Status POST successful, ID: {data['id']}",
                        {'status_id': data['id'], 'client_name': data['client_name']}
                    )
                else:
                    self.log_result(
                        "Internal API - Status POST",
                        False,
                        "Status POST response missing required fields"
                    )
            else:
                self.log_result(
                    "Internal API - Status POST",
                    False,
                    f"Status POST failed with status {response.status_code}"
                )
                
        except Exception as e:
            self.log_result(
                "Internal API - Status POST",
                False,
                f"Status POST request failed: {str(e)}"
            )
        
        # Test status endpoint GET
        try:
            response = requests.get(
                f"{base_url}/api/status",
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                if isinstance(data, list):
                    status_count = len(data)
                    self.log_result(
                        "Internal API - Status GET",
                        True,
                        f"Status GET successful, retrieved {status_count} status records",
                        {'status_records_count': status_count}
                    )
                else:
                    self.log_result(
                        "Internal API - Status GET",
                        False,
                        "Status GET response is not a valid array"
                    )
            else:
                self.log_result(
                    "Internal API - Status GET",
                    False,
                    f"Status GET failed with status {response.status_code}"
                )
                
        except Exception as e:
            self.log_result(
                "Internal API - Status GET",
                False,
                f"Status GET request failed: {str(e)}"
            )
    
    def run_all_tests(self):
        """Run all API tests"""
        print("🚀 Starting Admin Dashboard API Integration Tests")
        print("=" * 60)
        
        # Run all test suites
        self.test_authentication()
        self.test_users_api()
        self.test_products_api()
        self.test_internal_api_routes()
        
        # Generate summary
        print("\n" + "=" * 60)
        print("📊 TEST SUMMARY")
        print("=" * 60)
        
        total_tests = len(self.test_results)
        passed_tests = sum(1 for result in self.test_results if result['success'])
        failed_tests = total_tests - passed_tests
        
        print(f"Total Tests: {total_tests}")
        print(f"✅ Passed: {passed_tests}")
        print(f"❌ Failed: {failed_tests}")
        print(f"Success Rate: {(passed_tests/total_tests)*100:.1f}%")
        
        if failed_tests > 0:
            print("\n🔍 FAILED TESTS:")
            for result in self.test_results:
                if not result['success']:
                    print(f"  • {result['test']}: {result['message']}")
        
        print("\n" + "=" * 60)
        return failed_tests == 0

if __name__ == "__main__":
    tester = DummyJSONAPITester()
    success = tester.run_all_tests()
    sys.exit(0 if success else 1)