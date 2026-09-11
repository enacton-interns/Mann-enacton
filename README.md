# Mental Wellness

A responsive Mental Wellness web application built with React that helps users track their moods, maintain personal journals, and gain insights into their emotional well-being through analytics and visualizations.

All data is stored locally in the browser using Redux Toolkit and Local Storage, providing a seamless experience without requiring a backend server or user authentication.

---

## Features

### Mood Tracking

* Record daily moods and emotions.
* Track emotional patterns over time.
* View mood history in an organized manner.

### Journaling

* Create personal journal entries.
* Edit existing journal entries.
* Delete journal entries.
* Categorize journals based on mood or type.
* Store all journal data locally in the browser.

### Analytics Dashboard

* View average mood for the current week.
* View average mood for the current month.
* Interactive charts powered by Chart.js.
* Visualize mood trends and emotional patterns.

### Persistent Local Storage

* Automatically saves application data in browser Local Storage.
* Data persists across page refreshes and browser sessions.
* No database setup required.

### Responsive Design

* Mobile-friendly interface.
* Optimized for tablets and desktops.
* Clean and intuitive user experience across devices.

---

## Tech Stack

### Frontend

* React.js
* Redux Toolkit
* React Router DOM
* Chart.js
* React ChartJS 2
* CSS3

### State Management

* Redux Toolkit

### Data Persistence

* Browser Local Storage

---

## Project Structure

```text
src/
│
├── Components/
├── Features/
├── Data/
├── Assets/
├── App.jsx
└── main.jsx
```

---

## Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
```

### 2. Navigate to the Project Directory

```bash
cd Mental-Wellness
```

### 3. Install Dependencies

```bash
npm install
```

---

## Running the Project

### Start Development Server

```bash
npm run dev
```

The application will be available at:

```text
http://localhost:5173
```

---

## How It Works

1. Users record their daily mood.
2. Journal entries can be created, edited, and deleted.
3. Redux Toolkit manages the application state.
4. Data is automatically synchronized with Local Storage.
5. Analytics calculate and display weekly and monthly average moods.
6. Interactive charts help visualize emotional trends.

---

## Author

**Mann Jariwala**

---

## License

This project is open-source and intended for learning, portfolio, and educational purposes.
