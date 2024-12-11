# Real-Time-Event-Ticketing-System

## Introduction

The Real-Time Ticketing App is a web application built using the MERN stack (MongoDB, Express.js, React, Node.js). The system allows two types of users: **Sellers** and **Customers**.

- **Sellers** can:
  - Add, edit, and delete events.
  - Manage ticket availability by adding, editing, or deleting tickets for their events.
  
- **Customers** can:
  - Search for events.
  - Purchase tickets for available events.

This app aims to provide a seamless real-time ticketing experience where customers can easily find and buy tickets, while sellers can manage events and tickets effortlessly.

## Setup Instructions

### Prerequisites

Ensure you have the following installed before setting up the project:

- **Node.js** (v14 or higher)  
  [Download Node.js](https://nodejs.org/)
  
- **MongoDB**  
  You can either run a local MongoDB instance or use a cloud solution like [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).

- **NPM** (comes with Node.js)

### How to Build and Run the Application

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/real-time-ticketing-app.git
   cd real-time-ticketing-app
   ```

2. **Install backend dependencies**:
   - Navigate to the server folder (where the backend code is located):
     ```bash
     cd server
     ```
   - Install the necessary dependencies:
     ```bash
     npm install
     ```

3. **Configure Environment Variables**:
   - Create a `.env` file in the `server` folder.
   - Add the following variables:
     ```env
     MONGO_URI=<your_mongodb_connection_string>
     JWT_SECRET=<your_jwt_secret_key>
     PORT=5000
     ```

4. **Run the backend**:
   - Start the server:
     ```bash
     npm start
     ```

5. **Install frontend dependencies**:
   - Navigate to the client folder (where the frontend code is located):
     ```bash
     cd client
     ```
   - Install the necessary dependencies:
     ```bash
     npm install
     ```

6. **Run the frontend**:
   - Start the frontend server:
     ```bash
     npm start
     ```

The frontend should now be running at `http://localhost:3000`, and the backend will be running on `http://localhost:5000`.

## Usage Instructions

### How to Configure and Start the System

1. **Seller User:**
   - After logging in as a seller, you can:
     - **Add Events**: Click on "Add Event" to create a new event.
     - **Edit/Delete Events**: Select an event from your dashboard and choose to edit or delete it.
     - **Add Tickets**: After creating an event, you can add tickets for it.
     - **Edit/Delete Tickets**: Modify or remove tickets for an existing event.

2. **Customer User:**
   - As a customer, you can:
     - **Search Events**: Use the search bar to filter events by name, date, or location.
     - **Buy Tickets**: Once you find an event, click "Buy Tickets" to purchase a ticket.
     
### UI Control Explanation

- **Seller Dashboard**:
  - **Add Event** button: Opens a form to create a new event.
  - **Event List**: Displays all events added by the seller with options to edit or delete.
  - **Ticket Management**: For each event, you can add, edit, or delete tickets.

- **Customer Dashboard**:
  - **Search Bar**: Allows customers to search for events by keywords.
  - **Event Listings**: Displays available events with "Buy Tickets" options.
  - **Ticket Purchase**: After selecting an event, a ticket purchase option appears.

