.PHONY: build test lint clean

# Build variables
BINARY_NAME=blueprint
BUILD_DIR=bin

# Build the application
build:
	go build -o $(BUILD_DIR)/$(BINARY_NAME) ./cmd/blueprint

# Run the application
run: build
	./$(BUILD_DIR)/$(BINARY_NAME)

# Run tests
test:
	go test ./...

# Run tests with verbose output
test-verbose:
	go test -v ./...

# Run golangci-lint
lint:
	golangci-lint run

# Clean build artifacts
clean:
	rm -rf $(BUILD_DIR)
	
# Install dependencies
deps:
	go mod tidy
	
# Run all checks (tests and lint)
check: test lint

# Default target
all: clean build test lint