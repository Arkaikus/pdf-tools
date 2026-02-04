.PHONY: help install dev build start stop restart logs clean docker-build docker-up docker-down docker-logs

# Default target
help:
	@echo "PDF Tools - Available Commands"
	@echo "================================"
	@echo ""
	@echo "Development:"
	@echo "  make install       - Install dependencies with Bun"
	@echo "  make dev           - Start development server"
	@echo "  make build         - Build for production"
	@echo ""
	@echo "Docker (Production):"
	@echo "  make docker-build  - Build Docker image"
	@echo "  make docker-up     - Start Docker containers"
	@echo "  make docker-down   - Stop Docker containers"
	@echo "  make docker-logs   - View Docker logs"
	@echo "  make docker-restart- Restart Docker containers"
	@echo ""
	@echo "Docker (Development):"
	@echo "  make docker-dev    - Start development container"
	@echo ""
	@echo "Maintenance:"
	@echo "  make clean         - Clean build artifacts and logs"
	@echo "  make clean-all     - Clean everything including node_modules"
	@echo ""

# Development commands
install:
	bun install

dev:
	bun run dev

build:
	bun run build

start:
	bun run start

# Docker production commands
docker-build:
	docker-compose build pdf-tools

docker-up:
	docker-compose up -d pdf-tools

docker-down:
	docker-compose down

docker-logs:
	docker-compose logs -f pdf-tools

docker-restart:
	docker-compose restart pdf-tools

# Docker development commands
docker-dev:
	docker-compose --profile dev up pdf-tools-dev

# Maintenance commands
clean:
	rm -rf dist/
	rm -rf logs/
	rm -rf *.log

clean-all: clean
	rm -rf node_modules/
	rm -rf bun.lock

# Quick start
quick-start: docker-build docker-up
	@echo ""
	@echo "✅ PDF Tools is starting..."
	@echo "🌐 Access at: http://localhost:3000"
	@echo ""
	@echo "📋 Useful commands:"
	@echo "   make docker-logs  - View logs"
	@echo "   make docker-down  - Stop server"
	@echo ""

# Full rebuild
rebuild: docker-down clean docker-build docker-up
	@echo "✅ Rebuilt and restarted PDF Tools"
