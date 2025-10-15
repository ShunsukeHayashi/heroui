# heroui

Autonomous development powered by Agentic OS - HeroUI + Tldraw Canvas Image Generator

## Overview

This project combines the power of Miyabi framework's autonomous development with a React-based canvas image generation application using HeroUI and Tldraw.

## Features

- **Autonomous Development**: Powered by Miyabi framework with 6 AI agents
- **Canvas Image Generation**: Interactive canvas using Tldraw
- **Modern UI**: Beautiful interface with HeroUI components
- **GitHub Integration**: Automated Issue → PR pipeline
- **Type Safety**: Full TypeScript support

## Tech Stack

- React 18
- Vite
- TypeScript
- HeroUI
- Tldraw
- Tailwind CSS
- Framer Motion
- IndexedDB (via idb)

## Getting Started

### Prerequisites

- Node.js (v20+)
- npm

### Installation

Dependencies are already installed. To reinstall:

```bash
npm install
```

### Development

Start the development server:

```bash
npm run dev
```

### Build

Build the project for production:

```bash
npm run build
```

### Type Check

Run TypeScript type checking:

```bash
npm run typecheck
```

### Test

Run tests:

```bash
npm test
```

## Miyabi Framework

This project uses the Miyabi framework for autonomous development. The framework includes:

- **6 AI Agents**: Coordinator, Issue, CodeGen, Review, PR, Deployment, and Test agents
- **53 Labels**: Organized across 10 categories for state management
- **14 GitHub Actions**: Automated workflows for CI/CD
- **Claude Code Integration**: Custom commands and agents

### Creating Issues

The AI agents will automatically start working on your issues:

```bash
gh issue create --title "Your task" --body "Description"
```

### Miyabi Status

Check project status:

```bash
npx miyabi status
```

## Project Structure

```
heroui/
├── .claude/              # Claude Code configuration
│   ├── agents/          # AI agent definitions
│   ├── commands/        # Custom slash commands
│   └── settings.json    # Claude settings
├── .github/
│   └── workflows/       # GitHub Actions workflows
├── src/                 # Application source code
├── plugins/             # Vite plugins
├── index.html           # Entry HTML file
├── CLAUDE.md           # Claude Code context
└── package.json        # Dependencies and scripts
```

## Environment Variables

Create a `.env` file (already created during setup):

```bash
GITHUB_TOKEN=ghp_xxxxx        # Required for Miyabi
ANTHROPIC_API_KEY=sk-ant-xxx  # Required for AI agents
```

## Repository

- GitHub: https://github.com/ShunsukeHayashi/heroui
- Welcome Issue: https://github.com/ShunsukeHayashi/heroui/issues/1

## License

MIT
