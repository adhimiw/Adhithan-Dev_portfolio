"""
Test MongoDB Connection
Purpose: Verify connection to MongoDB Atlas and list available collections
"""

import os
import sys
from pymongo import MongoClient
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Get MongoDB connection string
MONGO_URI = os.getenv("MONGO_URI")
if not MONGO_URI:
    print("Error: MONGO_URI environment variable not set.")
    print("Please create a .env file with your MongoDB connection string.")
    sys.exit(1)

def test_connection():
    """Test connection to MongoDB Atlas and list collections"""
    try:
        # Connect to MongoDB
        print(f"Connecting to MongoDB...")
        client = MongoClient(MONGO_URI)
        
        # Get database
        db = client.get_database()
        print(f"Connected to database: {db.name}")
        
        # List collections
        collections = db.list_collection_names()
        print(f"\nAvailable collections:")
        for collection in collections:
            count = db[collection].count_documents({})
            print(f"- {collection}: {count} documents")
        
        # Sample data from each collection
        print("\nSample data from collections:")
        for collection in collections:
            sample = db[collection].find_one()
            if sample:
                # Remove _id field for cleaner output
                if "_id" in sample:
                    del sample["_id"]
                print(f"\n{collection} sample:")
                # Print only first few fields to avoid overwhelming output
                sample_preview = dict(list(sample.items())[:3])
                print(f"{sample_preview}...")
            else:
                print(f"\n{collection} is empty")
        
        print("\nConnection test successful!")
        return True
        
    except Exception as e:
        print(f"Error connecting to MongoDB: {e}")
        return False

if __name__ == "__main__":
    test_connection()
