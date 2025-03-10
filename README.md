# URL Shortener

A modern, feature-rich URL shortening service built with Next.js, SQLite, and TypeScript.

## Features

- **URL Shortening**: Create short, easy-to-share links
- **Custom Short Codes**: Registered users can create custom short codes
- **User Accounts**: Register and login to manage your shortened URLs
- **Statistics**: Track visits to your shortened URLs
- **Responsive Design**: Works on desktop and mobile devices
- **Docker Support**: Easy deployment with Docker

## Tech Stack

- **Frontend**: Next.js, React, TailwindCSS
- **Backend**: Next.js API Routes
- **Database**: SQLite (via better-sqlite3)
- **Authentication**: NextAuth.js
- **Containerization**: Docker

## Getting Started

### Prerequisites

- Node.js 18+ (for local development)
- Docker and Docker Compose (for containerized deployment)

### Local Development

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/url-shortener.git
   cd url-shortener
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Docker Deployment

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/url-shortener.git
   cd url-shortener
   ```

2. Create a `.env` file for Docker:
   ```bash
   cp .env.example .env
   ```

3. Build and start the Docker container:
   ```bash
   docker-compose up -d
   ```

4. Access the application at [http://localhost:3000](http://localhost:3000).

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | The port the server runs on | `3000` |
| `NODE_ENV` | Environment mode | `development` |
| `NEXT_PUBLIC_BASE_URL` | Base URL for shortened links | `http://localhost:3000` |
| `NEXTAUTH_URL` | URL for NextAuth.js | `http://localhost:3000` |
| `NEXTAUTH_SECRET` | Secret for NextAuth.js sessions | `development-secret-key` |
| `SHORT_CODE_LENGTH` | Length of generated short codes | `6` |

## Project Structure

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/shorten` | POST | Create a shortened URL |
| `/api/stats/:shortCode` | GET | Get statistics for a URL |
| `/api/user/urls` | GET | Get all URLs for the current user |
| `/api/register` | POST | Register a new user |
| `/api/auth/[...nextauth]` | - | NextAuth.js authentication |

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [Next.js](https://nextjs.org/)
- [NextAuth.js](https://next-auth.js.org/)
- [TailwindCSS](https://tailwindcss.com/)
- [better-sqlite3](https://github.com/JoshuaWise/better-sqlite3)
