#!/bin/bash
set -e

# Release script for mdbub
# Usage: ./scripts/release.sh [version]

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if version is provided
if [ $# -eq 0 ]; then
    current_version=$(poetry version -s)
    log_info "Current version: $current_version"
    echo "Usage: $0 <version>"
    echo "Example: $0 1.2.0"
    exit 1
fi

VERSION=$1

# Validate version format (semantic versioning)
if ! [[ $VERSION =~ ^[0-9]+\.[0-9]+\.[0-9]+(-[a-zA-Z0-9]+)?$ ]]; then
    log_error "Invalid version format. Use semantic versioning (e.g., 1.2.0 or 1.2.0-beta1)"
    exit 1
fi

log_info "Starting release process for version $VERSION"

# Check if we're on main branch
current_branch=$(git branch --show-current)
if [ "$current_branch" != "main" ]; then
    log_warning "You are not on the main branch (currently on: $current_branch)"
    read -p "Continue anyway? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        log_info "Release cancelled"
        exit 1
    fi
fi

# Check if working directory is clean
if ! git diff-index --quiet HEAD --; then
    log_error "Working directory is not clean. Please commit or stash changes."
    exit 1
fi

# Pull latest changes
log_info "Pulling latest changes..."
git pull origin main

# Run tests
log_info "Running tests..."
if ! poetry run pytest tests/ -v; then
    log_error "Tests failed. Please fix them before releasing."
    exit 1
fi

# Run pre-commit hooks on all files
log_info "Running pre-commit hooks..."
if ! poetry run pre-commit run --all-files; then
    log_error "pre-commit failed. Please fix the issues above before releasing."
    exit 1
fi

# Run mypy type checks
log_info "Running mypy type checks..."
if ! poetry run mypy .; then
    log_error "mypy type checks failed. Please fix the issues above before releasing."
    exit 1
fi

# Run ruff lint checks
log_info "Running ruff lint checks..."
if ! poetry run ruff check .; then
    log_error "ruff lint checks failed. Please fix the issues above before releasing."
    exit 1
fi

# Run linting
log_info "Running linting checks..."
if ! poetry run black --check .; then
    log_error "Code formatting check failed. Run 'poetry run black .' to fix."
    exit 1
fi

if ! poetry run isort --check-only .; then
    log_error "Import sorting check failed. Run 'poetry run isort .' to fix."
    exit 1
fi

# Update version in pyproject.toml
log_info "Updating version to $VERSION..."
poetry version $VERSION

# Ensure local venv is updated with new version
log_info "Re-installing package in local poetry environment..."
poetry install

# Update version info in __init__.py if needed
# This ensures the version is available at runtime
log_info "Updating version info..."

# Build the package
log_info "Building package..."
poetry build

# Commit version bump
log_info "Committing version bump..."
git add pyproject.toml
git commit -m "Bump version to $VERSION"

# Create and push tag
log_info "Creating and pushing tag v$VERSION..."
git tag "v$VERSION"
git push origin main
git push origin "v$VERSION"

log_success "Release $VERSION completed successfully!"
log_info "The GitHub Actions workflow will now:"
log_info "  1. Run tests on all platforms"
log_info "  2. Build binaries for Linux, macOS, and Windows"
log_info "  3. Create a GitHub release"
log_info "  4. Publish to PyPI"
log_info "  5. Update Homebrew and Chocolatey packages"
log_info ""
log_info "Check the GitHub Actions tab for progress: https://github.com/$(git config --get remote.origin.url | sed 's/.*github.com[:/]\(.*\)\.git/\1/')/actions"
