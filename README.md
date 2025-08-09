# 🎵 Music Controller

A **Django + React** web application that allows users to create or join music rooms, control Spotify playback, and vote to skip songs — all in real time.

---

## 🚀 Features
- **Room Creation & Joining** – Users can create music rooms with custom settings.
- **Spotify Integration** – Connect your Spotify account to control playback.
- **Voting System** – Guests can vote to skip songs (if allowed by the host).
- **Real-time Updates** – Playback state updates without refreshing the page.
- **Frontend in React** – Modern and responsive UI powered by React.
- **Backend in Django** – REST API for room and music control.

---

## 📂 Project Structure
```
Music_Controller-main/
├── new-folder/music_controller/   # Main Django project
│   ├── api/                       # API app for room management
│   ├── frontend/                  # React frontend
│   ├── spotify/                   # Spotify API integration
│   └── music_controller/          # Django settings and URLs
├── requirements.txt               # Python dependencies
└── README.md                      # Project documentation
```

---

## 🛠 Installation & Setup

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/yourusername/Music_Controller.git
cd Music_Controller-main/new-folder/music_controller
```

### 2️⃣ Install Python Dependencies
Make sure you have Python 3.9+ and pip installed.
```bash
pip install -r requirements.txt
```

### 3️⃣ Set up Spotify Developer Credentials
1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard/).
2. Create a new app and get:
   - **Client ID**
   - **Client Secret**
   - **Redirect URI** (match the one in your Django settings)
3. Add these to your environment variables or `credentials.py`.

### 4️⃣ Run Database Migrations
```bash
python manage.py migrate
```

### 5️⃣ Start the Django Backend
```bash
python manage.py runserver
```

### 6️⃣ Install Frontend Dependencies
```bash
cd frontend
npm install
```

### 7️⃣ Build Frontend
```bash
npm run build
```

---

## 💡 Usage
- Open the app in your browser (`http://127.0.0.1:8000/`).
- Create or join a music room.
- Connect your Spotify account.
- Control playback or vote to skip tracks.


