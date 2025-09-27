from flask import request, jsonify
from datetime import datetime
from src.Utils.Database import db
from src.Model.Company import create_company
from src.Model.User import create_user

def register_user():
    """
    Called after successful Clerk signup.
    Expects: name, email, company_name (from frontend).
    """
    print("New user registration route called")
    data = request.get_json()
    name = data.get("name")
    email = data.get("email")
    company_name = data.get("company_name")
    role = data.get("role", "hr")

    if not name or not email or not company_name:
        return jsonify({"error": "Missing required fields"}), 400

    # 1. Check if company already exists
    company = db.companies.find_one({"name": company_name})
    if not company:
        # Create new company
        company = create_company(company_name)
        result = db.companies.insert_one(company)
        company["_id"] = result.inserted_id
        print(f"Created new company: {company_name}")

    company_id = str(company["_id"])

    # 2. Check if user already exists
    existing_user = db.users.find_one({"email": email})
    if existing_user:
        # Convert ObjectId to string for JSON serialization
        existing_user["_id"] = str(existing_user["_id"])
        existing_user["company_id"] = str(existing_user["company_id"])
        return jsonify({"message": "User already exists", "user": existing_user}), 200

    # 3. Create new user
    user = create_user(name=name, email=email, company_id=company_id, role=role)
    result = db.users.insert_one(user)
    user["_id"] = str(result.inserted_id)
    user["company_id"] = company_id  # keep as string

    # Convert company _id to string for response
    company["_id"] = company_id

    return jsonify({
        "message": "User registered successfully",
        "user": user,
        "company": company
    }), 201

# Login controller
def login_user():
    """
    Called when user tries to log in.
    Expects: email (required), name, company_name, role (default 'hr').
    """
    print("Login route called")
    data = request.get_json()
    email = data.get("email")
    name = data.get("name")  # not strictly needed, but frontend sends it
    company_name = data.get("company_name")
    role = data.get("role", "hr")

    if not email:
        return jsonify({"error": "Email is required"}), 400

    # 1. Find user by email
    user = db.users.find_one({"email": email})
    if not user:
        return jsonify({"error": "User not found. Please register first."}), 404

    # Convert ObjectId to string for JSON response
    user["_id"] = str(user["_id"])
    user["company_id"] = str(user["company_id"])

    # 2. Get company details
    company = db.companies.find_one({"_id": db.to_object_id(user["company_id"])})

    if company:
        company["_id"] = str(company["_id"])

    return jsonify({
        "message": "Login successful",
        "user": user,
        "company": company
    }), 200