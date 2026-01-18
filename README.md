# Hotel Room Booking System

A fullstack hotel management application built with Node.js backend and React frontend for efficient room booking and management.

## 🚀 Features

- **Real-time Room Management**: Visual hotel layout with floor-wise room display
- **Smart Room Selection**: Automatic optimal room assignment based on travel time
- **Interactive Booking**: Easy-to-use booking form with guest management
- **Search & Filter**: Search rooms by floor and filter available rooms
- **Recent Activity**: Track all bookings with search functionality
- **Admin Controls**: Generate random occupancy and reset bookings

## 🛠️ Tech Stack

**Frontend:**
- React 18
- Material-UI (MUI)
- JavaScript ES6+

**Backend:**
- Node.js
- Express.js
- CORS enabled
- In-memory data storage

## 📋 Prerequisites

- Node.js (v14 or higher)
- npm or yarn package manager

## 🔧 Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/hotel-room-booking-system.git
cd hotel-room-booking-system
```

### 2. Install Dependencies
```bash
# Install all dependencies (backend + frontend)
npm run install-all
```

### 3. Start the Application
```bash
# Start both servers concurrently
npm run dev
```

**Or run separately:**
```bash
# Terminal 1 - Backend (Port 5000)
npm run start-backend

# Terminal 2 - Frontend (Port 3000)  
npm run start-frontend
```

## 🌐 Access the Application

**Live Application:**
- **Frontend**: https://frontend-murex-sigma.vercel.app
- **Backend API**: https://unstop-production.up.railway.app/api

**Local Development:**
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000

## 🔐 Login Credentials

```
Username: admin
Password: password
```

## 📖 How to Use

### 1. Login
- Use the credentials above to access the system

### 2. Book Rooms
- Enter guest name and number of rooms needed
- System automatically selects optimal rooms to minimize travel time
- Click "Book Rooms" to confirm

### 3. View Hotel Layout
- Visual representation of all floors (1-10)
- Green: Available rooms
- Red: Booked rooms  
- Orange: Currently selected rooms
- Use search to jump to specific floors

### 4. Manage Bookings
- View recent activity in the sidebar
- Search bookings by room number
- See travel time estimates for each booking

### 5. Admin Functions
- **Generate Random Occupancy**: Simulate random bookings
- **Reset All Bookings**: Clear all bookings and make rooms available

## 🏗️ Project Structure

```
unstop/
├── backend/
│   ├── controllers/     # Route handlers
│   ├── models/         # Data models
│   ├── routes/         # API routes
│   ├── services/       # Business logic
│   └── server.js       # Entry point
├── frontend/
│   ├── src/
│   │   ├── components/ # React components
│   │   ├── helpers/    # Utility functions
│   │   └── services/   # API calls
│   └── public/
└── package.json        # Root package file
```

## 🔄 Available Scripts

```bash
npm run install-all     # Install all dependencies
npm run dev            # Start both servers
npm run start-backend  # Start backend only
npm run start-frontend # Start frontend only
```

## 🏨 Hotel Configuration

- **Floors 1-9**: 10 rooms each (101-110, 201-210, etc.)
- **Floor 10**: 7 rooms (1001-1007)
- **Total Rooms**: 97 rooms
- **Room Numbering**: Floor × 100 + Room Position

## 🎯 Key Features Explained

### Smart Room Assignment
- Prioritizes rooms on the same floor
- Minimizes travel time between rooms
- Considers vertical and horizontal distances

### Travel Time Calculation
- Base time: 1 minute per room
- Additional time for floor changes
- Range display for multiple rooms (e.g., "1-3m")

### Real-time Updates
- Instant room availability updates
- Live booking status changes
- Synchronized frontend-backend state

## 🚀 Deployment

For production deployment:

1. **Backend**: Deploy to Railway, Render, or Heroku
2. **Frontend**: Deploy to Vercel, Netlify, or GitHub Pages
3. **Update API URL**: Change `API_BASE` in `frontend/src/services/api.js`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 📞 Support

For issues or questions, please create an issue in the repository.

---

**Happy Booking! 🏨✨**