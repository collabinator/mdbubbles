#!/bin/bash
set -e

# Pre-release check script for mdbub
# Usage: ./scripts/precheck.sh

BLUE='\033[0;34m'
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}
log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}
log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

log_info "Running pre-commit hooks..."
if ! poetry run pre-commit run --all-files; then
    log_error "pre-commit failed. Please fix the issues above before releasing."
    exit 1
fi

# log_info "Running mypy type checks..."
# if ! poetry run mypy .; then
#     log_error "mypy type checks failed. Please fix the issues above before releasing."
#     exit 1
# fi

# log_info "Running ruff lint checks..."
# if ! poetry run ruff check .; then
#     log_error "ruff lint checks failed. Please fix the issues above before releasing."
#     exit 1
# fi

# log_info "Running black formatting check..."
# if ! poetry run black --check .; then
#     log_error "black formatting check failed. Please fix the issues above before releasing."
#     exit 1
# fi

# log_info "Running isort import check..."
# if ! poetry run isort --check-only .; then
#     log_error "isort import check failed. Please fix the issues above before releasing."
#     exit 1
# fi

# log_info "Running pytest..."
# if ! poetry run pytest tests/ -v; then
#     log_error "pytest failed. Please fix the issues above before releasing."
#     exit 1
# fi

log_success "All pre-release checks passed!"
