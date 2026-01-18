
# Project Requirements for Hotel Pulse Dashboard

This document outlines the core requirements and technical specifications for the "Hotel Pulse Dashboard" project. Its purpose is to provide context to GitHub Copilot and other AI-assisted development tools.

## 1. Project Overview

**System Name:** Hotel Pulse Dashboard
**Description:** A modern, real-time, single-page web application for hotel management. It displays key performance indicators (KPIs), room statuses, daily arrivals, and occupancy forecasts. The application features an interactive interface for managing hotel room data, which persists in the user's browser.

## 2. Technology Stack

- **Frontend:** React 18 (using Hooks), TypeScript, Vite
- **Styling:** Tailwind CSS for a utility-first, responsive design.
- **Charts:** Recharts for data visualization.
- **Data Persistence:** Browser `localStorage` is used to simulate a database, allowing data to persist across sessions.
- **Language:** TypeScript is used across the entire application for type safety.

## 3. Core Functionalities & Components

### Main Dashboard (`App.tsx`)
- Displays a real-time overview of hotel operations.
- Fetches and displays data from the mock API service (`services/api.ts`).
- Automatically refreshes data every 30 seconds.

### Key Components
- **`KpiCard.tsx`**: Displays key metrics like Occupancy, Daily Revenue, ADR, and RevPAR with distinct colors and icons.
- **`RoomGrid.tsx`**: A visual grid representing all hotel rooms. Each room is color-coded based on its status (Available, Occupied, Maintenance, Cleaning).
- **`ArrivalsList.tsx`**: Lists guests scheduled to check in for the day, highlighting VIPs.
- **`ForecastChart.tsx`**: A bar chart visualizing the 14-day occupancy forecast.
- **`RoomManagementModal.tsx`**: A full-featured modal for CRUD (Create, Read, Update, Delete) operations on rooms. This is the primary interface for data entry and management.

## 4. Data Model (`types.ts`)

The application relies on a set of core TypeScript interfaces and enums:
- **`Room`**: Represents a single hotel room with properties like `id`, `roomNumber`, `floor`, `type`, and `status`.
- **`RoomType`**: Enum for room types (Single, Double, Suite, etc.).
- **`RoomStatus`**: Enum for room statuses (Available, Occupied, etc.).
- **`Arrival`**: Represents a guest arriving today.
- **`KpiData`**: Interface for the main dashboard metrics.

## 5. Mock API & Data Layer (`services/api.ts`)

- This service simulates a backend API.
- It is responsible for all data operations.
- **Initial Data:** On first load, it generates a default set of 50 rooms.
- **Persistence:** All room data is stored and retrieved from `localStorage` using the key `hotel_pulse_rooms`.
- **Dynamic Calculations:** KPIs (like occupancy rate) and arrivals are dynamically calculated based on the current state of the rooms stored in `localStorage`.

## 6. Coding & UI/UX Guidelines

- **TypeScript First:** Maintain strict type safety. All functions, props, and state should be typed.
- **Component-Based Architecture:** Create small, reusable, and single-purpose components.
- **Responsiveness:** The UI must be fully responsive and adapt gracefully to different screen sizes (mobile, tablet, desktop).
- **Modern UI:** The design should be clean, modern, and professional, following the dark-themed aesthetic established in the existing components.
- **Error Handling:** Gracefully handle potential errors during data fetching and display informative messages to the user.
