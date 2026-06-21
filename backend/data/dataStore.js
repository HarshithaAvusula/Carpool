/**
 * In-Memory Data Store
 * This file stores all application data in memory
 * In a real application, this would be replaced with a database like MongoDB or PostgreSQL
 * Data will be lost when server restarts, which is fine for this demo project
 */

// Sample users data - Pre-loaded with some demo users
let users = [
  {
    id: 1,
    name: 'Priya Sharma',
    email: 'priya@example.com',
    password: 'password123',
    phone: '9876543210',
    gender: 'female',
    office: 'Infosys, Gachibowli',
    avatar: 'PS'
  },
  {
    id: 2,
    name: 'Rahul Kumar',
    email: 'rahul@example.com',
    password: 'password123',
    phone: '9876543211',
    gender: 'male',
    office: 'Microsoft, Hyderabad',
    avatar: 'RK'
  },
  {
    id: 3,
    name: 'Anjali Reddy',
    email: 'anjali@example.com',
    password: 'password123',
    phone: '9876543212',
    gender: 'female',
    office: 'TCS, Gachibowli',
    avatar: 'AR'
  }
];

// Sample rides data - Pre-loaded with some demo rides
let rides = [
  {
    id: 1,
    userId: 1,
    driverName: 'Priya Sharma',
    startLocation: 'Kukatpally',
    destination: 'Infosys, Gachibowli',
    viaRoute: 'KPHB → Miyapur → JNTU → Hitech City → Gachibowli',
    office: 'Infosys, Gachibowli',
    time: '08:30',
    date: '2024-01-15',
    availableSeats: 3,
    womenOnly: true,
    status: 'active',
    avatar: 'PS'
  },
  {
    id: 2,
    userId: 2,
    driverName: 'Rahul Kumar',
    startLocation: 'Madhapur',
    destination: 'Microsoft, Hyderabad',
    viaRoute: 'Madhapur → DLF → Gachibowli → Financial District',
    office: 'Microsoft, Hyderabad',
    time: '09:00',
    date: '2024-01-15',
    availableSeats: 2,
    womenOnly: false,
    status: 'active',
    avatar: 'RK'
  },
  {
    id: 3,
    userId: 3,
    driverName: 'Anjali Reddy',
    startLocation: 'Secunderabad',
    destination: 'TCS, Gachibowli',
    viaRoute: 'Secunderabad → Paradise → Begumpet → Punjagutta → Gachibowli',
    office: 'TCS, Gachibowli',
    time: '08:45',
    date: '2024-01-15',
    availableSeats: 4,
    womenOnly: false,
    status: 'active',
    avatar: 'AR'
  }
];

// Ride requests data - Stores requests to join rides
let requests = [];

// Session storage for logged-in users (simple session management)
let sessions = {};

// Export all data stores and helper functions
module.exports = {
  users,
  rides,
  requests,
  sessions,
  
  // Helper function to generate unique ID
  generateId: (array) => {
    if (array.length === 0) return 1;
    return Math.max(...array.map(item => item.id)) + 1;
  },
  
  // Helper function to get avatar initials from name
  getAvatarInitials: (name) => {
    const words = name.split(' ');
    if (words.length >= 2) {
      return (words[0][0] + words[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  }
};
