# Hyderabad Carpool - Beginner-Friendly Carpooling Website

A complete, beginner-friendly carpooling website designed for Hyderabad office commuters to share rides and reduce traffic congestion.

## 🎯 Project Goal

Connect employees from the same office or nearby tech parks who travel in the same direction, helping reduce Hyderabad's traffic problem while saving money and making new connections.

## ✨ Features

- **User Authentication**: Sign up and login with email/password
- **Ride Management**: Add your daily commute route with details
- **Ride Matching**: Find rides matching your route and timing
- **Request System**: Request to join rides, accept/reject requests
- **Women-Only Rides**: Option for women-only rides for safety
- **Responsive Design**: Mobile-friendly modern UI
- **Dashboard**: View your rides, stats, and quick actions
- **Sample Data**: Pre-loaded demo users and rides for testing

## 🛠 Tech Stack

### Backend
- **Node.js** - JavaScript runtime
- **Express** - Web framework for API routes
- **CORS** - Enable cross-origin requests
- **Body Parser** - Parse JSON request bodies
- **In-Memory Storage** - Simple data storage (no database required)

### Frontend
- **React** - UI library for building user interfaces
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client for API calls

## 📁 Project Structure

```
Carpool/
├── backend/
│   ├── data/
│   │   └── dataStore.js          # In-memory data storage with sample data
│   ├── routes/
│   │   ├── auth.js               # Authentication routes (signup, login, logout)
│   │   ├── rides.js              # Ride management routes
│   │   ├── requests.js           # Ride request routes
│   │   └── users.js              # User profile routes
│   ├── package.json              # Backend dependencies
│   └── server.js                 # Main Express server
├── frontend/
│   ├── public/
│   │   └── index.html            # HTML template
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.js         # Navigation bar component
│   │   │   ├── Footer.js         # Footer component
│   │   │   ├── RouteCard.js      # Ride card component
│   │   │   └── Button.js         # Reusable button component
│   │   ├── context/
│   │   │   └── AuthContext.js    # Authentication context provider
│   │   ├── pages/
│   │   │   ├── Home.js           # Landing page
│   │   │   ├── Login.js          # Login page
│   │   │   ├── Signup.js         # Signup page
│   │   │   ├── Dashboard.js      # User dashboard
│   │   │   ├── AddRide.js        # Add new ride form
│   │   │   ├── FindMatches.js    # Find matching rides
│   │   │   └── MyRequests.js     # Manage ride requests
│   │   ├── App.js                # Main app component with routing
│   │   ├── index.css             # Global CSS with Tailwind
│   │   └── index.js              # React entry point
│   ├── package.json              # Frontend dependencies
│   ├── tailwind.config.js        # Tailwind CSS configuration
│   └── postcss.config.js         # PostCSS configuration
└── README.md                     # This file
```

## 🚀 Setup Instructions

### Prerequisites
- Node.js (v14 or higher) installed on your machine
- npm (comes with Node.js)

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install backend dependencies:
```bash
npm install
```

3. Start the backend server:
```bash
npm start
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Open a new terminal and navigate to the frontend directory:
```bash
cd frontend
```

2. Install frontend dependencies:
```bash
npm install
```

3. Start the React development server:
```bash
npm start
```

The frontend will run on `http://localhost:3000`

## 🎮 How to Use

1. **Open the Application**: Go to `http://localhost:3000` in your browser

2. **Sign Up**: Click "Sign Up" and create a new account with:
   - Full name
   - Email address
   - Password
   - Phone number
   - Gender
   - Office location

3. **Login**: Use your credentials to log in

4. **Add a Ride**: Go to "Add Ride" and enter:
   - Start location (e.g., Kukatpally)
   - Destination (e.g., Infosys, Gachibowli)
   - Office name
   - Date and time
   - Available seats
   - Women-only option (optional)

5. **Find Matches**: Go to "Find Matches" to see available rides
   - Search by location
   - Filter by women-only rides
   - Click "Request to Join" on rides you're interested in

6. **Manage Requests**: Go to "My Requests" to:
   - Accept/reject requests for your rides
   - Cancel your pending requests
   - View request status

## 👤 Demo Accounts

Use these pre-configured accounts to test the application:

| Email | Password | Name | Gender | Office |
|-------|----------|------|--------|--------|
| priya@example.com | password123 | Priya Sharma | Female | Infosys, Gachibowli |
| rahul@example.com | password123 | Rahul Kumar | Male | Microsoft, Hyderabad |
| anjali@example.com | password123 | Anjali Reddy | Female | TCS, Gachibowli |

## 📚 Key Files Explained

### Backend Files

- **server.js**: Main entry point. Sets up Express server, middleware, and routes.
- **dataStore.js**: In-memory database. Stores users, rides, requests, and sessions. Includes sample data.
- **routes/auth.js**: Handles signup, login, logout, and session verification.
- **routes/rides.js**: Manages ride creation, retrieval, deletion, and matching.
- **routes/requests.js**: Handles ride requests, acceptance, rejection, and cancellation.
- **routes/users.js**: Provides user profile information.

### Frontend Files

- **App.js**: Main component with React Router setup for page navigation.
- **AuthContext.js**: Provides authentication state (login, logout, user data) to all components.
- **Navbar.js**: Navigation bar with different links based on login status.
- **Footer.js**: Footer with links and future scope information.
- **RouteCard.js**: Reusable component to display ride information in a card format.
- **Button.js**: Reusable button component with different variants.
- **Home.js**: Landing page with hero section, features, and call-to-action.
- **Login.js**: Login form with email and password.
- **Signup.js**: Registration form with user details.
- **Dashboard.js**: User dashboard showing rides, stats, and quick actions.
- **AddRide.js**: Form to create a new ride offering.
- **FindMatches.js**: Page to search and filter available rides.
- **MyRequests.js**: Page to manage sent and received ride requests.

## 🎨 UI Features

- **Modern Design**: Clean, startup-style interface similar to Uber/Ola/LinkedIn
- **Responsive**: Works on desktop, tablet, and mobile devices
- **Color Scheme**: Green (eco-friendly theme) and blue (trust)
- **Avatar Initials**: User profile avatars with initials
- **Route Cards**: Attractive cards displaying ride information
- **Status Badges**: Color-coded status indicators (pending, accepted, rejected)
- **Loading States**: Visual feedback during data fetching
- **Error Handling**: User-friendly error messages

## 🔐 Security Notes

⚠️ **Important**: This is a beginner-friendly demo project. For production use, you must implement:

- Password hashing (bcrypt)
- Secure session management (JWT)
- Input validation and sanitization
- Rate limiting
- HTTPS
- Database (PostgreSQL, MongoDB)
- Environment variables for sensitive data

## 🚀 Future Scope

The following features can be added to make this production-ready:

- **Real Database**: Replace in-memory storage with PostgreSQL or MongoDB
- **GPS Integration**: Real-time location tracking and route optimization
- **Payment System**: In-app payments for ride sharing
- **Rating System**: Rate drivers and passengers
- **Chat System**: In-app messaging between users
- **Push Notifications**: Notify users about ride updates
- **Corporate Partnerships**: Integration with companies for employee carpooling
- **Route Optimization**: AI-powered route suggestions
- **Advanced Filters**: Filter by time, distance, preferences
- **Mobile App**: Native Android and iOS applications

## 🐛 Troubleshooting

**Backend not starting?**
- Ensure Node.js is installed
- Check if port 5000 is already in use
- Run `npm install` in backend directory

**Frontend not starting?**
- Ensure Node.js is installed
- Check if port 3000 is already in use
- Run `npm install` in frontend directory

**CORS errors?**
- Ensure backend is running on port 5000
- Check CORS configuration in server.js

**Data not persisting?**
- This is expected! The project uses in-memory storage
- Data is lost when the server restarts
- For persistence, implement a database

## 📝 Beginner Tips

1. **Start with the backend**: Understand how the API works first
2. **Read the comments**: Every file has detailed comments explaining the code
3. **Test with demo accounts**: Use the provided demo accounts to explore features
4. **Modify sample data**: Edit `dataStore.js` to add your own test data
5. **Check browser console**: Use browser DevTools to debug frontend issues
6. **Use Postman**: Test API endpoints directly with Postman or curl

## 🤝 Contributing

This is a beginner-friendly project. Feel free to:
- Add new features
- Improve the UI
- Fix bugs
- Add more sample data
- Improve documentation

## 📄 License

This project is created for educational purposes. Feel free to use it for learning and development.

## 🙏 Acknowledgments

- Designed for Hyderabad commuters to solve real traffic problems
- Inspired by carpooling platforms like BlaBlaCar, Uber Pool, and Ola Share
- Built with beginner-friendly code and extensive comments

## 🚀 Deploying to Render

### Backend
1. Sign in to Render and create a new **Web Service**.
2. Connect your GitHub repo and choose the `backend` directory.
3. Set the build command to:
   ```bash
   npm install
   ```
4. Set the start command to:
   ```bash
   npm start
   ```
5. Add environment variables in Render:
   - `MONGODB_URI` = your MongoDB Atlas connection string
6. Deploy the service.
7. The backend URL will be something like:
   `https://your-backend-service.onrender.com`

### Frontend
1. Create a new **Static Site** on Render.
2. Connect the same GitHub repo and choose the `frontend` directory.
3. Set the build command to:
   ```bash
   npm install && npm run build
   ```
4. Set the publish directory to:
   ```bash
   build
   ```
5. Add environment variables in Render:
   - `REACT_APP_API_URL` = `https://your-backend-service.onrender.com/api`
6. Deploy the static site.
7. Your frontend URL will be something like:
   `https://your-frontend-service.onrender.com`

### Notes
- Use MongoDB Atlas for your database and keep credentials secret.
- Render handles HTTPS automatically.
- The frontend now reads the backend host from `REACT_APP_API_URL`.

---

**Happy Coding! 🚗💨**

If you have any questions or need help, feel free to explore the code - it's designed to be easy to understand!
