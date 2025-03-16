# ✨ RadiatorForge Frontend

A slick Next.js 15 app that brings creative portfolios to life. Built with React 18, TypeScript, and Radix UI + Tailwind.


## 🎨 What's Inside

Modern, responsive UI for a Behance-inspired portfolio platform. Uses Next.js App Router for blazing-fast performance and a seamless UX.

### Tech Stack
- **Next.js 15** - App Router, Server Components, RSC
- **React 18** - Hooks, Context, Suspense
- **TypeScript** - Full type safety
- **Radix UI** - Accessible primitive components
- **Tailwind CSS** - Utility-first styling

## 🚀 Key Features

### 💻 Modern Architecture
- SSR + Client Components where needed
- Next.js App Router with nested layouts
- Dynamic imports for code splitting
- Edge runtime for blazing performance

### 🖼️ Portfolio Showcase
- Image grid layouts that adapt to content
- Video playback with custom controls
- Smooth transitions between projects
- Responsive design that looks great on all devices

### 👤 Profile Experience
- Custom avatar & banner upload/crop
- Stats visualization for profile analytics
- Edit-in-place for seamless profile updates
- Follow system with realtime follower counts

### 🔍 Project Discovery
- Infinite scroll feed with optimized loading
- Search with dynamic filters
- Quick actions on hover
- Skeleton loaders for perceived performance

### 💬 Social Features
- Real-time chat with typing indicators
- Comment threads with rich text
- Like/bookmark animations
- Collaboration invites and management



## 📲 Performance Optimizations

- **Image Optimization** - Next.js Image component with automatic WebP/AVIF
- **Code Splitting** - Dynamic imports to reduce initial bundle size
- **Deferred Loading** - Non-critical content loads after initial paint
- **SSR + ISR** - Hybrid rendering approach for best performance
- **Font Optimization** - Next.js font system with preloading

## 🏆 UX Improvements

- Skeleton loaders during data fetching
- Optimistic UI updates for instant feedback
- Form validation with error states
- Smooth page transitions
- Toast notifications for user actions

## 🛠️ Development Setup

```bash
# Clone the repo
git clone https://github.com/supermatt7-suniljangir/RF-frontend.git

# Install dependencies
cd creativeconnect-frontend
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your API URL, etc.

# Start development server
npm run dev
```

Visit `http://localhost:5173` and start building!

## 🧠 What I Learned

- Building with Next.js App Router and Server Components
- Creating accessible components with Radix UI
- Managing complex state across server/client boundary
- Optimizing image and media delivery
- Implementing real-time features with Socket.io on the client
- Creating responsive layouts with Tailwind CSS
