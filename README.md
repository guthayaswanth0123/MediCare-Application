# 🏥 MediCare - Healthcare Appointment Booking System

Welcome to **MediCare**, a modern, full-stack healthcare appointment booking system perfectly configured and customized by **Gutha Yaswanth**.

This project connects patients, doctors, and clinic administrators via three dedicated applications:
- **Frontend (Patients):** The public face for patients to browse and book doctors.
- **Admin Panel:** An internal dashboard to manage users, doctors, and services.
- **Backend (Server):** A secure REST API handling all logic, databases, and third-party integrations.

---

## 🚀 Tech Stack
- **Frontend / Admin:** React.js, Vite, TailwindCSS
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **File Storage:** Cloudinary
- **Authentication:** Clerk Auth
- **Payments:** Stripe

---

## 🔑 Environment Variables Setup (.env Files)

To run this project on any system, you **must** create three separate `.env` files in their respective folders. Below is the exact blueprint of what goes inside each one:

### 1️⃣ Backend (`backend/.env`)
Create a file named `.env` inside the `backend` folder and add these details:
```env
# MongoDB Connection String
MONGO_URI=mongodb+srv://<your_db_username>:<your_db_password>@<your_cluster_url>/DOCTOR_APPOINTMENT

# Cloudinary (Image Storage) 
CLOUDINARY_CLOUD_NAME=<your_cloudinary_cloud_name>
CLOUDINARY_API_KEY=<your_cloudinary_api_key>
CLOUDINARY_API_SECRET=<your_cloudinary_api_secret>

# Clerk Authentication (Get this from Clerk Dashboard)
CLERK_PUBLISHABLE_KEY=<your_clerk_publishable_key>
CLERK_SECRET_KEY=<your_clerk_secret_key>

# Stripe (Keys for Testing Payments)
STRIPE_SECRET_KEY=<your_stripe_secret_key>

# Security Details
JWT_SECRET=<your_secure_jwt_secret_here>
FRONTEND_URL=http://localhost:5173
```

### 2️⃣ Frontend (`frontend/.env`)
Create a file named `.env` inside the `frontend` folder:
```env
# Clerk Publishable Key (Must match the backend exactly)
VITE_CLERK_PUBLISHABLE_KEY=<your_clerk_publishable_key>

# Link to your local backend server
VITE_API_URL=http://localhost:4000
```

### 3️⃣ Admin Panel (`admin/.env`)
Create a file named `.env` inside the `admin` folder:
```env
# Link to your local backend server
VITE_API_URL=http://localhost:4000

# Clerk Publishable Key (Must match the backend exactly)
VITE_CLERK_PUBLISHABLE_KEY=<your_clerk_publishable_key>
```

---

## 💻 How to Install & Run the Project

Because this project is split into three parts, you will need **three separate terminal windows** open at the same time.

### Step 1: Start the Backend (API Server)
1. Open a terminal and navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the server (it will run on `http://localhost:4000`):
   ```bash
   npm run dev
   ```

### Step 2: Start the Frontend (Patient Website)
1. Open a **second manual terminal** and navigate to the frontend folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the website (it will run on `http://localhost:5173`):
   ```bash
   npm run dev
   ```

### Step 3: Start the Admin Panel (Management Dashboard)
1. Open a **third manual terminal** and navigate to the admin folder:
   ```bash
   cd admin
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the dashboard (it usually runs on `http://localhost:5174` or `5175`):
   ```bash
   npm run dev
   ```

---

## 👨‍💻 Developer & Author
**Gutha Yaswanth**
- **Location:** Nellore, Chejarala, Andhra Pradesh
- **Phone:** +91 7816011442
- **Email:** guthayaswanth@gmail.com
- **LinkedIn:** [guthayaswanth28](https://www.linkedin.com/in/guthayaswanth28/)
- **GitHub:** [guthayaswanth0123](https://github.com/guthayaswanth0123)
