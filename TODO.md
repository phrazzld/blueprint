# Blueprint CLI Implementation TODO (Go)

## Project Setup
- [x] Initialize Go module with `go mod init github.com/phrazzld/blueprint`
- [x] Set up basic directory structure (cmd/, internal/, pkg/)
- [x] Configure Go linting with golangci-lint
- [x] Set up testing framework with Go's built-in testing package
- [x] Create Makefile for common operations
- [x] Set up .gitignore file

## Core CLI Framework
- [x] Research and choose CLI framework (cobra, urfave/cli)
- [x] Implement basic CLI structure with root command
- [x] Add help and version commands
- [x] Implement command for creating new project
- [x] Write unit tests for CLI commands

## Interactive Prompts
- [x] Research and choose prompt library (survey, promptui)
- [x] Implement project name prompt with validation
- [x] Implement project description prompt
- [x] Implement technology stack selection prompt
- [x] Implement dockerization preference prompt (yes/no)
- [x] Implement analytics selection prompt
- [x] Implement testing framework selection prompt
- [x] Implement feature flags prompt (yes/no)
- [x] Create configuration struct to store user inputs
- [x] Write unit tests for prompts module

## Markdown Template Management
- [x] Set up mechanism to use existing markdown templates from refs/ directory
- [x] Implement markdown template loading
- [x] Add templating engine for markdown files (text/template)
- [x] Write unit tests for template management

## Directory and File Generation
- [x] Implement target directory creation
- [x] Implement markdown file generation from templates
- [x] Generate README.md with project info
- [x] Generate PLAN.md with project details
- [x] Generate DEVREF.md from template
- [x] Generate AESTHETIC.md from template
- [x] Generate ARCHITECTURE.md from template
- [x] Generate CHECKLIST.md from template
- [x] Generate CLAUDE.md from template
- [x] Write unit tests for file generation

## OpenAI Integration
- [ ] Implement OpenAI API client
- [ ] Add API key management (environment variables)
- [ ] Create prompt for generating PLAN.md content
- [ ] Create prompt for generating AESTHETIC.md content
- [ ] Create prompt for generating ARCHITECTURE.md content
- [ ] Implement response parsing for markdown
- [ ] Write unit tests for OpenAI integration

## Logging and Error Handling
- [ ] Implement structured logging package
- [ ] Add error handling for user inputs
- [ ] Add error handling for file operations
- [ ] Add error handling for OpenAI API calls
- [ ] Implement graceful error recovery
- [ ] Write unit tests for error handling

## Documentation
- [ ] Write godoc documentation for all exported functions
- [ ] Create CLI usage documentation
- [ ] Document template customization options
