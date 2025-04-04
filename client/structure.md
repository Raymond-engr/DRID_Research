research-portal/
  ├── app/                      # Next.js 13+ app directory
  │   ├── (auth)/               # Authentication routes group
  │   │   ├── admin-login/      # Admin login page
  │   │   ├── researcher-login/ # Researcher login page
  │   │   └── researcher-register/[token]/ # Registration with token
  │   ├── (dashboard)/          # Dashboard routes group
  │   │   ├── admin/            # Admin dashboard 
  │   │   └── researcher/       # Researcher dashboard
  │   ├── (public)/             # Public routes
  │   │   ├── research/         # Research articles
  │   │   ├── innovation/       # Innovation articles
  │   │   └── development/      # Development articles
  │   └── layout.js             # Root layout
  ├── components/               # Reusable UI components
  │   ├── ui/                   # shadcn UI components
  │   ├── auth/                 # Authentication components
  │   ├── dashboard/            # Dashboard components
  │   └── public/               # Public site components
  ├── lib/                      # Utility functions, hooks, etc.
  │   ├── auth.js               # Authentication utilities
  │   ├── api.js                # API client
  │   └── indexdb.js            # IndexDB token storage
  └── public/                   # Static assets