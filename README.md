# 🚀 Multi-Tenant SaaS Platform - Backend Development

> **Development Status Report - Phase 1 Progress**

[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)

**Client:** ASSOCIAZIONE DI PROMOZIONE SOCIALE AKRAVITA ETS  
**Development Timeline:** 17 Weeks  
**Current Phase:** Backend Foundation (Week 1-4)

---

## 📋 Table of Contents

- [Project Overview](#-project-overview)
- [Current Progress](#-current-progress)
- [Completed Modules](#-completed-modules)
- [System Architecture](#️-system-architecture)
- [Project Structure](#-project-structure)
- [Technology Stack](#-technology-stack)
- [Authentication Flow](#-authentication-flow)
- [Error Handling](#-error-handling)
- [Next Steps](#-next-steps)

---

## 🎯 Project Overview

This is a **Multi-Tenant AI-Powered SaaS Platform** designed for managing:

- 🎫 Events, Courses & Experiences
- 🛒 E-commerce (Physical & Digital Products)
- 💳 Payments via Stripe Connect
- 🤝 Affiliate/Referral Marketing
- 🤖 AI Assistant (GPT-4/5)
- 📱 Mobile App Support (Flutter)

### Key Features
- **Multi-Organization Support** with complete data isolation
- **White-Label Customization** (domains, logos, colors)
- **Role-Based Access Control** (SUPER_ADMIN, ORG_ADMIN, STAFF, USER, AFFILIATE)
- **Modular Architecture** for easy scalability
- **Enterprise-Grade Security** with JWT authentication

---

## ✅ Current Progress

### Phase 1: Backend Foundation (In Progress)

| Component | Status |
|-----------|--------|
| **Project Setup** |  🔄 In Progress 
| **Folder Structure** |  🔄 In Progress 
| **Prisma Schema** |  🔄 In Progress 
| **Middlewares** |  🔄 In Progress 
| **Error Handling** |  🔄 In Progress 
| **Auth Module** | 🔄 In Progress 
| **Organization Module** | 🔄 In Progress 
| **User Module** | 🔄 In Progress 
| **Event Module** | ⏳ Pending | 
| **Product Module** | ⏳ Pending | 
| **Order Module** | ⏳ Pending |
| **Affiliate Module** | ⏳ Pending |
| **AI Module** | ⏳ Pending |


---

## 🎉 Completed Modules

### 1️⃣ Authentication Module
Complete authentication system with:
- ✅ User registration with email verification
- ✅ Login with JWT access & refresh tokens
- ✅ Email verification system
- ✅ Token refresh mechanism

**Files Created:**
```
modules/auth/
├── auth.interface.ts      ✅ Type definitions
├── auth.controller.ts     ✅ API endpoints
├── auth.service.ts        ✅ Business logic
├── auth.route.ts          ✅ Route configuration
└── auth.validation.ts     ✅ Request validation
```

**Endpoints Implemented:**
```
POST   /api/auth/signup          - User registration
POST   /api/auth/login             - User login
POST   /api/auth/verify-email      - Email verification
```

### 2️⃣ Middleware System
Comprehensive middleware layer for:
- ✅ JWT token validation
- ✅ CORS configuration

### 3️⃣ Error Handling System
Production-ready error handling with:
- ✅ Global error handler
- ✅ Validation error formatting
- ✅ Database error handling
- ✅ JWT error handling
- ✅ Zod error handling
- ✅ Structured error responses

---

## 🏗️ System Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      CLIENT LAYER                           │
│  ┌──────────┐  ┌──────────┐  ┌──────────────────────┐     │
│  │   Web    │  │  Mobile  │  │   Admin Dashboard    │     │
│  │  Client  │  │   App    │  │      Client          │     │
│  └────┬─────┘  └────┬─────┘  └──────────┬───────────┘     │
└───────┼─────────────┼────────────────────┼─────────────────┘
        │             │                    │
        └─────────────┼────────────────────┘
                      │
        ┌─────────────▼────────────────┐
        │      EXPRESS SERVER          │
        │         (Port 5000)          │
        └─────────────┬────────────────┘
                      │
        ┌─────────────▼────────────────┐
        │     MIDDLEWARE LAYER         │
        └─────────────┬────────────────┘
                      │
        ┌─────────────▼────────────────┐
        │  AUTHENTICATION              │
        │  • JWT Validation            │
        │  • Role-Based Access         │
        │  • Organization Context      │
        └─────────────┬────────────────┘
                      │
        ┌─────────────▼────────────────────────────────┐
        │           ROUTE HANDLERS                     │
        └─────────────┬────────────────────────────────┘
                      │
        ┌─────────────▼────────────────────────────────┐
        │           CONTROLLERS                        │
        │  • Request Validation                        │
        │  • Response Formatting                       │
        └─────────────┬────────────────────────────────┘
                      │
        ┌─────────────▼────────────────────────────────┐
        │           SERVICES                           │
        │  • Business Logic                            │
        │  • Data Processing                           │
        └─────────────┬────────────────────────────────┘
                      │
        ┌─────────────▼────────────────┐
        │    PRISMA ORM                │
        │  • Query Builder             │
        │  • Type Safety               │
        └─────────────┬────────────────┘
                      │
        ┌─────────────▼────────────────┐
        │      MONGODB DATABASE        │
        │  • Multi-Tenant Data         │
        │  • Organization Isolation    │
        └──────────────────────────────┘
```

### Request Flow Diagram

```
HTTP Request
      ↓
[CORS Middleware]
      ↓
[Rate Limiter]
      ↓
[Request Sanitization]
      ↓
[JWT Authentication] ──→ Unauthorized? → 401 Error
      ↓
[Role Check (RBAC)] ──→ Forbidden? → 403 Error
      ↓
[Organization Context]
      ↓
[Route Handler]
      ↓
[Controller] ──→ Validation Failed? → 400 Error
      ↓
[Service Layer]
      ↓
[Prisma ORM]
      ↓
[MongoDB]
      ↓
[Response Formatter]
      ↓
HTTP Response (JSON)
```

---

## 📁 Project Structure

```
backend/
│
├── src/
│   │
│   ├── modules/                      # Feature modules
│   │   │
│   │   ├── auth/                     ✅ COMPLETED
│   │   │   ├── auth.interface.ts    # TypeScript interfaces
│   │   │   ├── auth.controller.ts   # HTTP request handlers
│   │   │   ├── auth.service.ts      # Business logic
│   │   │   ├── auth.route.ts        # Route definitions
│   │   │   └── auth.validation.ts   # Input validation schemas
│   │   │
│   │   ├── organization/             🔄 IN PROGRESS
│   │   │   ├── organization.interface.ts
│   │   │   ├── organization.controller.ts
│   │   │   ├── organization.service.ts
│   │   │   ├── organization.route.ts
│   │   │   └── organization.validation.ts
│   │   │
│   │   ├── user/                     🔄 IN PROGRESS
│   │   ├── event/                    ⏳ PENDING
│   │   ├── ticket/                   ⏳ PENDING
│   │   ├── booking/                  ⏳ PENDING
│   │   ├── product/                  ⏳ PENDING
│   │   ├── order/                    ⏳ PENDING
│   │   ├── payment/                  ⏳ PENDING
│   │   ├── affiliate/                ⏳ PENDING
│   │   ├── ai/                       ⏳ PENDING
│   │   └── admin/                    ⏳ PENDING
│   │
│   ├── middlewares/                  
│   │
│   ├── utils/                       
│   ├── DB                       
│   ├── routes                       
│   │
|   |__lib/ prisma.ts
│   ├── config/
│   │   ├── env.ts                   # Environment validation
│   │
│   ├── types/
│   │   ├── index.d.ts             # Express type extensions
│   │   └── common.ts                 # Custom types
│   │
│   ├── app.ts                        ✅ Express app setup
│   └── server.ts                     ✅ Server entry point
│
├── prisma/
│   ├── schema.prisma                 ✅ Database schema
│
├── .env.example                      ✅ Environment template
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```

---

## 🛠 Technology Stack

### Backend Core
- **Runtime:** Node.js 
- **Framework:** Express.js 
- **Language:** TypeScript 
- **Database:** MongoDB 
- **ORM:** Prisma 5

### Security & Authentication
- **Authentication:** JWT (jsonwebtoken)
- **Password Hashing:** bcrypt
- **Validation:** Zod
- **Rate Limiting:** express-rate-limit
- **Sanitization:** express-mongo-sanitize

- **Environment:** dotenv
- **Code Quality:** ESLint + Prettier

---

## 🔐 Authentication Flow

### User Registration Flow

```
1. Client submits registration form
         ↓
2. Validation (email, password, organization)
         ↓
3. Check if email already exists
         ↓
4. Hash password with bcrypt
         ↓
5. Generate verification code
         ↓
6. Create user in database
         ↓
7. Send verification email
         ↓
8. Return success response
```

### Login Flow

```
1. Client submits credentials
         ↓
2. Find user by email
         ↓
3. Verify password hash
         ↓
4. Check email verification status
         ↓
5. Generate JWT access token (15 min)
         ↓
6. Generate refresh token (7 days)
         ↓
7. Hash and store refresh token
         ↓
8. Return tokens + user data
```


### Protected Route Flow

```
HTTP Request with Authorization Header
         ↓
Extract JWT from "Bearer {token}"
         ↓
Verify token signature & expiration
         ↓
Decode user payload (id, role, organizationId)
         ↓
Attach user to request.user
         ↓
Check role permissions (if required)
         ↓
Proceed to route handler
```

---

## 🚨 Error Handling

### Error Response Structure

All API errors follow a consistent format:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": {},
    "timestamp": "2025-12-13T10:30:00.000Z"
  }
}
```

### Error Types Handled

| Error Type | HTTP Code | Example |
|------------|-----------|---------|
| **Validation Error** | 400 | Invalid email format |
| **Authentication Error** | 401 | Invalid or expired token |
| **Authorization Error** | 403 | Insufficient permissions |
| **Not Found Error** | 404 | User not found |
| **Conflict Error** | 409 | Email already exists |
| **Rate Limit Error** | 429 | Too many requests |
| **Server Error** | 500 | Database connection failed |

### Error Handling Flow

```
Error Occurs in Application
         ↓
Custom Error Class or Native Error
         ↓
Global Error Handler Middleware
         ↓
Determine Error Type
         ↓
Format Error Response
         ↓
Log Error (Winston)
         ↓
Send JSON Response to Client
```

---

## 🔒 Security Features Implemented

### ✅ Completed Security Measures

- **JWT Authentication** with access & refresh tokens
- **Password Hashing** using bcrypt (10 rounds)
- **Email Verification** before account activation
- **Rate Limiting** (100 requests per 15 minutes)
- **Input Sanitization** against NoSQL injection
- **CORS Protection** with configurable origins
- **HTTPS Enforcement** (production only)
- **Token Expiration** (15 min access, 7 days refresh)

### 🔄 Security Features In Progress

- Multi-factor authentication (2FA)
- IP-based rate limiting
- Suspicious activity monitoring
- Session management with Redis

---

## 📊 Database Schema

### Multi-Tenant Data Model

```
Organization (Tenant)
    ↓
    ├── Users (ORG_ADMIN, STAFF, USER, AFFILIATE)
    ├── Events/Courses/Experiences
    ├── Products
    ├── Orders
    ├── Affiliate Links
    └── AI Conversations

Complete data isolation per organization
```

---

## 💻 Running the Project

### Prerequisites
```bash
Node.js >= 18.x
MongoDB >= 6.x
npm >= 9.x
```

### Installation
```bash
# Clone repository
git clone https://github.com/tanzimsiamm/fiwippo_backend.git
cd fiwippo_backend

# Install dependencies
npm install

# Setup environment
cp .env.example .env
# Edit .env with your credentials

# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push

# Start development server
npm run dev
```

### Environment Variables
```env
NODE_ENV=development
PORT=3000
DATABASE_URL=mongodb://localhost:27017/saas_platform
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=15m
REFRESH_TOKEN_SECRET=your-refresh-secret
REFRESH_TOKEN_EXPIRES_IN=7d
```

---
