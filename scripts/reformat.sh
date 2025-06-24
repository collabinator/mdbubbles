#!/bin/bash
# Script to auto-format and lint-fix the codebase
# Runs: black, isort, ruff check --fix

set -e

log_info() {
    echo -e "\033[1;34m[INFO]\033[0m $1"
}

log_info "Running black..."
poetry run black .

log_info "Running isort..."
poetry run isort .

log_info "Running ruff check --fix..."
poetry run ruff check --fix .

log_info "Reformatting complete!"
