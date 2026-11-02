# 🎓 VignanConnect — VFSTR University Issue Reporting & Campus Utility Portal

> **Designed for: Vignan's Foundation for Science, Technology & Research (Deemed to be University)**  
> **Location:** Vadlamudi, Chebrolu Mandal, Guntur District, Andhra Pradesh - 522213  
> **Stack:** MERN Stack (MongoDB, Express.js, React 18, Node.js, Tailwind CSS)  
> **Format:** 1-Day University Project Exhibition Working Prototype

---

## 🌟 Overview

**VignanConnect** is a centralized, full-stack campus utility web portal built specifically for the **Vignan University (VFSTR Vadlamudi, Guntur)** campus. It bridges the communication gap between university students and campus administrative wings (Dean of Student Affairs & Estate Maintenance Office).

Students across **Aryabhata Block (A-Block)**, **Visvesvaraya Block (V-Block)**, **U-Block (CCF)**, **Dr. K. L. Rao Central Library**, and **Vignan Hostels (Vasishta & Priyamvada)** can report campus faults, locate lost belongings, and view official administration bulletins in one unified portal.

---

## 🏛️ Authentic Vignan University Features

### 1. 🛠️ Campus Complaint Reporting (`/complaints/new`)
- Submit structured maintenance tickets with:
  - **Title** (e.g., *"Projector Lamp Failure in V-Block Room 304"*)
  - **Category**: `Electrical`, `Cleaning & Washrooms`, `Classroom & Furniture`, `IT & AV Equipment`, `Hostel & Mess`, `Campus Infrastructure`, `Other`
  - **Location Quick-Pick**: Pre-filled with real campus landmarks (*Aryabhata Block, Visvesvaraya Block, U-Block CCF, Dr. K. L. Rao Central Library, OAT, Vasishta Boys Hostel, Priyamvada Girls Hostel*).
  - **Description & Priority Selector**: `Low`, `Medium`, `High`, `Urgent`
  - **Vignan Student Credentials**: Auto-fills student name and Vignan email domain (`@vignan.ac.in`).
  - **Live Interactive Card Preview**: Visualizes the ticket in real time as the student types.

### 2. ⚡ Live Complaint Status Tracking (`/complaints`)
- Standardized 3-stage university facilities workflow:
  - ⏳ **Pending** — Awaiting estate officer review
  - 🔄 **In Progress** — Technician or carpentry squad dispatched on campus
  - ✅ **Resolved** — Fix completed and verified (triggers confetti celebration)
- Live administrative commentary box (technician notes, replaced components, timestamps).

### 3. 🔍 Vignan Lost & Found Portal (`/lost-found`)
- Filter between **Lost Items**, **Found Items**, and **Claimed / Reunited Items**.
- Examples seeded with authentic student belongings:
  - *Vignan University Student Smart RFID Card (#221FA04108)*
  - *Casio fx-991EX Scientific Calculator in A-Block*
  - *College Bus Pass (Guntur Collectorate - Vadlamudi Route #14)*
  - *Hero Sprint bicycle key near hostel parking*
- One-click **"Mark as Claimed"** button and protected contact info reveal.

### 4. 📢 Campus Announcements & Bulletins
- Official notices for **MAHOTSAV 2026 / INNO-FEST**, Central Library extended night study hours, college bus route changes, and CCF Wi-Fi maintenance.
- Priority alert tagging (`Normal`, `Important`, `Critical Alert`).

### 5. 🛡️ Dean & Admin Command Desk (`/admin`)
- Accessible to authorized campus administrators (e.g. **Dr. K. V. Krishna Kishore, Dean of Student Affairs & Estate Operations**).
- Real-time **Complaints Triage Table** with inline status dropdowns and technician notes editor.
- **Announcement Composer**: Broadcast notices directly to students across the Vadlamudi campus.
- **Reseed Demo Records Button**: Restores fresh demo data with one click between judge evaluations.

### 6. 📊 Vignan Campus Pulse (Exhibition Showstopper)
- **Calculated dynamically from live MongoDB database records**:
  - **Overall Campus Resolution Velocity (%)**
  - **Proportional category frequency breakdown**
  - **Top 4 most reported problem categories across Vignan**
  - **Category-specific resolution percentages**

---

## 🔐 Authentication & User Accounts (`/login` & `/signup`)

VignanConnect now includes a full-fledged authentication subsystem backed by MongoDB, `bcryptjs` password hashing, and JWT tokens:

### 1. Sign In Page (`/login`)
- **Student Login** vs **Dean / Administrator Login** persona tabs
- Password visibility toggle (Show/Hide)
- "Remember me on this laptop" session caching
- **1-Click Exhibition Quick-Fill Buttons**:
  - **Student Persona**: `221fa04108@vignan.ac.in` / `vignan123`
  - **Dean Persona**: `dean.affairs@vignan.ac.in` / `dean123`

### 2. Sign Up Page (`/signup`)
- Register as **Student** or **Campus Staff / Administrator**
- Automatic `@vignan.ac.in` email handling
- Registration Number / Staff ID verification
- Department selection (CSE, ECE, EEE, IT, Biotech, Mech, Civil, MBA)
- Password match validation & security requirements
- 1-Click "Autofill Sample Student" exhibition shortcut

### 3. API Endpoints
- `POST /api/auth/register` — Create new user with bcrypt password hashing
- `POST /api/auth/login` — Authenticate and receive signed JWT session token
- `GET /api/auth/me` — Retrieve authenticated user profile

---

## 👤 Exhibition Persona Switcher (Navbar)

Easily switch between roles during your presentation without typing passwords:

1. **Student View:**
   - **Name:** Pavan Kumar Reddy
   - **Reg. No:** `221FA04108`
   - **Department:** Computer Science & Engineering (CSE)
   - **Email:** `221fa04108@vignan.ac.in`
2. **Administrator / Dean View:**
   - **Name:** Dr. K. V. Krishna Kishore
   - **Role:** Dean, Student Affairs & Estate Operations
   - **Office:** NTR Vignan Vihar (Main Admin Block)
   - **Email:** `dean.affairs@vignan.ac.in`

---

## 🏃 How to Run on Your Laptop

### Method 1: 1-Click Exhibition Mode (Fastest)
Double-click [`run-demo.bat`](file:///c:/Users/venka/OneDrive/Desktop/3-I%20Folder/MFEF%20Practice/campusconnect/run-demo.bat) or run:
```bash
cd server
node server.js
```
Open your browser to: **`http://localhost:5000`**

### Method 2: Dual Development Mode (Hot Reloading)
Double-click [`run-dev.bat`](file:///c:/Users/venka/OneDrive/Desktop/3-I%20Folder/MFEF%20Practice/campusconnect/run-dev.bat) or:
* **Terminal 1 (Backend API):** `cd server && npm run dev` (Port 5000)
* **Terminal 2 (Vite Frontend):** `cd client && npm run dev` (Port 3000)

---

## 🎤 2-Minute Exhibition Presentation Script for Vignan University

1. **Welcome Evaluators:**
   * *"Good morning respected professors and evaluators! For our university exhibition, we built VignanConnect — a specialized MERN-stack campus management portal for our VFSTR Vadlamudi campus."*
2. **Present Campus Pulse:**
   * *"Notice our Campus Pulse section. It aggregates real-time maintenance requests across Aryabhata Block, Visvesvaraya Block, U-Block, and Hostels. The percentages and category rankings are calculated dynamically from our MongoDB collections."*
3. **Report a Campus Problem (Student Flow):**
   * *"Let's simulate a student finding a broken fan in Aryabhata Block 208. We click '+ Report Issue', select the location using our Vignan quick-pick chips, and our live interactive card updates instantly."*
4. **Demonstrate Dean/Admin Triage:**
   * *"Using our exhibition persona switcher in the navbar, we switch to Dr. K. V. Krishna Kishore (Dean of Student Affairs). We open the Admin Portal, find the complaint, and mark it 'In Progress' or 'Resolved'. As soon as we click Resolved, celebratory confetti triggers and the Campus Pulse resolution rate climbs in real time!"*
5. **Lost & Found:**
   * *"Students frequently lose bus passes, ID cards, or calculators. Our Lost & Found registry lets students find their belongings and securely contact the finder or security desk."*
