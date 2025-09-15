#!/usr/bin/env python3

from app import create_app
import os

if __name__ == '__main__':
    app = create_app()
    
    port = int(os.environ.get('PORT', 8000))
    
    print(f"🚀 STEM Academy Flask Backend starting on http://localhost:{port}")
    
    app.run(debug=True, host='0.0.0.0', port=port)