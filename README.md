# MOYD Jobs - Job & Volunteer Opportunities Board

Public-facing job board website for Missouri Young Democrats members.

**Domain:** jobs.moyoungdemocrats.org

## Features

- 🔓 **Public Job Submission** - Anyone can submit job/volunteer opportunities (pending approval)
- 🔒 **Member-Only Access** - Non-members see blurred job previews, members see full listings
- 📱 **Responsive Design** - Matches moyd-events.git styling with gradient header and clean cards
- 🎯 **Smart Filtering** - Job types, locations, paid vs volunteer positions
- ⏰ **Automatic Expiration** - Jobs expire automatically based on deadline
- ⭐ **Featured Jobs** - Highlight important opportunities

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS 4
- **Database:** Supabase (PostgreSQL)
- **Authentication:** Supabase Auth
- **Deployment:** Vercel

## Database Schema

The application requires a `jobs` table in Supabase with the following schema:

```sql
CREATE TABLE jobs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Position Details
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  organization TEXT NOT NULL,
  description TEXT NOT NULL,
  job_type TEXT NOT NULL CHECK (job_type IN ('full-time', 'part-time', 'internship', 'volunteer', 'contract')),
  location TEXT,
  location_type TEXT CHECK (location_type IN ('in-person', 'remote', 'hybrid')),

  -- Compensation
  is_paid BOOLEAN DEFAULT false,
  salary_range TEXT,
  hourly_rate TEXT,

  -- Requirements
  requirements TEXT,
  qualifications TEXT,

  -- Contact & Application
  contact_email TEXT NOT NULL,
  contact_name TEXT,
  contact_phone TEXT,
  application_url TEXT,
  application_instructions TEXT,

  -- Submitter Information
  submitter_name TEXT NOT NULL,
  submitter_email TEXT NOT NULL,
  submitter_organization TEXT,
  submitter_phone TEXT,

  -- Status & Metadata
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'archived')),
  featured BOOLEAN DEFAULT false,
  expires_at TIMESTAMP WITH TIME ZONE
);

-- Create index for faster queries
CREATE INDEX idx_jobs_status ON jobs(status);
CREATE INDEX idx_jobs_slug ON jobs(slug);
CREATE INDEX idx_jobs_featured ON jobs(featured);
CREATE INDEX idx_jobs_expires_at ON jobs(expires_at);
```

You'll also need a `members` table for authentication:

```sql
CREATE TABLE members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn
- Supabase account and project

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/andyhartzler/moyd-jobs.git
   cd moyd-jobs
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**

   Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

   Update `.env.local` with your Supabase credentials:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```

4. **Set up Supabase database**

   Run the SQL schema above in your Supabase SQL editor to create the required tables.

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**

   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
moyd-jobs/
├── src/
│   ├── app/
│   │   ├── page.tsx                    # Homepage (job listings)
│   │   ├── layout.tsx                  # Root layout with Header
│   │   ├── globals.css                 # Global styles
│   │   ├── submit/
│   │   │   ├── page.tsx               # Submit job form
│   │   │   └── success/
│   │   │       └── page.tsx           # Submission confirmation
│   │   └── jobs/
│   │       └── [slug]/
│   │           └── page.tsx           # Job detail page
│   ├── components/
│   │   ├── Header.tsx                 # Navigation header
│   │   ├── JobCard.tsx                # Job card for members
│   │   ├── BlurredJobPreview.tsx      # Blurred preview for non-members
│   │   └── MembershipPrompt.tsx       # Join MOYD call-to-action
│   └── lib/
│       ├── supabase.ts                # Client-side Supabase client
│       └── supabase-server.ts         # Server-side Supabase client
├── public/
│   └── images/
├── .env.example                        # Environment variables template
├── .env.local                          # Your local environment (not committed)
└── package.json
```

## Key Features

### For Visitors (Non-Members)

- View blurred job previews with limited information
- See stats: total jobs, paid positions, volunteer roles, remote options
- Submit job opportunities (pending approval)
- Prompted to join MOYD to view full details

### For Members (Authenticated)

- View complete job listings with full details
- See contact information and application links
- Access featured opportunities
- Filter by job type, location, and compensation

### For Administrators

Job approval workflow requires Supabase admin access:
- Review pending submissions in Supabase dashboard
- Approve/reject jobs by updating the `status` field
- Mark jobs as `featured` for highlight visibility
- Archive expired or filled positions

## Deployment

### Deploy to Vercel

1. **Connect repository to Vercel**
   ```bash
   vercel link
   ```

2. **Configure environment variables**

   In Vercel dashboard, add:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

3. **Deploy**
   ```bash
   vercel --prod
   ```

4. **Configure custom domain**

   In Vercel dashboard:
   - Go to Project Settings → Domains
   - Add: `jobs.moyoungdemocrats.org`
   - Update DNS with provided CNAME/A records

## Design Guidelines

The design matches **moyd-events.git** styling:

- **Color Scheme:** Blue gradient header (`from-blue-600 to-blue-800`)
- **Typography:** System fonts with Geist Sans/Mono
- **Cards:** White backgrounds, subtle shadows, rounded corners
- **Buttons:** Blue primary (`bg-blue-600`), hover states
- **Responsive:** Mobile-first with Tailwind breakpoints
- **Accessibility:** WCAG 2.1 AA compliant

## Membership Integration

Member authentication uses the existing MOYD members portal:

- **Login URL:** `https://members.moyoungdemocrats.org/login`
- **Signup URL:** `https://docs.google.com/forms/d/e/1FAIpQLSd5Hd_cgdFmgE7f9gdIxmwXSAdxkuFuITENO_x5VkhDrtR8Ag/viewform?pli=1`

Members are identified via Supabase Auth session + `members` table lookup.

## Development

### Run tests
```bash
npm run test
```

### Build for production
```bash
npm run build
```

### Run production build locally
```bash
npm run start
```

### Lint code
```bash
npm run lint
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

Copyright © 2024 Missouri Young Democrats. All rights reserved.

## Support

For issues or questions:
- **Issues:** [GitHub Issues](https://github.com/andyhartzler/moyd-jobs/issues)
- **Email:** contact@moyoungdemocrats.org
- **Website:** [moyoungdemocrats.org](https://moyoungdemocrats.org)
