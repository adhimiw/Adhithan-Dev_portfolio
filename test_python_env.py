"""
Test Python Environment
Purpose: Verify that all required packages are installed
"""

import sys
import importlib.util

def check_package(package_name):
    """Check if a package is installed"""
    spec = importlib.util.find_spec(package_name)
    if spec is None:
        print(f"❌ {package_name} is NOT installed")
        return False
    else:
        print(f"✅ {package_name} is installed")
        return True

def main():
    """Check all required packages"""
    print(f"Python version: {sys.version}")
    print("\nChecking required packages:")
    
    required_packages = [
        "google.generativeai",
        "pymongo",
        "dotenv"
    ]
    
    all_installed = True
    for package in required_packages:
        if not check_package(package):
            all_installed = False
    
    if all_installed:
        print("\nAll required packages are installed! 🎉")
    else:
        print("\nSome packages are missing. Please install them with:")
        print("pip install google-generativeai pymongo python-dotenv")

if __name__ == "__main__":
    main()
