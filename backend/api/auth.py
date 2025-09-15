from flask import Blueprint, request, jsonify, session
import bcrypt
from pathlib import Path
import json
from services.csv_store import JSONStore
import uuid

auth_bp = Blueprint('auth', __name__)
json_store = JSONStore('.')

@auth_bp.route('/auth/user', methods=['GET'])
def get_current_user():
    """Get current authenticated user"""
    if 'user_id' not in session:
        return jsonify({'message': 'Unauthorized'}), 401
    
    users_data = json_store.read_json('users.json')
    users_list = users_data.get('users', [])
    
    # Find user by stored user_id (which is actually the username)
    user = None
    for user_data in users_list:
        if user_data.get('username') == session['user_id']:
            user = user_data
            break
    
    if not user:
        return jsonify({'message': 'User not found'}), 404
    
    # Remove password from response
    safe_user = {k: v for k, v in user.items() if k != 'password'}
    return jsonify(safe_user)

@auth_bp.route('/auth/setup-needed', methods=['GET'])
def setup_needed():
    """Check if initial setup is needed (no users exist)"""
    users_data = json_store.read_json('users.json')
    users_list = users_data.get('users', [])
    return jsonify({'setupNeeded': len(users_list) == 0})

@auth_bp.route('/login', methods=['POST'])
def login():
    """Authenticate user with username and password"""
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    
    if not username or not password:
        return jsonify({'message': 'Username and password required'}), 400
    
    users_data = json_store.read_json('users.json')
    users_list = users_data.get('users', [])
    
    # Find user by username
    user = None
    for user_data in users_list:
        if user_data.get('username') == username:
            user = user_data
            break
    
    if not user:
        return jsonify({'message': 'Invalid credentials'}), 401
    
    # Verify password
    stored_password = user.get('password', '')
    if isinstance(stored_password, str):
        stored_password = stored_password.encode('utf-8')
    
    if isinstance(password, str):
        password = password.encode('utf-8')
    
    try:
        if not bcrypt.checkpw(password, stored_password):
            return jsonify({'message': 'Invalid credentials'}), 401
    except (ValueError, TypeError):
        return jsonify({'message': 'Invalid credentials'}), 401
    
    # Create session
    session.clear()  # Clear any existing session data
    session['user_id'] = user.get('username')  # Store username as user_id for consistency
    session['username'] = user.get('username')
    session['role'] = user.get('role', 'student')
    
    return jsonify({'message': 'Login successful', 'user': {k: v for k, v in user.items() if k != 'password'}})

@auth_bp.route('/register', methods=['POST'])
def register():
    """Register new user account"""
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    role = data.get('role', 'student')
    email = data.get('email', '')
    first_name = data.get('firstName', '')
    last_name = data.get('lastName', '')
    
    if not username or not password:
        return jsonify({'message': 'Username and password required'}), 400
    
    if role not in ['student', 'teacher', 'admin']:
        return jsonify({'message': 'Invalid role'}), 400
    
    users_data = json_store.read_json('users.json')
    users_list = users_data.get('users', [])
    
    # Check if username already exists
    for user_data in users_list:
        if user_data.get('username') == username:
            return jsonify({'message': 'Username already exists'}), 409
    
    # Hash password
    if isinstance(password, str):
        password = password.encode('utf-8')
    hashed_password = bcrypt.hashpw(password, bcrypt.gensalt())
    
    # Create new user
    new_user = {
        'username': username,
        'password': hashed_password.decode('utf-8'),
        'role': role,
        'email': email,
        'firstName': first_name,
        'lastName': last_name,
        'createdAt': json_store.get_timestamp()
    }
    
    # Add user to data
    if 'users' not in users_data:
        users_data['users'] = []
    users_data['users'].append(new_user)
    users_data['lastModified'] = json_store.get_timestamp()
    json_store.write_json('users.json', users_data)
    
    # Auto-login the new user
    session.clear()  # Clear any existing session data
    session['user_id'] = username  # Store username as user_id for consistency
    session['username'] = username
    session['role'] = role
    
    return jsonify({'message': 'Account created successfully', 'user': {k: v for k, v in new_user.items() if k != 'password'}})

@auth_bp.route('/logout', methods=['POST'])
def logout():
    """Logout current user"""
    session.clear()
    return jsonify({'message': 'Logged out successfully'})