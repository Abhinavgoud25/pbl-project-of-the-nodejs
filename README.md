# Public Cleanliness Reporter 🌍🌱
> **A Comprehensive Civic Grievance Redressal System — PBL Mini Project**

A modern, responsive, and citizen-friendly web application designed to empower citizens to report public cleanliness hazards—such as uncollected waste, overflowing dustbins, open drains, and stagnant water—directly to local municipal and panchayat authorities.

Built entirely using **HTML5, CSS3, and Vanilla JavaScript** with zero external backend dependencies; all data and photos are processed, compressed, and persisted locally using the browser's `localStorage` engine.

---

## 📸 Key Highlights & Features

- **🌆 Visual Clean-City Landing Page:**
  - Full-screen high-resolution clean city & nature backdrop.
  - Project branding, civic mission tagline, and impact metrics.
  - Quick access buttons to Start Reporting, Browse Public Complaints, or enter the Officer Portal.

- **🗺️ Single-Page Cascading Dropdowns & Dynamic Question Flow:**
  - **4-in-1 Location Card:** Select **State** &rarr; **District** &rarr; **Mandal** &rarr; **Village / Ward** smoothly from interconnected dropdowns on a single screen without confusing page jumps.
  - **Dynamic Question Trigger:** As soon as the user selects their **Village**, the question section immediately appears right below it asking: *"What is the problem in [Selected Village]?"*.
  - **Active Area Pill & Breadcrumb:** Displays real-time location path (`State > District > Mandal > Village`) with one-click location reset.

- **⚠️ Problem Reporting Module:**
  - Interactive selection cards for the 7 standard cleanliness hazards:
    1. 🗑️ **Garbage not collected**
    2. 🚮 **Overflowing dustbin**
    3. 🚰 **Open drain / sewage blockage**
    4. 🦟 **Stagnant water / mosquitoes**
    5. 🚻 **Public toilet dirty**
    6. 🔥 **Burning of waste**
    7. ⚠️ **Other** (dynamically reveals a custom description input)
  - **Urgency Selector:** Normal Priority, Urgent, or Critical Hazard.
  - **GPS Locator:** Mock GPS pinning feature that stamps current coordinates.
  - **Photo Upload with Client-Side Canvas Compression:** Users can drag-and-drop or upload photos from phone/PC. The built-in HTML5 Canvas algorithm automatically optimizes and compresses the image to prevent `localStorage` quota overflow while retaining visual clarity.
  - **Contact Info:** Name, validated 10-digit phone number, and optional email.

- **🎉 Confirmation & Printable Receipt:**
  - Generates a unique tracking reference code (e.g., `PCR-2026-89412`).
  - Summary of the problem, location, urgency, reporter details, and timestamp.
  - "Copy ID" button and "Print / Save PDF Receipt" button for citizen documentation.

- **📋 Public Transparency Feed ("View Reports"):**
  - Live community feed of all lodged complaints.
  - Real-time search by Report ID, Reporter Name, Village, or keywords.
  - Multi-criteria filters: Filter by Status (🟡 Pending, 🔵 In Progress, 🟢 Resolved), Problem Category, State, and District.
  - Complaint Inspection Modal: View full resolution timeline, evidence photo, and official sanitation remarks.

- **🛡️ Municipal Admin Management Portal:**
  - Secure PIN protection (Default: `admin123`) with a **One-Click Demo Access** button for project presentations.
  - Real-time KPI dashboard: Total Complaints, Pending Verification, In-Progress Cleanups, Resolved Complaints, and Community Cleanliness Score (%).
  - Management actions:
    - **Mark as In Progress:** Dispatches a crew and sets active status.
    - **Mark as Resolved:** Prompts for official cleanup remark (e.g., "GHMC sanitation vehicle cleared site and sprayed bleaching powder").
    - **Export to CSV:** Downloads an official `.csv` spreadsheet containing all report data.
    - **Reset Demo Data:** Reseeds initial demo complaints at any time.

---

## 🚀 How to Run the Website

Because this application is built with standard Web Technologies (HTML5, CSS3, JavaScript), **no backend server, npm installation, or database setup is required.**

### Method 1: Instant Direct Launch (Simplest)
1. Navigate to the project directory:
   ```
   c:\Users\Prem kumar\OneDrive\Desktop\node js
   ```
2. Double-click `index.html`.
3. It will immediately open and run smoothly in your default web browser (Google Chrome, Microsoft Edge, Mozilla Firefox, Brave, etc.).

### Method 2: Using VS Code Live Server Extension
1. Open the folder in **Visual Studio Code**.
2. Right-click on `index.html`.
3. Select **"Open with Live Server"**.
4. The site will open at `http://127.0.0.1:5500/index.html`.

### Method 3: Using Any Local Server (Python / Node / PHP)
- **Node.js (npx):**
  ```bash
  npx serve .
  ```
- **Python 3:**
  ```bash
  python -m http.server 3000
  ```
  Then open `http://localhost:3000` in your browser.

---

## 🔑 Admin Credentials

- **Admin Passcode:** `admin123`
- **Presentation Shortcut:** Click the **"⚡ One-Click Demo Access"** button on the Admin page to log in immediately during college viva/demonstration without typing.

---

## 📁 Project Folder Structure

```
node js/
│
├── index.html               # Main Single-Page Application (All views, semantic HTML5)
│
├── css/
│   └── styles.css           # Modern Eco-Green design system, Glassmorphism, Responsive CSS
│
├── js/
│   ├── data.js              # Hierarchical geographic data (States > Districts > Mandals > Villages)
│   │                        # Pre-seeded demo reports database & categories
│   └── app.js               # Application router, form validation, photo compression, 
│                            # localStorage CRUD operations, filter logic, and admin tools
│
├── assets/
│   └── hero-bg.jpg          # High-resolution modern eco-clean city hero backdrop
│
├── README.md                # Project documentation and run guide
└── PROJECT_REPORT_GUIDE.md  # Complete PBL mini project report content for submission & viva
```

---

## 💾 Data Persistence Architecture

- **Database:** Browser `localStorage` under key `PCR_REPORTS_DATABASE`.
- **Pre-seeded Records:** On first launch, the app automatically initializes with realistic sample reports across Telangana and Andhra Pradesh to ensure the dashboard and reports feed are immediately engaging.
- **Image Optimization:** Uploaded images are rendered through an offscreen HTML5 `<canvas>` that scales images down to max 800px dimension and applies JPEG 72% compression before saving as Base64 strings. This prevents browser `localStorage` 5MB quota overflow while retaining visual evidence quality.
