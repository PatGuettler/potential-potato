from flask import Flask, request, jsonify, session
from flask_session import Session
from flask_cors import CORS
import os
from pathlib import Path
import bcrypt
from dotenv import load_dotenv
import tempfile

# Load environment variables
load_dotenv()

# Import API blueprints (we'll create these)
from api.auth import auth_bp
from api.lessons import lessons_bp
from api.progress import progress_bp
from api.admin import admin_bp

def create_app():
    app = Flask(__name__)
    
    # Configuration
    app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'dev-secret-change-in-production')
    app.config['SESSION_TYPE'] = 'filesystem'
    app.config['SESSION_FILE_DIR'] = tempfile.mkdtemp()
    app.config['SESSION_PERMANENT'] = False
    app.config['SESSION_USE_SIGNER'] = True
    app.config['SESSION_COOKIE_SAMESITE'] = 'Lax'
    app.config['SESSION_COOKIE_SECURE'] = False  # Set to True in production with HTTPS
    
    # Initialize extensions
    Session(app)
    
    # CORS configuration for local development and replit.dev
    cors_origins = [
        'http://localhost:5173', 
        'http://127.0.0.1:5173',
        'https://*.replit.dev',
        'https://*.repl.co'
    ]
    
    CORS(app, 
         origins=cors_origins,
         supports_credentials=True,
         allow_headers=['Content-Type', 'Authorization'],
         methods=['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'])
    
    # Health check endpoint
    @app.route('/health')
    def health():
        return {'status': 'ok'}, 200
    
    # Register API blueprints
    app.register_blueprint(auth_bp, url_prefix='/api')
    app.register_blueprint(lessons_bp, url_prefix='/api')
    app.register_blueprint(progress_bp, url_prefix='/api')
    app.register_blueprint(admin_bp, url_prefix='/api/admin')
    
    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True, host='0.0.0.0', port=8000)