# Library Management Frontend

A modern React-based Library Management System frontend built with Next.js 15 and React 19. This application provides a complete CRUD interface for managing books in a library system, featuring a clean UI, real-time data synchronization, and responsive design.

## 🌟 Features

- **Book Management**: Complete CRUD operations for library books
- **Modern UI**: Built with shadcn/ui components and Tailwind CSS
- **Real-time Data**: TanStack Query for efficient data fetching and caching
- **Responsive Design**: Mobile-first approach with modern styling
- **Image Upload**: Book cover image support with ImageKit integration
- **Search & Filtering**: Advanced search functionality with debouncing
- **Data Tables**: Sortable and paginated book listings
- **Form Validation**: Type-safe forms with Zod validation
- **Toast Notifications**: User-friendly feedback with Sonner

## 🚀 Technology Stack

### Core Framework

- **Next.js 15** - React framework with App Router
- **React 19** - Latest React with concurrent features
- **TypeScript** - Type-safe development

### State Management & Data Fetching

- **TanStack Query** - Server state management and caching
- **React Hook Form** - Form state management
- **Zod** - Schema validation

### UI & Styling

- **shadcn/ui** - Component library built on Radix UI
- **Radix UI** - Accessible, unstyled UI primitives
- **Tailwind CSS v4** - Utility-first CSS framework
- **Lucide React** - Modern icon library
- **next-themes** - Theme management

### Data & Tables

- **TanStack Table** - Powerful data grid functionality
- **Sonner** - Toast notifications

### Media & Assets

- **ImageKit** - Image upload and optimization
- **next/image** - Optimized image loading

## 📋 Prerequisites

- **Node.js** 18.x or later
- **npm** 7.x or later
- **Backend API** - Library Management API running (see backend documentation)

## 🔧 Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd library-frontend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env.local` file in the root directory:

   ```env
   NEXT_PUBLIC_LIBRARY_API_HOST=http://localhost:8080
   ```

4. **Start development server**

   ```bash
   npm run dev
   ```

   The application will be available at [http://localhost:3000](http://localhost:3000)

## 🛠️ Development Commands

```bash
# Start development server with Turbopack
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run ESLint
npm run lint
```

## 🏗️ Project Structure

```
library-frontend/
├── app/                    # Next.js App Router
│   ├── books/             # Book management pages
│   ├── members/           # Member management
│   ├── reports/           # Reports and statistics
│   └── settings/          # Application settings
├── components/            # Reusable UI components
│   ├── ui/               # shadcn/ui components
│   └── ...               # Custom components
├── lib/                   # Business logic and utilities
│   ├── http.ts           # HTTP client
│   ├── repos/            # Repository pattern for API
│   └── query/            # React Query hooks
├── hooks/                # Custom React hooks
└── public/               # Static assets
```

## 🎯 Architecture Overview

### Data Flow

1. **Presentation Layer**: React components and pages
2. **Query Layer**: TanStack Query hooks for data management
3. **Repository Layer**: HTTP repositories for API operations
4. **HTTP Layer**: Type-safe HTTP client with error handling

### Key Patterns

- **Repository Pattern**: Abstracted API operations
- **Custom Hooks**: Business logic encapsulation
- **Modal Composition**: Consistent UI patterns
- **Optimistic Updates**: Enhanced user experience
- **Type Safety**: Full TypeScript coverage

## 🔌 API Integration

The frontend connects to the Go-based Library Management API with:

- **HTTP Client**: Centralized client with error handling (`lib/http.ts`)
- **Repository Layer**: Type-safe CRUD operations (`lib/repos/`)
- **Query Hooks**: TanStack Query integration (`lib/query/`)
- **Error Handling**: Consistent error parsing and user feedback

### API Response Format

```typescript
interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}
```

## 📱 Features in Detail

### Book Management

- View all books in a paginated, sortable table
- Search books by title with debounced input
- Create new books with cover image upload
- Edit existing book information
- Delete books with confirmation dialogs
- Responsive design for mobile and desktop

### UI Components

- **Data Tables**: Advanced sorting and pagination
- **Modal Forms**: Consistent form patterns
- **Toast Notifications**: User feedback system
- **Loading States**: Skeleton loaders and spinners
- **Error Boundaries**: Graceful error handling

## 🎨 Styling & Theming

- **Tailwind CSS v4**: Latest utility-first CSS
- **CSS Variables**: Custom design tokens
- **shadcn/ui**: New York style configuration
- **Responsive Design**: Mobile-first approach
- **Theme Support**: Light/dark mode with next-themes

## 🔒 Environment Variables

| Variable                       | Description     | Required |
| ------------------------------ | --------------- | -------- |
| `NEXT_PUBLIC_LIBRARY_API_HOST` | Backend API URL | Yes      |

## 📦 Build & Deployment

### Production Build

```bash
npm run build
npm start
```

### Docker Deployment

The application can be containerized using Next.js Docker best practices.

## 🧪 Development Guidelines

### Code Style

- TypeScript strict mode enabled
- ESLint configuration for Next.js
- Prettier for code formatting
- Component naming conventions

### State Management

- **Server State**: TanStack Query for API data
- **Client State**: React state for UI interactions
- **Form State**: React Hook Form with Zod validation

### Error Handling

- API error parsing and display
- Form validation with user feedback
- Loading states and error boundaries

## 📄 License

This project is part of a library management system assignment.

## 🔗 Related Projects

- **Library Backend**: Go-based API service
- **Database**: PostgreSQL with migrations
- **Documentation**: Swagger API documentation
