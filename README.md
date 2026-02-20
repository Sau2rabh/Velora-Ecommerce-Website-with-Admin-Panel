# Velora E-Commerce Platform

A production-ready MERN stack E-Commerce application with modern UI and robust features.

## Tech Stack

- **Frontend:** React (Vite), Tailwind CSS, Framer Motion, Axios, Lucide React
- **Backend:** Node.js, Express.js, Mongoose, JWT, BcryptJS
- **Database:** MongoDB

## Getting Started

### Prerequisites

- Node.js (v14+)
- MongoDB (Local or Atlas URI)

### Installation

1.  **Clone the repository** (if applicable)

2.  **Install Dependencies**

    ```bash
    # Install server dependencies
    cd server
    npm install

    # Install client dependencies
    cd ../client
    npm install
    ```

3.  **Environment Configuration**

    Create a `.env` file in the `server` directory:

    ```env
    NODE_ENV=development
    PORT=5000
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret
    ```

### Running the App

1.  **Seed the Database** (Optional)

    Populate the database with sample users and products.

    ```bash
    cd server
    npm run data:import
    ```

    *Default Admin Credentials:*
    - Email: `admin@example.com`
    - Password: `123456`

2.  **Start the Server**

    ```bash
    cd server
    npm start
    ```
    Runs on http://localhost:5000

3.  **Start the Client**

    ```bash
    cd client
    npm run dev
    ```
    Runs on http://localhost:5173

## Features

- **Authentication:** User registration and login with JWT.
- **Product Management:** Admin can view, delete products.
- **Shopping Cart:** Full cart functionality (Persistent local storage).
- **Responsive Design:** Optimized for mobile and desktop.
- **Animations:** Smooth page transitions and hover effects.

## Deployment

### Backend (Render)
1. Connect GitHub repo to Render.
2. Set `Root Directory` to `server`.
3. Set `Build Command` to `npm install`.
4. Set `Start Command` to `node server.js`.
5. Add Environment Variables.

### Frontend (Vercel)
1. Connect GitHub repo to Vercel.
2. Set `Root Directory` to `client`.
3. Deploy.

## License

MIT
