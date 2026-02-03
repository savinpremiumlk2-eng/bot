# Infinity MD - WhatsApp Bot

## Overview

Infinity MD is a multi-device WhatsApp bot built on Node.js using the Baileys library. It provides automated messaging, group management, media downloading, AI integrations, and various utility commands. The bot supports multiple deployment platforms including Heroku, Railway, and Replit, with flexible database options for persistent storage.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Core Framework
- **Runtime**: Node.js with Express.js server for health checks and status endpoints
- **WhatsApp Integration**: Uses `@whiskeysockets/baileys` library for WhatsApp Web multi-device protocol
- **Session Management**: Credentials stored in `session/` directory, fetched from GitHub Gist via session ID

### Plugin System
- **Command Handler**: Centralized command registration in `lib/commandHandler.js`
- **Hot Reloading**: File watcher monitors `plugins/` folder for live code updates without restart
- **Plugin Structure**: Each plugin exports `command`, `aliases`, `category`, `description`, `handler` function
- **Prefix Support**: Multiple command prefixes (`.`, `!`, `/`, `#`) configured in `settings.js`

### Data Storage Architecture
The bot uses a flexible storage system that automatically selects the best available option:

1. **Database Priority** (checked in order):
   - MongoDB (`MONGO_URL`)
   - PostgreSQL (`POSTGRES_URL`) 
   - MySQL (`MYSQL_URL`)
   - SQLite (`DB_URL`)

2. **Fallback**: JSON files in `data/` directory when no database is configured

3. **Lightweight Store** (`lib/lightweight_store.js`): Unified API for settings storage regardless of backend

### Message Handling Flow
1. Messages received via Baileys socket events
2. `lib/messageHandler.js` processes incoming messages
3. Auto-features checked (autoread, autotyping, chatbot, antilink, antibadword)
4. Command parsed and routed to appropriate plugin handler
5. Response sent back through socket

### Key Components
- **`index.js`**: Main entry point, initializes Baileys connection and event handlers
- **`lib/server.js`**: Express server for uptime monitoring (port 5000)
- **`lib/lightweight_store.js`**: Database abstraction layer with message caching
- **`lib/messageHandler.js`**: Central message processing and command routing
- **`lib/commandHandler.js`**: Plugin loading, command registration, cooldown management
- **`settings.js`**: Bot configuration (prefixes, owner number, timezone, etc.)
- **`config.js`**: API keys and external service URLs

### Group Management Features
- Welcome/Goodbye messages
- Anti-link detection with configurable actions (delete/warn/kick)
- Anti-badword filtering
- Anti-tag spam protection
- Admin permission checks via `lib/isAdmin.js`

### Media Processing
- Sticker creation with EXIF metadata (`lib/exif.js`, `lib/sticker.js`)
- Audio effects using FFmpeg (`plugins/audiofx.js`)
- Image/video conversion and upload utilities

## External Dependencies

### WhatsApp Connection
- **Baileys**: `@whiskeysockets/baileys` v7.0.0-rc.9 for WhatsApp Web protocol
- **Session Storage**: GitHub Gist for credential persistence across deployments

### Database Options
- **MongoDB**: Via `mongoose` package for document storage
- **PostgreSQL**: Via `pg` package 
- **MySQL**: Via `mysql2` package
- **SQLite**: Via `better-sqlite3` for local file-based storage

### Media Processing
- **FFmpeg**: Required system dependency for audio/video processing
- **Sharp**: Image manipulation and resizing
- **node-webpmux**: WebP sticker creation with metadata

### External APIs
- **AI Services**: Multiple GPT/Gemini API endpoints for chatbot functionality
- **Download APIs**: YouTube, Spotify, APK mirrors via third-party scrapers
- **Image APIs**: Various anime, wallpaper, and image generation services
- **RemoveBG**: Background removal (requires `REMOVEBG_KEY`)

### Deployment Platforms
- **Heroku**: Requires `HKEY` (API key) and `HAPP` (app name) environment variables
- **Railway**: Docker-based deployment via `railway.json`
- **Replit**: Standard Node.js deployment

### Required Environment Variables
- `SESSION_ID`: WhatsApp session identifier (required)
- `MONGO_URL` / `POSTGRES_URL` / `MYSQL_URL`: Database connection (optional, uses JSON fallback)
- `HKEY` / `HAPP`: Heroku deployment credentials (if using Heroku)
- `REMOVEBG_KEY`: Remove.bg API key (optional)