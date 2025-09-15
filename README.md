# STEM Academy - Standalone Educational Platform

A completely self-contained STEM education platform that runs locally with CSV-based data storage. No databases or external services required!

## 🎯 Features

- **File-based Authentication** - User accounts stored in local JSON files
- **CSV Lesson Storage** - Lessons organized by category in CSV files
- **Progress Tracking** - Student progress saved to local CSV files
- **Role-based Access** - Student, Teacher, and Admin roles
- **Offline Capable** - Works without internet connection
- **Cross-platform** - Runs on Windows, macOS, and Linux

## 📁 Project Structure

```
stem-academy/
├── backend/                 # Python Flask API server
│   ├── api/                # API endpoints
│   │   ├── auth.py         # Authentication routes
│   │   ├── lessons.py      # Lesson management
│   │   ├── progress.py     # Progress tracking
│   │   └── admin.py        # Admin functions
│   ├── services/           # Utility services
│   │   └── csv_store.py    # CSV file operations
│   ├── app.py              # Flask app configuration
│   ├── run.py              # Server startup script
│   └── requirements.txt    # Python dependencies
├── client/                 # React frontend
│   ├── src/                # Source code
│   └── .env                # Frontend configuration
├── data/                   # Local data storage
│   ├── lessons/            # CSV files by category
│   │   ├── science.csv     # Science lessons
│   │   ├── technology.csv  # Technology lessons
│   │   ├── engineering.csv # Engineering lessons
│   │   └── mathematics.csv # Mathematics lessons
│   ├── progress/           # User progress data
│   │   └── progress.csv    # Student lesson progress
│   └── permissions/        # Access control data
├── users.json              # User account storage
└── README.md              # This file
```

## 🚀 Installation & Setup

### Prerequisites

- **Node.js** 18+ ([Download](https://nodejs.org/))
- **Python** 3.8+ ([Download](https://python.org/downloads/))
- **npm** (comes with Node.js)
- **pip** (comes with Python)

### Windows Installation

1. **Clone or download this project**
   ```bash
   # If you have git
   git clone <repository-url>
   cd stem-academy
   
   # Or download and extract the ZIP file
   ```

2. **Install Python dependencies**
   ```bash
   cd backend
   pip install -r requirements.txt
   cd ..
   ```

3. **Install Node.js dependencies**
   ```bash
   cd client
   npm install
   cd ..
   ```

### Linux/macOS Installation

1. **Clone or download this project**
   ```bash
   # If you have git
   git clone <repository-url>
   cd stem-academy
   
   # Or download and extract the ZIP file
   ```

2. **Install Python dependencies**
   ```bash
   cd backend
   python3 -m pip install -r requirements.txt
   cd ..
   ```

3. **Install Node.js dependencies**
   ```bash
   cd client
   npm install
   cd ..
   ```

## 🏃 Running the Application

You need to run both the backend (Python Flask) and frontend (React) servers.

### Option 1: Two Terminal Approach (Recommended)

**Terminal 1 - Start the Backend Server:**
```bash
# Windows
cd backend
python run.py

# Linux/macOS
cd backend
python3 run.py
```

The Flask backend will start on `http://localhost:8000`

**Terminal 2 - Start the Frontend Server:**
```bash
cd client
npm run dev
```

The React frontend will start on `http://localhost:5173`

### Option 2: Background Process (Advanced)

**Windows:**
```bash
# Start backend in background
cd backend
start /B python run.py

# Start frontend
cd ../client
npm run dev
```

**Linux/macOS:**
```bash
# Start backend in background
cd backend
python3 run.py &

# Start frontend
cd ../client
npm run dev
```

### 🌐 Access the Application

Open your web browser and go to: **http://localhost:5173**

The React frontend automatically connects to the Flask backend at `http://localhost:8000`

## 👥 First Time Setup

1. **Open the application** in your browser
2. **Click "Create Account"** - You'll be the first user!
3. **Choose your role:**
   - **Student** - Access lessons and track progress
   - **Teacher** - Manage classrooms and student permissions  
   - **Admin** - Full access including lesson creation
4. **Start exploring** the STEM categories!

## 📚 Using the Platform

### For Students
- Browse lessons by category (Science, Technology, Engineering, Mathematics)
- Complete lessons and track your progress
- View your learning statistics on the dashboard

### For Teachers
- Access all student features
- Manage classroom assignments
- View student progress reports

### For Administrators
- Access all features
- Create and edit lessons
- Manage user accounts
- Add new educational content

## 📊 Data Storage

All data is stored locally in your project directory:

- **User Accounts**: `users.json` (encrypted passwords)
- **Lessons**: `data/lessons/*.csv` (one file per category)
- **Progress**: `data/progress/progress.csv` (student completion data)
- **Permissions**: `data/permissions/` (access control)

### Backing Up Your Data

Simply copy the entire project folder to backup all user accounts, lessons, and progress data.

## 🛠️ Customization

### Adding New Lessons (Via Web Interface)
1. Login as an Admin user
2. Go to "Create Lesson" in the sidebar
3. Fill in lesson details and content
4. Lesson automatically saved to appropriate CSV file

### Adding New Lessons (Manual CSV Edit)
Edit the appropriate CSV file in `data/lessons/`:
- `science.csv` - Physics, Chemistry, Biology lessons
- `technology.csv` - Programming, Web Development, AI lessons  
- `engineering.csv` - Design, Robotics, Structures lessons
- `mathematics.csv` - Algebra, Geometry, Statistics lessons

### Changing Ports
- **Backend Port**: Set `PORT` environment variable or edit `backend/run.py`
- **Frontend Port**: Edit `vite.config.ts` or use `npm run dev -- --port 3000`

## 🔧 Troubleshooting

### Common Issues

**"Module not found" errors:**
```bash
# Reinstall Python dependencies
cd backend
pip install -r requirements.txt

# Reinstall Node dependencies
cd client
npm install
```

**"Port already in use" errors:**
- Kill processes using the ports: `taskkill /F /IM node.exe` (Windows) or `killall node` (Linux/macOS)
- Or change ports in configuration files

**"Permission denied" errors:**
- Windows: Run terminal as Administrator
- Linux/macOS: Use `sudo` if needed

**CSV file errors:**
- Check that `data/` directory exists with proper structure
- Verify CSV files have proper headers
- Ensure write permissions on data directory

### Getting Help

1. Check that both servers are running (Flask on :8000, React on :5173)
2. Verify all dependencies are installed
3. Check browser console for errors (F12)
4. Look at terminal output for error messages

## 🔐 Security Notes

- This is designed for local/educational use
- User passwords are properly hashed with bcrypt
- No external network dependencies
- All data stays on your local machine

## 📋 System Requirements

- **RAM**: 2GB minimum, 4GB recommended  
- **Storage**: 500MB for application, additional space for lesson content
- **OS**: Windows 10+, macOS 10.14+, or Linux with Node.js support

## 🚫 What This App Does NOT Need

- ❌ Internet connection (after initial setup)
- ❌ Database servers (PostgreSQL, MySQL, etc.)
- ❌ Cloud services or external APIs
- ❌ Docker or containerization
- ❌ Complex deployment procedures

## 📝 License

This project is for educational use. Feel free to modify and extend it for your learning needs!

---

**Happy Learning! 🎓✨**