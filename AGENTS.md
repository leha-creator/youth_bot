# AGENTS.md

> Project map for AI agents. Keep this file up-to-date as the project evolves.

## Project Overview
Telegram bot (Telegraf) for youth ministry Q&A: users ask the pastor via bot; admins manage messages and the admin list. UI in Russian.

## Tech Stack
- **Language:** TypeScript
- **Runtime:** Node.js
- **Framework:** Telegraf
- **Logging:** Pino
- **Storage:** JSON files (admin.json, sessions.json)

## Project Structure

```
youth_bot/
├── src/                        # Application source
│   ├── app.ts                  # Entry point: bot init, commands, launch
│   ├── config/                 # Configuration
│   │   ├── config.interface.ts # IConfigServise
│   │   └── config.servise.ts   # Dotenv-based config
│   ├── commands/               # Bot commands
│   │   ├── command.class.ts    # Base Command class
│   │   ├── start.command.ts    # /start
│   │   ├── list.command.ts     # /list (admins)
│   │   ├── mod.command.ts      # /mod (add admin)
│   │   ├── unmod.command.ts    # /unmod (remove admin)
│   │   └── message.command.ts  # Message forwarding to admins
│   ├── context/                # Bot context
│   │   └── context.interface.ts # IBotContext, ISessionData
│   └── helpers/                # Shared services
│       ├── admin.service.ts    # Admin list (admin.json)
│       └── logger.ts          # Pino logger
├── .ai-factory/                # AI Factory project spec
│   └── DESCRIPTION.md         # Full project specification
├── package.json
├── tsconfig.json
├── admin.json                  # Runtime: admin IDs (generated)
└── sessions.json               # Runtime: telegraf sessions (generated)
```

## Key Entry Points

| File | Purpose |
|------|---------|
| `src/app.ts` | Main entry — bot init, command registration, launch |
| `package.json` | Scripts: `build` (tsc), `start` (node dist/app.js) |
| `tsconfig.json` | TypeScript compiler options, outDir: dist |
| `.env` | Required: `TOKEN` (Telegram bot token) |

## Documentation

| Document | Path | Description |
|----------|------|-------------|
| Project spec | .ai-factory/DESCRIPTION.md | Tech stack, architecture, features |

## AI Context Files

| File | Purpose |
|------|---------|
| AGENTS.md | This file — project structure map |
| .ai-factory/DESCRIPTION.md | Project specification and tech stack |
