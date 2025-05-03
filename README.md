# Portfolio Website with MongoDB Backend and React Frontend

This project is a professional portfolio website that uses MongoDB for data storage and a modern React frontend. The system provides a dynamic, real-time experience with WebSocket connections for live updates, while also supporting static deployment through data export to JSON files.

## Architecture

- **Frontend**: A React-based application built with TypeScript, Vite, and shadcn/ui components
- **Backend**: Express.js server with MongoDB database for data management
- **Real-time Updates**: Socket.IO for WebSocket connections enabling live data updates
- **Build System**: Node.js script to export MongoDB data to JSON for static deployments
- **Data Flow**:
  - Dynamic mode: MongoDB → Express API → React frontend with WebSockets
  - Static mode: MongoDB → JSON files → Static frontend

## Features

- **Responsive Design**: Optimized for all screen sizes from mobile to desktop
- **Real-time Updates**: WebSocket connections for live data updates in the admin dashboard
- **Project Showcase**: Display and filter projects by technology
- **Interactive Skills Visualization**: Visual representation of skills with categories
- **Admin Dashboard**: Secure admin area for content management
- **Visitor Analytics**: Track and analyze visitor statistics
- **Contact System**: Form submission with notification system
- **Dark/Light Mode**: Theme toggle with system preference detection
- **3D Elements**: Three.js integration for interactive 3D elements
- **Animations**: Smooth transitions and animations using Framer Motion
- **Deployment Options**: Support for both dynamic and static deployments

## Development Setup

### Prerequisites

- Node.js 16+ and npm/bun
- MongoDB installed locally

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/username/portfolio-mongodb.git
   cd portfolio-mongodb
   ```

2. Install dependencies:
   ```bash
   bun install
   ```

3. Configure MongoDB:
   - Make sure MongoDB is running locally
   - Create a database named `portfolio`
   - Update the `.env` file with your MongoDB connection string if needed

4. Import sample data:
   ```bash
   bun run import-data
   ```

5. Start the development server:
   ```bash
   bun run all
   ```

This will start both the backend API server and the frontend development server.

## Project Structure

```
portfolio-mongodb/
├── backend/                  # Backend code
│   ├── config/               # Database configuration
│   ├── middleware/           # Express middleware
│   ├── models/               # MongoDB schema models
│   ├── public/               # Backend public assets
│   ├── routes/               # API routes
│   ├── scripts/              # Data import/export scripts
│   ├── services/             # Backend services (WebSockets, etc.)
│   ├── utils/                # Utility functions
│   └── server.js             # Express server
├── public/                   # Static assets
│   ├── data/                 # Exported JSON data from MongoDB
│   └── images/               # Project and profile images
├── src/                      # Frontend code
│   ├── components/           # React components
│   │   ├── 3d/               # Three.js components
│   │   ├── admin/            # Admin dashboard components
│   │   ├── home/             # Homepage components
│   │   ├── layout/           # Layout components
│   │   ├── projects/         # Project components
│   │   ├── ui/               # UI components
│   │   └── visitor/          # Visitor tracking components
│   ├── contexts/             # React context providers
│   ├── lib/                  # Library code and utilities
│   ├── pages/                # Page components
│   │   └── admin/            # Admin pages
│   ├── services/             # API services
│   ├── styles/               # CSS styles
│   ├── utils/                # Utility functions
│   └── App.tsx               # Main application component
├── .github/workflows/        # GitHub Actions workflows
├── .env                      # Environment variables
└── package.json              # Project dependencies and scripts
```

## Development Workflow

1. Manage your portfolio data in the MongoDB database using the backend API.
2. Run `bun run export-data` to export the data as JSON files.
3. Test the frontend locally with the exported data.
4. Commit and push changes to trigger the GitHub Actions deployment.

## Available Scripts

- **Development**:
  - `bun run dev`: Start the frontend development server
  - `bun run server`: Start the backend API server
  - `bun run server:dev`: Start the backend with nodemon for auto-reloading
  - `bun run all`: Run both backend and frontend concurrently

- **Data Management**:
  - `bun run import-data`: Import sample data into MongoDB
  - `bun run export-data`: Export MongoDB data to JSON files

- **Building & Deployment**:
  - `bun run build`: Build the frontend for production
  - `bun run build:with-data`: Export data and build the frontend

- **Code Quality**:
  - `bun run lint`: Run linting checks
  - `bun run format`: Format code using Biome

## Deployment Options

### Static Deployment (GitHub Pages)

The project is set up for automatic deployment to GitHub Pages using GitHub Actions. When you push to the main branch, the workflow will:

1. Export data from MongoDB
2. Build the frontend
3. Deploy to GitHub Pages

To set up GitHub Pages deployment:

1. Create a GitHub repository for your project
2. Add the MongoDB connection string as a GitHub Secret named `MONGO_URI`
3. Push to the main branch to trigger deployment

### Dynamic Deployment

For a fully dynamic experience with real-time updates:

1. Deploy the Express backend to a server (Heroku, DigitalOcean, etc.)
2. Configure environment variables on the server
3. Deploy the React frontend to a static hosting service or the same server
4. Update the API URL in the frontend to point to your deployed backend

## Technologies Used

- **Frontend**: React, TypeScript, Vite, Tailwind CSS, shadcn/ui, Framer Motion, Three.js
- **Backend**: Node.js, Express, MongoDB, Socket.IO
- **Tooling**: Bun, Biome, ESLint, GitHub Actions

## License

MIT
