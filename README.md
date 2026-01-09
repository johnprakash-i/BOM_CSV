# Bill of Materials Comparison Tool

A production-ready React application for comparing supplier rates with visual heatmaps and advanced table features.

## Features

- 📊 CSV file upload and parsing
- 🎨 Dynamic heatmap visualization (min=green, max=red)
- 📈 Percentage difference calculations
- 🔒 Column freeze functionality
- 🔄 Column sorting (ascending/descending)
- 👁️ Column hide/show toggle
- 📱 Fully responsive design
- ♿ Accessible UI components

## Tech Stack

- React 18 + TypeScript
- Vite
- Tailwind CSS
- React Router
- PapaParse (CSV parsing)
- Storybook

## Getting Started
```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Run Storybook
npm run storybook

# Build for production
npm run build
```

## Project Structure
```
src/
├── components/     # Reusable components
├── pages/          # Page components
├── hooks/          # Custom React hooks
├── utils/          # Utility functions
├── types/          # TypeScript definitions
└── constants/      # App constants
```

## Development Guidelines

- Follow TypeScript strict mode
- Use functional components with hooks
- Implement proper error boundaries
- Write Storybook stories for UI components
- Keep components small and focused
- Use meaningful variable names
- Document complex logic