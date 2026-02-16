# Project: Youth Bot

## Overview
A Telegram bot built with Telegraf for youth ministry / pastor Q&A. Users ask questions via the bot; admins receive forwarded messages and can manage the admin list. The UI is in Russian.

## Core Features
- **Start command** — Greets users and prompts them to ask the pastor
- **Message handling** — Forwards user messages to all admins
- **Admin management** — Commands: `list` (list admins), `mod` (add admin by ID), `unmod` (remove admin)
- **Session** — Local JSON session storage via telegraf-session-local

## Tech Stack
- **Language:** TypeScript
- **Runtime:** Node.js
- **Bot framework:** Telegraf
- **Logging:** Pino
- **Config:** dotenv
- **Storage:** JSON files (admin.json, sessions.json)
- **DB deps:** sequelize, sequelize-typescript, pg (in package.json — not yet used in code)

## Architecture
- **Command pattern** — Each command extends `Command` base class
- **Singleton AdminService** — Manages admin IDs via admin.json
- **Config service** — Reads required keys from .env
- **Context** — `IBotContext` extends Telegraf Context with session typing

## Project Structure
```
src/
├── app.ts              # Entry point, bot setup, command registration
├── config/             # Config service and interface
├── commands/           # Bot commands (start, list, mod, unmod, message)
├── context/            # IBotContext and session interface
└── helpers/            # AdminService, logger
```

## Non-Functional Requirements
- **Logging:** Pino (configurable via LOG_LEVEL if needed)
- **Error handling:** Throws on missing .env or config keys
- **Security:** Admin commands protected by AdminService.isAdmin()
