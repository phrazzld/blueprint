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
  - CHECKLIST.md - Pre/post launch tasks
  - TODO.md - Task tracking
  - BUG.md - Bug tracking
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