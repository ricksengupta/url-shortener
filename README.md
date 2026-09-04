# justshortURL

A full-stack URL shortener application that allows users to create short, shareable links and track detailed analytics about link activity.

Built with Next.js, PostgreSQL, Prisma, Clerk Authentication, and deployed on Vercel.

## Live Demo

[Visit justshortURL](https://url-shortener-flax-nine-43.vercel.app/)

---

## Overview

justshortURL is a full-stack web application that converts long URLs into short, shareable links.

Authenticated users can manage their shortened links from a personal dashboard and view analytics including:

* Total clicks
* Clicks over time
* Browser statistics
* Device statistics
* Operating system statistics
* Recent click information
* Location data such as country and city

The application is designed as a practical SaaS-style project and includes authentication, database persistence, analytics tracking, responsive design, loading states, and error handling.

---

## Features

### URL Shortening

Users can submit a long URL and receive a unique shortened link.

Example:

```text
Original URL:
https://www.example.com/products/category/something/very-long

Short URL:
https://your-domain.vercel.app/abc123
```

Each generated short code is checked against the database to ensure uniqueness.

---

### Authentication

Authentication is handled using Clerk.

Users can:

* Sign up
* Sign in
* Sign out
* Access their personal dashboard

Server-side authentication ensures that users can only create and manage their own URLs.

---

### Personal Dashboard

Each authenticated user has access to a dashboard displaying:

* Total links created
* Total clicks across all links
* Average clicks per link
* Most recently created link

The dashboard also supports:

* Search
* Sorting
* Pagination
* URL management

---

### URL Analytics

Each shortened URL has its own analytics page.

The application tracks:

* Total clicks
* Clicks over time
* Browser
* Device type
* Operating system
* Country
* City

Analytics data is visualized using interactive charts.

---

### Click Tracking

When someone visits a shortened URL:

```text
User visits short URL
        ↓
Application finds the URL
        ↓
Click information is collected
        ↓
Analytics record is stored
        ↓
Click count is incremented
        ↓
User is redirected to the original URL
```

The application records click metadata while redirecting the user to the original destination.

---

### QR Code Generation

Users can generate QR codes for their shortened URLs, making links easier to share offline or across devices.

---

### Responsive Design

The application is responsive and optimized for:

* Desktop
* Tablet
* Mobile devices

Tailwind CSS is used for styling and responsive layouts.

---

### Loading and Error States

The application includes:

* Global loading UI
* Dashboard loading skeletons
* Branded error pages
* Graceful handling of invalid routes

---

## Tech Stack

### Frontend

* Next.js 16
* React 19
* TypeScript
* Tailwind CSS

### Backend

* Next.js Server Actions
* Next.js App Router
* Server Components

### Database

* PostgreSQL
* Prisma ORM
* Prisma PostgreSQL Adapter

### Authentication

* Clerk

### Analytics and Visualization

* Recharts
* ua-parser-js

### Additional Libraries

* qrcode.react

### Deployment

* Vercel
* Neon PostgreSQL

---

# Architecture

The application follows a full-stack Next.js architecture.

```text
                    ┌─────────────────┐
                    │      User       │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │    Next.js      │
                    │   Application   │
                    └────────┬────────┘
                             │
              ┌──────────────┼──────────────┐
              ▼              ▼              ▼
       ┌────────────┐  ┌────────────┐  ┌────────────┐
       │   Clerk    │  │   Server   │  │   Prisma   │
       │    Auth    │  │  Actions   │  │    ORM     │
       └────────────┘  └────────────┘  └──────┬─────┘
                                              │
                                              ▼
                                      ┌──────────────┐
                                      │ PostgreSQL   │
                                      │    Neon      │
                                      └──────────────┘
```

---

# Request Flow

## Creating a Short URL

```text
User enters URL
       ↓
Form submission
       ↓
Next.js Server Action
       ↓
User authentication check
       ↓
Zod validation
       ↓
Generate unique short code
       ↓
Prisma database query
       ↓
PostgreSQL
       ↓
URL created
       ↓
Dashboard updated
```

---

## Redirect and Analytics Flow

```text
Visitor opens:

/abc123

       ↓

Application searches database
for shortCode

       ↓

URL found?

       │
   Yes │
       ▼

Collect click information

       ↓

Store Click record

       ↓

Increment clickCount

       ↓

Redirect visitor

       ↓

Original URL
```

---

# Database Design

The application uses PostgreSQL with Prisma ORM.

## URL Model

Each shortened URL stores:

```text
Url
├── id
├── originalUrl
├── shortCode
├── clerkUserId
├── clickCount
├── createdAt
└── Click[]
```

## Click Model

Each click stores analytics information:

```text
Click
├── id
├── urlId
├── browser
├── device
├── os
├── country
├── city
└── clickedAt
```

Relationship:

```text
One URL
   │
   │
   └───────────────┐
                   │
                   ▼
              Many Clicks
```

This allows each shortened URL to have multiple analytics records.

---

# Project Structure

```text
app/
├── actions/
│   └── url.ts
│
├── dashboard/
│   ├── analytics/
│   ├── loading.tsx
│   └── page.tsx
│
├── [shortCode]/
│   └── page.tsx
│
├── error.tsx
├── loading.tsx
├── page.tsx
└── layout.tsx

components/
├── BrowserChart.tsx
├── ClicksOverTimeChart.tsx
├── CopyButton.tsx
├── DeleteButton.tsx
├── DeviceChart.tsx
├── OSChart.tsx
├── Pagination.tsx
├── QRButton.tsx
├── SearchBar.tsx
├── SortDropdown.tsx
└── UrlCard.tsx

lib/
├── prisma.ts
├── shortCode.ts
└── validation/

prisma/
├── migrations/
└── schema.prisma
```

---

# Key Technical Concepts Used

## Server Actions

Server Actions handle operations such as:

* Creating URLs
* Deleting URLs

This allows form submissions to communicate directly with server-side logic without creating separate REST API endpoints.

---

## Prisma ORM

Prisma is used to communicate with PostgreSQL.

Examples of database operations include:

```text
Create URL
Find URL
Delete URL
Count URLs
Aggregate click statistics
Group analytics data
```

---

## Authentication and Authorization

Clerk handles user authentication.

The application also performs authorization checks on the server.

For example, when deleting a URL, the database query ensures that the URL belongs to the authenticated user.

This prevents users from deleting another user's URLs.

---

## Database Aggregation

The dashboard uses Prisma aggregation queries to calculate:

```text
Total clicks
Average clicks
Total links
```

Analytics pages use grouping queries to calculate statistics by:

```text
Browser
Device
Operating system
```

---


## Navigate into the project

```bash
cd url-shortener
```

## Install dependencies

```bash
npm install
```

## Create environment variables

Create a `.env.local` file:

```env
DATABASE_URL="your_postgresql_connection_string"

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="your_clerk_publishable_key"

CLERK_SECRET_KEY="your_clerk_secret_key"

NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

## Generate Prisma Client

```bash
npx prisma generate
```

## Run database migrations

```bash
npx prisma migrate dev
```

## Start the development server

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

---

# Production Deployment

The application is deployed using:

```text
GitHub
   ↓
Vercel
   ↓
Next.js Application
   ↓
Prisma
   ↓
Neon PostgreSQL
```

Environment variables are configured in Vercel for production.

Database migrations are applied using:

```bash
npx prisma migrate deploy
```

The production build generates the Prisma Client before building Next.js:

```json
"build": "prisma generate && next build"
```

---

# Future Improvements

Potential improvements for future versions include:

* Custom domains for shortened URLs
* Rate limiting
* Unique visitor tracking
* Referrer analytics
* More detailed geographic analytics
* Link expiration
* Custom short codes
* Automated testing
* API access
* Link folders and organization
* Advanced analytics filters

---

# What I Learned

This project helped me gain practical experience with:

* Building full-stack applications with Next.js
* Next.js App Router architecture
* Server Components and Server Actions
* Authentication and authorization
* PostgreSQL database design
* Prisma ORM and database migrations
* Analytics data collection
* Database aggregation and grouping
* Responsive UI design
* Production environment variables
* Deploying full-stack applications
* Connecting Vercel with Neon PostgreSQL

---

# Author

**Ayush Sengupta**

GitHub: https://github.com/ricksengupta

---

If you found this project interesting, feel free to explore the code and provide feedback.
