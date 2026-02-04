#!/bin/bash

# PDF Tools - Quick Setup Script
# This script helps you get started with PDF Tools development

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Functions
print_header() {
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BLUE}  PDF Tools - Setup Script${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
}

print_success() {
    echo -e "${GREEN}✓${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

print_info() {
    echo -e "${BLUE}ℹ${NC} $1"
}

# Check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check prerequisites
check_prerequisites() {
    echo -e "\n${BLUE}Checking prerequisites...${NC}\n"
    
    local all_good=true
    
    # Check Bun
    if command_exists bun; then
        local bun_version=$(bun --version)
        print_success "Bun is installed (v$bun_version)"
    else
        print_error "Bun is not installed"
        print_info "Install from: https://bun.sh"
        all_good=false
    fi
    
    # Check Docker
    if command_exists docker; then
        print_success "Docker is installed"
    else
        print_warning "Docker is not installed (optional for local dev)"
    fi
    
    # Check Docker Compose
    if command_exists docker-compose || docker compose version >/dev/null 2>&1; then
        print_success "Docker Compose is available"
    else
        print_warning "Docker Compose is not available (optional for local dev)"
    fi
    
    # Check Git
    if command_exists git; then
        print_success "Git is installed"
    else
        print_warning "Git is not installed (optional)"
    fi
    
    echo ""
    
    if [ "$all_good" = false ]; then
        print_error "Please install missing prerequisites before continuing"
        exit 1
    fi
}

# Setup environment
setup_environment() {
    echo -e "\n${BLUE}Setting up environment...${NC}\n"
    
    # Copy .env.example to .env if it doesn't exist
    if [ ! -f .env ]; then
        cp .env.example .env
        print_success "Created .env file from .env.example"
    else
        print_info ".env file already exists"
    fi
}

# Install dependencies
install_dependencies() {
    echo -e "\n${BLUE}Installing dependencies...${NC}\n"
    
    bun install
    
    if [ $? -eq 0 ]; then
        print_success "Dependencies installed successfully"
    else
        print_error "Failed to install dependencies"
        exit 1
    fi
}

# Create necessary directories
create_directories() {
    echo -e "\n${BLUE}Creating directories...${NC}\n"
    
    mkdir -p logs
    mkdir -p dist
    
    print_success "Directories created"
}

# Display next steps
show_next_steps() {
    echo ""
    echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${GREEN}  Setup Complete! 🎉${NC}"
    echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
    echo -e "${BLUE}Next Steps:${NC}"
    echo ""
    echo -e "  ${YELLOW}1. Start Development Server:${NC}"
    echo -e "     ${GREEN}bun dev${NC}"
    echo -e "     or"
    echo -e "     ${GREEN}make dev${NC}"
    echo ""
    echo -e "  ${YELLOW}2. Build for Production:${NC}"
    echo -e "     ${GREEN}bun run build${NC}"
    echo -e "     or"
    echo -e "     ${GREEN}make build${NC}"
    echo ""
    echo -e "  ${YELLOW}3. Run with Docker:${NC}"
    echo -e "     ${GREEN}make docker-build && make docker-up${NC}"
    echo -e "     or"
    echo -e "     ${GREEN}make quick-start${NC}"
    echo ""
    echo -e "${BLUE}Useful Commands:${NC}"
    echo ""
    echo -e "  ${GREEN}make help${NC}          - Show all available commands"
    echo -e "  ${GREEN}bun test${NC}          - Run tests"
    echo -e "  ${GREEN}make docker-logs${NC}  - View Docker logs"
    echo ""
    echo -e "${BLUE}Documentation:${NC}"
    echo ""
    echo -e "  • ${GREEN}README.md${NC}         - Project overview"
    echo -e "  • ${GREEN}TODO.md${NC}           - Development roadmap"
    echo -e "  • ${GREEN}ARCHITECTURE.md${NC}   - Technical architecture"
    echo -e "  • ${GREEN}CONTRIBUTING.md${NC}   - Contribution guidelines"
    echo ""
    echo -e "${BLUE}Access the app:${NC}"
    echo ""
    echo -e "  • Development: ${GREEN}http://localhost:3000${NC}"
    echo -e "  • Docker:      ${GREEN}http://localhost:3000${NC}"
    echo ""
}

# Main execution
main() {
    print_header
    
    # Ask for confirmation
    echo -e "This script will:"
    echo "  • Check prerequisites (Bun, Docker, etc.)"
    echo "  • Create .env file from template"
    echo "  • Install dependencies"
    echo "  • Create necessary directories"
    echo ""
    
    read -p "Continue? (y/n) " -n 1 -r
    echo ""
    
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        print_info "Setup cancelled"
        exit 0
    fi
    
    # Run setup steps
    check_prerequisites
    setup_environment
    install_dependencies
    create_directories
    show_next_steps
}

# Run main function
main
