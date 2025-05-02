<div align="center">
  <h1>Todo App 📝</p>
</div>

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-000000?logo=next.js&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?logo=tailwind-css&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-00ff0c?logo=mongodb&logoColor=white)

## Key Features

- ✅ Secure authentication with JWT
- 📝 Create, edit, and delete tasks
- 🔒 Data protection with encryption
- 🌙 Dark/Light mode
- 🚀 User interface with smooth animations
- 🛡️ Protection against brute force attacks with rate limiting
- 🍪 Session management
- 📱 Responsive design for all devices

## Technologies Used

- **Frontend**: Next.js, React, Tailwind CSS, Framer Motion
- **Backend**: Next.js API Routes, MongoDB
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: Zod
- **Forms**: React Hook Form
- **Notifications**: React Toastify

## Project Structure

```
task-app/
├── app/                            # Application routes and pages
│   ├── api/                        # API endpoints
│   │   ├── auth/                   # Authentication endpoints
│   │   │   ├── login/              # Login endpoint
│   │   │   └── register/           # Registration endpoint
│   │   └── tasks/                  # Task endpoints
│   ├── dashboard/                  # Dashboard page
│   ├── login/                      # Login page
│   ├── register/                   # Registration page
│   ├── layout.tsx                  # Main application layout
│   └── page.tsx                    # Main page
├── components/                     # Reusable components
│   ├── ui/                         # Basic UI components
│   │   ├── button.tsx              # Button component
│   │   ├── input.tsx               # Input component
│   │   ├── loading-spinner.tsx     # Loading spinner component
│   │   └── textarea.tsx            # Textarea component
│   ├── task-item.tsx               # Individual task component
│   ├── task-item-delete-modal.tsx  # Modal to confirm task deletion
│   └── theme-switcher.tsx          # Theme switcher
├── hooks/                          # Custom hooks
│   └── use-check-auth.ts           # Hook to verify authentication
├── lib/                            # Utilities and functions
│   ├── auth-handlers.ts            # Functions to handle authentication
│   ├── auth-verifier.ts            # Authentication verifier
│   ├── db.ts                       # Database connection
│   ├── interfaces.ts               # TypeScript interfaces
│   ├── rate-limit.ts               # Rate limiting implementation
│   ├── task-requester.ts           # Functions to interact with tasks
│   └── validations.ts              # Zod validation schemas
├── providers/                      # Context providers
│   ├── cookie-provider.tsx         # Cookie provider
│   ├── theme-provider.tsx          # Theme provider
│   └── toast-provider.tsx          # Notification provider
├── .eslintrc.json                  # ESLint configuration
├── .gitignore                      # Git ignored files and folders
├── next.config.mjs                 # Next.js configuration
├── package.json                    # Project dependencies and scripts
├── postcss.config.mjs              # PostCSS configuration
├── tailwind.config.js              # Tailwind CSS configuration
├── tsconfig.json                   # TypeScript configuration
└── README.md                       # Project documentation
```

## Installation and Setup

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

### MongoDB Setup

1. Install MongoDB by following the [official instructions](https://docs.mongodb.com/manual/installation/).

### Installation Steps

1. Clone the repository:

   ```bash
   git clone https://github.com/MohamedABBJ/todo-app
   cd task-app
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   ```

3. Create the `.env.local` file in the root of the project with the following environment variables:

   ```env
   MONGODB_URI=<your_mongodb_uri>
   JWT_SECRET=<your_jwt_secret>
   ```

4. Start the development server:

   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open your browser and go to `http://localhost:3000`.
