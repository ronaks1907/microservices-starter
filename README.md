# Microservices Demo Monorepo

A production-style microservices sample application built with **React.js**, **Node.js/Express**, **MySQL**, **Docker**, and **Docker Compose**. Perfect for learning and deployment practice on EKS, ECS, EC2, and Kubernetes.

## Dashboard Preview

The frontend provides a clean dashboard to monitor all microservices with real-time health checks and inter-service communication visualization.

![Microservices Dashboard](./docs/dashboard-screenshot.png)

**Dashboard Features:**
- Real-time service health status (UP/DOWN indicators)
- Individual service ping buttons
- Service response JSON display
- Inter-service communication viewer
- Order & Payment service downstream communication visualization

## Architecture

| Component | Purpose | Port |
|-----------|---------|------|
| **frontend** | React.js dashboard UI | 3000 |
| **user-service** | User management microservice | 3001 |
| **product-service** | Product catalog microservice | 3002 |
| **order-service** | Order processing microservice | 3003 |
| **payment-service** | Payment processing microservice | 3004 |
| **notification-service** | Notification microservice | 3005 |
| **MySQL** | Shared database | 3306 |

### Each Microservice Includes

- ✅ `GET /health` - Health check endpoint
- ✅ `GET /ping` - Ping/availability endpoint
- ✅ `GET /internal` - Inter-service communication endpoint
- ✅ MySQL connectivity with sample data
- ✅ Request logging with timestamps
- ✅ CORS enabled for cross-origin requests
- ✅ Docker containerization

## Getting Started

### Prerequisites

- **Docker & Docker Compose** (for containerized setup)
- **Node.js 18+** (for manual local setup)
- **MySQL 8.0+** (for manual local setup)
- **Git**

---

## 🐳 Option 1: Docker Compose (Recommended for Quick Start)

### Installation & Setup

1. **Clone/navigate to project:**
   ```bash
   cd d:\project
   # or wherever your project is located
   ```

2. **Build and start all services:**
   ```bash
   docker compose up --build
   ```

   This starts:
   - MySQL database
   - 5 microservices (user, product, order, payment, notification)
   - React frontend

3. **Access the dashboard:**
   ```
   http://localhost:3000
   ```

### Verification

- All service cards should show **UP** (green badge)
- Click **Ping Service** button to test each service
- Scroll down to see inter-service communication responses

### Stop All Services

```bash
docker compose down
```

### View Logs

```bash
# All services
docker compose logs -f

# Specific service
docker compose logs -f user-service
docker compose logs -f frontend
```

---

## 🚀 Option 2: Run Services Independently (Manual Setup)

Perfect for development, debugging, or running specific services.

### Step 1: Setup MySQL

**Option A: Docker (Recommended)**
```bash
docker run -d \
  --name mysql-local \
  -p 3306:3306 \
  -e MYSQL_ROOT_PASSWORD=rootpass \
  -e MYSQL_DATABASE=microservices \
  mysql:8.0
```

**Option B: Local MySQL Installation**
```sql
CREATE DATABASE microservices;
```

### Step 2: Install Dependencies

```bash
# Root level
npm install

# Install all service and frontend dependencies
cd services/user-service && npm install
cd ../product-service && npm install
cd ../order-service && npm install
cd ../payment-service && npm install
cd ../notification-service && npm install
cd ../../frontend && npm install
```

Or install all at once (if using npm workspaces):
```bash
npm install
```

### Step 3: Start Each Service (in separate terminal tabs/windows)

**Terminal 1 - User Service:**
```bash
cd services/user-service
npm start
# Output: user-service listening on port 3001
```

**Terminal 2 - Product Service:**
```bash
cd services/product-service
npm start
# Output: product-service listening on port 3002
```

**Terminal 3 - Notification Service:**
```bash
cd services/notification-service
npm start
# Output: notification-service listening on port 3005
```

**Terminal 4 - Payment Service:**
```bash
cd services/payment-service
npm start
# Output: payment-service listening on port 3004
```

**Terminal 5 - Order Service:**
```bash
cd services/order-service
npm start
# Output: order-service listening on port 3003
```

**Terminal 6 - Frontend:**
```bash
cd frontend
npm run dev
# Output: http://127.0.0.1:3000
```

### Step 4: Verify Services

Check each service health endpoint:
```bash
# User Service
curl http://localhost:3001/health

# Product Service
curl http://localhost:3002/health

# Order Service
curl http://localhost:3003/health

# Payment Service
curl http://localhost:3004/health

# Notification Service
curl http://localhost:3005/health
```

### Step 5: Access the Dashboard

```
http://localhost:3000
```

All services should show **UP** status.

---

## 📋 Service Details

### User Service (Port 3001)
- Manages user data
- Sample endpoint: `http://localhost:3001/ping`
- Database table: `users`

### Product Service (Port 3002)
- Manages product catalog
- Sample endpoint: `http://localhost:3002/ping`
- Database table: `products`

### Order Service (Port 3003)
- Processes orders
- Communicates with: Product Service, Payment Service
- Sample endpoint: `http://localhost:3003/ping`
- Database table: `orders`

### Payment Service (Port 3004)
- Processes payments
- Communicates with: Notification Service
- Sample endpoint: `http://localhost:3004/ping`
- Database table: `payments`

### Notification Service (Port 3005)
- Sends notifications
- Sample endpoint: `http://localhost:3005/ping`
- Database table: `notifications`

---

## 🔗 Inter-Service Communication Flow

```
Frontend Dashboard
    ↓
    ├→ User Service (3001)
    │   └→ Product Service (3002)
    │
    ├→ Product Service (3002)
    │
    ├→ Order Service (3003)
    │   ├→ Product Service (3002)
    │   └→ Payment Service (3004)
    │
    ├→ Payment Service (3004)
    │   └→ Notification Service (3005)
    │
    └→ Notification Service (3005)
```

---

## 🛠️ Environment Configuration

Each service has a `.env` file for configuration:

```bash
# MySQL Configuration
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=rootpass
MYSQL_DATABASE=microservices

# Service Configuration
SERVICE_NAME=user-service
SERVICE_PORT=3001
```

### For Docker Compose
`.env` files are automatically loaded, or configured in `docker-compose.yml`

### For Manual Setup
Services read `.env` files from their respective directories (via `dotenv` package)

---

## 📊 API Endpoints Reference

### Health Check
```bash
GET /health
# Response: { service: 'user-service', status: 'UP' }
```

### Ping
```bash
GET /ping
# Response: { service: 'user-service', message: 'User service is reachable' }
```

### Internal Data & Communication
```bash
GET /internal
# Response: { 
#   service: 'order-service', 
#   orders: [...], 
#   downstream: { 
#     productService: {...}, 
#     paymentService: {...} 
#   } 
# }
```

---

## 🐛 Troubleshooting

### Docker Compose Issues

**Error: "KeyError: 'ContainerConfig'"**
```bash
# Update docker-compose to latest version
pip install --upgrade docker-compose

# Or clean up and rebuild
docker compose down --rmi all --volumes
docker system prune -a --volumes --force
docker compose up --build
```

**Port already in use**
```bash
# Kill process on port 3000 (or any port)
lsof -i :3000 | grep LISTEN | awk '{print $2}' | xargs kill -9
```

### Manual Setup Issues

**MySQL connection refused**
```bash
# Ensure MySQL is running
docker ps | grep mysql

# Or check local MySQL service
mysql -u root -p
```

**Port conflicts**
- Change port in `.env` or service startup command
- Update frontend `App.jsx` to use new port

**Module not found**
```bash
npm install
```

---

## 🚀 Deployment

This application is structured for deployment on:

- **Docker**: Use `docker compose up` in CI/CD
- **Kubernetes**: Dockerfiles are K8s-ready
- **EKS** (AWS): Helm charts can be created from docker-compose
- **ECS** (AWS): Use CloudFormation with docker-compose
- **EC2**: Manual deployment with systemd services

---

## 📁 Project Structure

```
d:\project
├── docker-compose.yml          # Compose orchestration
├── package.json                # Root workspace config
├── .env.example                # Example environment file
├── README.md                   # This file
│
├── frontend/                   # React.js dashboard
│   ├── src/
│   │   ├── App.jsx            # Main dashboard component
│   │   ├── main.jsx           # Entry point
│   │   └── index.css          # Styling
│   ├── package.json
│   └── vite.config.js
│
└── services/                   # Microservices
    ├── user-service/
    ├── product-service/
    ├── order-service/
    ├── payment-service/
    └── notification-service/
        ├── src/
        │   ├── index.js       # Entry point
        │   ├── routes.js      # API routes
        │   ├── db.js          # Database connection
        │   └── logger.js      # Request logging
        ├── .env               # Service env config
        ├── package.json
        └── Dockerfile
```

---

## 💡 Key Features

- ✅ **Fully Containerized** - Docker & Docker Compose ready
- ✅ **Database Connectivity** - Each service has MySQL tables
- ✅ **Inter-service Communication** - Services call each other
- ✅ **Request Logging** - Timestamps on all incoming requests
- ✅ **CORS Enabled** - Browser requests work cross-port
- ✅ **Health Monitoring** - Dashboard shows service status
- ✅ **Sample Data** - Pre-populated tables in each service
- ✅ **Production-Ready Structure** - Monorepo with clear separation

---

## 📝 Notes

- The frontend automatically detects service status on load
- Service cards turn green (UP) when responding correctly
- Click "Ping Service" to test individual endpoints
- "Refresh Communication" button fetches inter-service responses
- All timestamps are in UTC ISO 8601 format

---

## � Author

**Ronak Prajapati** - DevOps Engineer

Created this microservices application to simplify and streamline deployment practices across various cloud platforms and container orchestration systems.

---

## �📄 License

This is a demo/educational project. Use freely for learning and deployment practice.
