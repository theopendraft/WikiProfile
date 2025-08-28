# Quick Wiki Profile Card

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-v18-blue?logo=react)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-fast-yellowgreen?logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v3-blue?logo=tailwind-css)](https://tailwindcss.com/)

A web application that generates a dynamic profile card for any Wikimedia user, displaying their global edit statistics, contribution heatmap, and recent activity.

**[➡️ View Live Demo](https://your-live-demo-link.com)** (Replace with your actual link)

---

_(Replace with a screenshot of your application)_

## ✨ Features

- **Global User Stats**: Fetches and displays a user's total edit count across all major Wikimedia projects.
- **Dynamic User Mood**: Assigns a fun "mood" (e.g., "Wiki Legend", "Just Landed") based on account age and edit count.
- **Contribution Heatmap**: A GitHub-style heatmap visualizing a user's edit frequency over the past year.
- **Real-time Suggestions**: Autocompletes usernames as you type.
- **Top & Recent Edits**: Shows the user's most-edited articles and their latest contributions.
- **Responsive Design**: A clean, mobile-first interface that works on all screen sizes. The heatmap is horizontally scrollable on small screens for a better viewing experience.
- **Dark Mode**: Supports both light and dark themes.
- **CORS Proxy**: Includes a simple Node.js proxy to bypass CORS issues when fetching data from various Wikimedia APIs.

## 🛠️ Tech Stack

- **Frontend**:
  - [React](https://reactjs.org/)
  - [Vite](https://vitejs.dev/)
  - [Tailwind CSS](https://tailwindcss.com/)
- **Libraries**:
  - [Framer Motion](https://www.framer.com/motion/) for animations.
  - [Axios](https://axios-http.com/) for API requests.
  - [React Calendar Heatmap](https://github.com/patientslikeme/react-calendar-heatmap) for the contribution graph.
  - [Lucide React](https://lucide.dev/) for icons.
- **Backend (Proxy)**:
  - [Node.js](https://nodejs.org/)
  - [Express](https://expressjs.com/)
- **APIs**:
  - Wikimedia (MediaWiki API)
  - XTools API

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- [Node.js](https://nodejs.org/en/) (v18 or later)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Installation

1.  **Clone the repository:**

    ```sh
    git clone https://github.com/theopendraft/quick-wiki-profile-card.git
    cd quick-wiki-profile-card
    ```

2.  **Install frontend dependencies:**

    ```sh
    cd frontend
    npm install
    ```

3.  **Install backend (proxy) dependencies:**
    Navigate back to the root directory and install dependencies for the proxy server.
    ```sh
    cd ..
    npm install express axios cors
    ```

### Running the Application

You need to run two separate processes: the Vite frontend server and the Node.js proxy server.

1.  **Start the backend proxy server:**
    In the project's root directory, run:

    ```sh
    node proxy.js
    ```

    The proxy will start on `http://localhost:3001`.

2.  **Start the frontend development server:**
    In a new terminal, navigate to the `frontend` directory and run:
    ```sh
    cd frontend
    npm run dev
    ```
    The application will be available at `http://localhost:5173` (or another port if 5173 is in use).

## 📁 Project Structure

```
.
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/   # Reusable React components (ProfileCard, UserInput, etc.)
│   │   ├── utils/        # API fetching logic and helpers
│   │   ├── data/         # Static JSON data (xtoolsProjects.json)
│   │   ├── App.jsx       # Main application component
│   │   └── index.css     # Global styles and Tailwind directives
│   └── package.json
├── proxy.js              # Node.js CORS proxy server
└── README.md
```

## 🙏 Acknowledgements

- This project is powered by the free and open APIs provided by the [Wikimedia Foundation](https://www.wikimedia.org/).
- User edit counts are aggregated using the [XTools API](https://xtools.wmcloud.org/).

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
