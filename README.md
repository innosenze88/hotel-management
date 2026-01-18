
# Hotel Pulse Dashboard

A modern, real-time, single-page web application for hotel management. It displays key performance indicators (KPIs), room statuses, daily arrivals, and occupancy forecasts.

## ✨ Features

- **Real-time KPI Cards:** At-a-glance view of Occupancy, Revenue, ADR, and RevPAR.
- **Interactive Room Grid:** Visual map of all rooms, color-coded by status (Available, Occupied, etc.) with filtering capabilities.
- **Live Arrivals List:** See today's check-ins, with VIP guests highlighted.
- **14-Day Occupancy Forecast:** A bar chart visualizing upcoming occupancy trends.
- **Persistent Data:** All room data is saved in the browser, so your changes are remembered.
- **Full Room Management:** An intuitive modal to add, edit, and delete room information.

## 🛠️ Tech Stack

- **Frontend:** React 18, Vite, TypeScript
- **Styling:** Tailwind CSS (via CDN)
- **Charts:** Recharts
- **Data Persistence:** Browser `localStorage`

## 🚀 Getting Started

Follow these instructions to get the project up and running on your local machine.

### Prerequisites

- [Node.js](https://nodejs.org/) (version 18.x or higher is recommended)
- A modern web browser like Chrome or Firefox

### Installation

1. Clone the repository to your local machine:
   ```bash
   git clone <repository-url>
   ```
2. Navigate into the project directory:
   ```bash
   cd <project-directory>
   ```
3. Install the necessary dependencies:
   ```bash
   npm install
   ```

### Environment Variables

To prepare for upcoming features utilizing generative AI, you will need to set up an environment variable.

1. Create a new file named `.env.local` in the root of the project.
2. Add the following line to the file, replacing `<YOUR_API_KEY>` with your actual key:

   ```
   VITE_GEMINI_API_KEY=<YOUR_API_KEY>
   ```

*Note: For Vite projects, environment variables must be prefixed with `VITE_` to be exposed to the client-side code.*

### Running the Development Server

Once the dependencies are installed and the environment variables are set, you can start the development server:

```bash
npm run dev
```

This will start the Vite development server. Open your browser and navigate to the URL provided in the terminal (usually `http://localhost:5173`) to see the application in action.
