#!/usr/bin/env python3
"""
STEM Academy Flask Backend
Run with: python run.py
"""

from app import create_app
import os

if __name__ == '__main__':
    app = create_app()
    
    # Get port from environment or default to 8000
    port = int(os.environ.get('PORT', 8000))
    
    print(f"🚀 STEM Academy Flask Backend starting on http://localhost:{port}")
    print("📚 CSV-based lesson storage system")
    print("🔐 File-based authentication")
    print("📊 Local progress tracking")
    print("---")
    print("Press Ctrl+C to stop the server")
    
    app.run(debug=True, host='0.0.0.0', port=port)