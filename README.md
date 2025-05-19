# Citizen Complaints and Engagement System

A modern web application for managing citizen complaints and engagement, built with Next.js, TypeScript, and Tailwind CSS.

## Features

- 🏠 User-friendly complaint submission form
- 👥 User management (Normal users, Admin users, Super Admin)
- 📊 Admin dashboard for complaint management
- 🔔 Real-time notifications
- 🌓 Dark/Light mode support
- 📝 Activity logging
- 🔒 Secure authentication with Supabase
- 📱 Responsive design

## Tech Stack

- Next.js 14
- TypeScript
- Tailwind CSS
- Supabase (Authentication & Database)
- Headless UI
- Hero Icons

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env.local` file with your Supabase credentials:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```
5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
├── app/                    # Next.js app directory
│   ├── (auth)/            # Authentication routes
│   ├── admin/             # Admin dashboard routes
│   ├── api/               # API routes
│   └── page.tsx           # Landing page
├── components/            # Reusable components
├── contexts/             # React contexts
├── lib/                  # Utility functions
├── types/                # TypeScript types
└── public/              # Static assets
```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the MIT License.
