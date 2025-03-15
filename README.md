# Blueprint

A simple CLI tool that generates project documentation files.

## Installation

```bash
# Clone the repository
git clone https://github.com/phrazzld/blueprint.git
cd blueprint

# Install dependencies
npm install

# Build the project
npm run build

# Install globally
npm link
```

## Usage

```bash
# Initialize a project with documentation
blueprint init

# For AI-powered generation of all documentation files:
# Edit the .env file created by the tool and add your OpenAI API key
# OPENAI_API_KEY=your-api-key-here
blueprint init

# Initialize with interactive wizard (default)
blueprint init

# Initialize without interactive mode
blueprint init --no-interactive

# Show help information
blueprint --help
```

## Features

- Generates multiple reference documentation files:
  - README.md - Project overview and instructions
  - DEVREF.md - Developer reference
  - AESTHETIC.md - Design principles and styles
  - ARCHITECTURE.md - System architecture
  - PLAN.md - Project planning
  - VISION.md - Project vision and strategic goals
  - CHECKLIST.md - Pre/post launch tasks
  - TODO.md - Task tracking
  - BUG.md - Bug tracking
- OpenAI integration for AI-powered content generation
  - All files can be AI-generated when an OpenAI API key is provided
  - Intelligently derives aesthetic guidelines from your project description
  - Falls back to template files when no API key is available
- Streamlined project documentation from a single brain dump
  - Just tell us about your project in a stream-of-consciousness style
  - We'll intelligently generate an entire set of detailed docs
  - Each document builds on the others for comprehensive coverage
- Simple and lightweight
- Can be run from any directory
- Skips existing files

## Development

```bash
# Run in development mode
npm run dev

# Build the project
npm run build
```

## License

MIT