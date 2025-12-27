.PHONY: build test clean install run lint fmt vet

# Build variables
BINARY_NAME=mdbub
VERSION=0.5.0
BUILD_DIR=build
GO_FILES=$(shell find . -name '*.go' -not -path './vendor/*')

# Build the binary
build:
	@echo "Building $(BINARY_NAME)..."
	@mkdir -p $(BUILD_DIR)
	go build -ldflags="-s -w -X 'github.com/collabinator/mdbubbles/internal/cli.version=$(VERSION)'" -o $(BUILD_DIR)/$(BINARY_NAME) ./cmd/mdbub

# Build for multiple platforms
build-all:
	@echo "Building for multiple platforms..."
	@mkdir -p $(BUILD_DIR)
	GOOS=linux GOARCH=amd64 go build -ldflags="-s -w" -o $(BUILD_DIR)/$(BINARY_NAME)-linux-amd64 ./cmd/mdbub
	GOOS=linux GOARCH=arm64 go build -ldflags="-s -w" -o $(BUILD_DIR)/$(BINARY_NAME)-linux-arm64 ./cmd/mdbub
	GOOS=darwin GOARCH=amd64 go build -ldflags="-s -w" -o $(BUILD_DIR)/$(BINARY_NAME)-darwin-amd64 ./cmd/mdbub
	GOOS=darwin GOARCH=arm64 go build -ldflags="-s -w" -o $(BUILD_DIR)/$(BINARY_NAME)-darwin-arm64 ./cmd/mdbub
	GOOS=windows GOARCH=amd64 go build -ldflags="-s -w" -o $(BUILD_DIR)/$(BINARY_NAME)-windows-amd64.exe ./cmd/mdbub

# Run tests
test:
	@echo "Running tests..."
	go test -v -race -coverprofile=coverage.out ./...

# Run tests with coverage report
test-coverage:
	@echo "Running tests with coverage..."
	go test -v -race -coverprofile=coverage.out ./...
	go tool cover -html=coverage.out -o coverage.html
	@echo "Coverage report generated: coverage.html"

# Clean build artifacts
clean:
	@echo "Cleaning..."
	@rm -rf $(BUILD_DIR)
	@rm -f coverage.out coverage.html
	@rm -f $(BINARY_NAME)

# Install the binary to GOPATH/bin
install:
	@echo "Installing $(BINARY_NAME)..."
	go install ./cmd/mdbub

# Run the application
run:
	go run ./cmd/mdbub

# Run linter
lint:
	@echo "Running linter..."
	@which golangci-lint > /dev/null || (echo "golangci-lint not installed. Install it from https://golangci-lint.run/usage/install/" && exit 1)
	golangci-lint run ./...

# Format code
fmt:
	@echo "Formatting code..."
	gofmt -s -w $(GO_FILES)

# Run go vet
vet:
	@echo "Running go vet..."
	go vet ./...

# Check code (fmt, vet, test)
check: fmt vet test
	@echo "All checks passed!"

# Update dependencies
deps:
	@echo "Updating dependencies..."
	go mod tidy
	go mod verify

# Show help
help:
	@echo "Available targets:"
	@echo "  build         - Build the binary"
	@echo "  build-all     - Build for multiple platforms"
	@echo "  test          - Run tests"
	@echo "  test-coverage - Run tests with coverage report"
	@echo "  clean         - Clean build artifacts"
	@echo "  install       - Install binary to GOPATH/bin"
	@echo "  run           - Run the application"
	@echo "  lint          - Run linter"
	@echo "  fmt           - Format code"
	@echo "  vet           - Run go vet"
	@echo "  check         - Run fmt, vet, and test"
	@echo "  deps          - Update dependencies"
	@echo "  help          - Show this help"
