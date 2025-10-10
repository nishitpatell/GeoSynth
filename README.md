# Geosynth

> A modern, interactive platform for exploring countries worldwide with real-time data, 3D globe visualization, and AI-powered insights.

[![React](https://img.shields.io/badge/React-18.3.1-blue.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4.19-purple.svg)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4.17-cyan.svg)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Enabled-green.svg)](https://supabase.com/)

## Features

### Interactive 3D Globe
- Rotating Earth with realistic textures
- Click countries for detailed information
- Smooth zoom and navigation controls
- Auto-rotation and manual exploration

### Comprehensive Country Data
- Real-time economic indicators
- Live weather information
- Latest news and updates
- Cultural insights and demographics

### Smart Features
- **Wishlist**: Save favorite countries
- **Comparison**: Compare multiple countries side-by-side
- **Search**: Advanced search with autocomplete
- **Dark Mode**: Beautiful light/dark themes
- **Responsive**: Works on all devices

### Secure Authentication
- Google OAuth integration
- Email/password authentication
- Protected routes and user profiles
- Supabase backend

## Quick Start

### Prerequisites
- Node.js 16+ and npm
- Supabase account (for authentication)

### Installation

```bash
# Clone the repository
git clone https://github.com/nishitpatell/GeoSynth.git
cd GeoSynth

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your Supabase credentials

# Start development server
npm run dev
```

Visit `http://localhost:8080` 

## Project Structure

````
geosynth/
├── src/
│   ├── app/              # App configuration & routing
│   ├── features/         # Feature modules (globe, auth, wishlist, etc.)
│   ├── shared/           # Shared components & utilities
│   ├── core/             # Core infrastructure (API, repositories)
│   └── config/           # Configuration files
├── public/
│   └── assets/
│       └── globe/        # 3D globe textures & data
├── docs/                 # Documentation
├── supabase/            # Database migrations
└── ...config files
```

## Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS
- **UI Components**: shadcn/ui, Radix UI
- **3D Visualization**: react-globe.gl, Three.js
- **State Management**: React Query, Context API
- **Backend**: Supabase (Auth, Database)
- **Routing**: React Router v6
- **Styling**: Tailwind CSS with custom theme

## Documentation

- [Architecture](./docs/ARCHITECTURE.md) - System design and patterns
- [Authentication Setup](./docs/AUTH_SETUP.md) - Auth configuration
- [Google OAuth Guide](./docs/GOOGLE_AUTH_SETUP.md) - OAuth setup
- [Project Structure](./docs/PROJECT_STRUCTURE.md) - Detailed file structure

## Theme

Geosynth uses a custom color palette:
- **Primary**: Green (#22c55e)
- **Secondary**: Golden Yellow (#EAB308)
- **Accent**: Amber (#F59E0B)
- **Dark Mode**: Full support with persistent preference

## Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

## Key Features Explained

### 3D Globe
Interactive globe built with react-globe.gl featuring:
- Real Earth textures with topology
- 195+ countries with accurate boundaries
- Hover effects and click interactions
- Smooth animations and transitions

### Country Profiles
Detailed information including:
- Basic facts (capital, population, area)
- Economic data (GDP, currency)
- Weather information
- Latest news articles
- Cultural insights

### Wishlist System
- Save favorite countries
- Persistent storage with Supabase
- Quick access from any page
- Add/remove with one click

## Environment Variables

Required variables in `.env`:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

See `.env.example` for template.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 👥 Authors

- Nishit Patel - [@nishitpatell](https://github.com/nishitpatell)

## 🙏 Acknowledgments

- REST Countries API for country data
- Natural Earth for GeoJSON data
- Supabase for backend infrastructure
- shadcn/ui for beautiful components

---

**Built with ❤️ using React and Vite**
