#!/usr/bin/env python3
"""
Comprehensive Backend API Tests for Creaciones Princess Website
Tests all API endpoints with various scenarios and validates responses.
"""

import requests
import json
import uuid
import os
from datetime import datetime

# Get base URL from environment
BASE_URL = "https://princess-deco.preview.emergentagent.com"
API_BASE = f"{BASE_URL}/api"

def print_test_result(test_name, success, details=""):
    """Print formatted test results"""
    status = "✅ PASS" if success else "❌ FAIL"
    print(f"{status} {test_name}")
    if details:
        print(f"   Details: {details}")
    print()

def test_get_all_products():
    """Test GET /api/products - should return all 12 products"""
    print("🔍 Testing GET /api/products (all products)")
    
    try:
        response = requests.get(f"{API_BASE}/products", timeout=10)
        
        if response.status_code != 200:
            print_test_result("GET /api/products", False, f"Status code: {response.status_code}")
            return False
            
        data = response.json()
        
        if 'products' not in data:
            print_test_result("GET /api/products", False, "Missing 'products' key in response")
            return False
            
        products = data['products']
        
        if len(products) != 12:
            print_test_result("GET /api/products", False, f"Expected 12 products, got {len(products)}")
            return False
            
        # Validate product structure
        required_fields = ['id', 'name', 'description', 'price', 'category', 'image', 'featured']
        for product in products[:2]:  # Check first 2 products
            for field in required_fields:
                if field not in product:
                    print_test_result("GET /api/products", False, f"Missing field '{field}' in product")
                    return False
        
        # Validate categories
        categories = set(product['category'] for product in products)
        expected_categories = {'Pasteles', 'Postres', 'Decoraciones', 'Artesanías'}
        if not expected_categories.issubset(categories):
            print_test_result("GET /api/products", False, f"Missing expected categories. Got: {categories}")
            return False
            
        print_test_result("GET /api/products", True, f"Retrieved {len(products)} products with correct structure")
        return True
        
    except requests.exceptions.RequestException as e:
        print_test_result("GET /api/products", False, f"Request error: {str(e)}")
        return False
    except Exception as e:
        print_test_result("GET /api/products", False, f"Unexpected error: {str(e)}")
        return False

def test_get_featured_products():
    """Test GET /api/products?featured=true - should return only featured products"""
    print("🔍 Testing GET /api/products?featured=true")
    
    try:
        response = requests.get(f"{API_BASE}/products?featured=true", timeout=10)
        
        if response.status_code != 200:
            print_test_result("GET /api/products?featured=true", False, f"Status code: {response.status_code}")
            return False
            
        data = response.json()
        products = data.get('products', [])
        
        if len(products) != 6:
            print_test_result("GET /api/products?featured=true", False, f"Expected 6 featured products, got {len(products)}")
            return False
            
        # Verify all products are featured
        for product in products:
            if not product.get('featured', False):
                print_test_result("GET /api/products?featured=true", False, f"Non-featured product found: {product['name']}")
                return False
                
        print_test_result("GET /api/products?featured=true", True, f"Retrieved {len(products)} featured products")
        return True
        
    except Exception as e:
        print_test_result("GET /api/products?featured=true", False, f"Error: {str(e)}")
        return False

def test_get_products_by_category():
    """Test GET /api/products?category=X for different categories"""
    print("🔍 Testing GET /api/products?category=X")
    
    categories_to_test = ['Pasteles', 'Postres', 'Artesanías', 'Decoraciones']
    all_passed = True
    
    for category in categories_to_test:
        try:
            response = requests.get(f"{API_BASE}/products?category={category}", timeout=10)
            
            if response.status_code != 200:
                print_test_result(f"GET /api/products?category={category}", False, f"Status code: {response.status_code}")
                all_passed = False
                continue
                
            data = response.json()
            products = data.get('products', [])
            
            # Verify all products belong to the requested category
            for product in products:
                if product.get('category') != category:
                    print_test_result(f"GET /api/products?category={category}", False, f"Wrong category product found: {product['category']}")
                    all_passed = False
                    break
            else:
                print_test_result(f"GET /api/products?category={category}", True, f"Retrieved {len(products)} products")
                
        except Exception as e:
            print_test_result(f"GET /api/products?category={category}", False, f"Error: {str(e)}")
            all_passed = False
    
    return all_passed

def test_post_contact_valid():
    """Test POST /api/contact with valid data"""
    print("🔍 Testing POST /api/contact (valid data)")
    
    contact_data = {
        "name": "María González",
        "email": "maria.gonzalez@email.com",
        "phone": "+1234567890",
        "message": "Hola, me interesa un pastel de bodas para 50 personas. ¿Podrían enviarme más información?"
    }
    
    try:
        response = requests.post(
            f"{API_BASE}/contact",
            json=contact_data,
            headers={'Content-Type': 'application/json'},
            timeout=10
        )
        
        if response.status_code != 200:
            print_test_result("POST /api/contact (valid)", False, f"Status code: {response.status_code}, Response: {response.text}")
            return False
            
        data = response.json()
        
        if not data.get('success'):
            print_test_result("POST /api/contact (valid)", False, f"Success flag not true: {data}")
            return False
            
        if 'message' not in data:
            print_test_result("POST /api/contact (valid)", False, "Missing success message")
            return False
            
        print_test_result("POST /api/contact (valid)", True, f"Message: {data['message']}")
        return True
        
    except Exception as e:
        print_test_result("POST /api/contact (valid)", False, f"Error: {str(e)}")
        return False

def test_post_contact_missing_fields():
    """Test POST /api/contact with missing required fields"""
    print("🔍 Testing POST /api/contact (missing required fields)")
    
    test_cases = [
        {"email": "test@email.com", "message": "Test message"},  # Missing name
        {"name": "Test User", "message": "Test message"},        # Missing email
        {"name": "Test User", "email": "test@email.com"},       # Missing message
        {}  # Missing all required fields
    ]
    
    all_passed = True
    
    for i, invalid_data in enumerate(test_cases):
        try:
            response = requests.post(
                f"{API_BASE}/contact",
                json=invalid_data,
                headers={'Content-Type': 'application/json'},
                timeout=10
            )
            
            if response.status_code != 400:
                print_test_result(f"POST /api/contact (invalid case {i+1})", False, f"Expected 400, got {response.status_code}")
                all_passed = False
                continue
                
            data = response.json()
            if 'error' not in data:
                print_test_result(f"POST /api/contact (invalid case {i+1})", False, "Missing error message")
                all_passed = False
                continue
                
            print_test_result(f"POST /api/contact (invalid case {i+1})", True, f"Error: {data['error']}")
            
        except Exception as e:
            print_test_result(f"POST /api/contact (invalid case {i+1})", False, f"Error: {str(e)}")
            all_passed = False
    
    return all_passed

def test_get_contact_messages():
    """Test GET /api/contact-messages"""
    print("🔍 Testing GET /api/contact-messages")
    
    try:
        response = requests.get(f"{API_BASE}/contact-messages", timeout=10)
        
        if response.status_code != 200:
            print_test_result("GET /api/contact-messages", False, f"Status code: {response.status_code}")
            return False
            
        data = response.json()
        
        if 'messages' not in data:
            print_test_result("GET /api/contact-messages", False, "Missing 'messages' key in response")
            return False
            
        messages = data['messages']
        
        # Validate message structure if messages exist
        if messages:
            required_fields = ['id', 'name', 'email', 'message', 'createdAt', 'read']
            for field in required_fields:
                if field not in messages[0]:
                    print_test_result("GET /api/contact-messages", False, f"Missing field '{field}' in message")
                    return False
            
            # Check if messages are sorted by createdAt descending
            if len(messages) > 1:
                for i in range(len(messages) - 1):
                    current_date = datetime.fromisoformat(messages[i]['createdAt'].replace('Z', '+00:00'))
                    next_date = datetime.fromisoformat(messages[i+1]['createdAt'].replace('Z', '+00:00'))
                    if current_date < next_date:
                        print_test_result("GET /api/contact-messages", False, "Messages not sorted by createdAt descending")
                        return False
        
        print_test_result("GET /api/contact-messages", True, f"Retrieved {len(messages)} messages with correct structure")
        return True
        
    except Exception as e:
        print_test_result("GET /api/contact-messages", False, f"Error: {str(e)}")
        return False

def test_mongodb_connection():
    """Test MongoDB connection by making a simple API call"""
    print("🔍 Testing MongoDB connection")
    
    try:
        # Test connection by trying to get products
        response = requests.get(f"{API_BASE}/products", timeout=10)
        
        if response.status_code == 500:
            data = response.json()
            if 'error' in data and 'database' in data['error'].lower():
                print_test_result("MongoDB connection", False, f"Database error: {data['error']}")
                return False
        
        if response.status_code == 200:
            print_test_result("MongoDB connection", True, "Successfully connected to MongoDB")
            return True
        else:
            print_test_result("MongoDB connection", False, f"Unexpected status code: {response.status_code}")
            return False
            
    except Exception as e:
        print_test_result("MongoDB connection", False, f"Error: {str(e)}")
        return False

def run_all_tests():
    """Run all backend API tests"""
    print("=" * 60)
    print("🚀 CREACIONES PRINCESS BACKEND API TESTS")
    print("=" * 60)
    print()
    
    test_results = {}
    
    # Test MongoDB connection first
    test_results['mongodb_connection'] = test_mongodb_connection()
    
    # Test all products endpoint
    test_results['get_all_products'] = test_get_all_products()
    
    # Test featured products
    test_results['get_featured_products'] = test_get_featured_products()
    
    # Test category filtering
    test_results['get_products_by_category'] = test_get_products_by_category()
    
    # Test contact form submission (valid)
    test_results['post_contact_valid'] = test_post_contact_valid()
    
    # Test contact form validation
    test_results['post_contact_validation'] = test_post_contact_missing_fields()
    
    # Test get contact messages
    test_results['get_contact_messages'] = test_get_contact_messages()
    
    # Summary
    print("=" * 60)
    print("📊 TEST SUMMARY")
    print("=" * 60)
    
    passed = sum(1 for result in test_results.values() if result)
    total = len(test_results)
    
    for test_name, result in test_results.items():
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"{status} {test_name.replace('_', ' ').title()}")
    
    print()
    print(f"📈 Overall Result: {passed}/{total} tests passed")
    
    if passed == total:
        print("🎉 All backend API tests PASSED!")
        return True
    else:
        print(f"⚠️  {total - passed} test(s) FAILED")
        return False

if __name__ == "__main__":
    success = run_all_tests()
    exit(0 if success else 1)