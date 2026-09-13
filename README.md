# MyFinancialApp

![Backend Tests](https://github.com/EmmaDz/MyFinancialApp-Portfolio/actions/workflows/backend-tests.yml/badge.svg)

MyFinancialApp is a full-stack financial risk assessment and portfolio recommendation web application.

The application allows users to complete a risk questionnaire, receive a risk profile, generate an educational portfolio allocation, browse compatible financial products, and create product recommendations based on their profile.

> This project is for educational and portfolio demonstration purposes only.  
> The risk profiling, portfolio allocation, product matching, and recommendation logic should not be interpreted as financial advice or as a regulatory suitability standard.

---

## Features

- User registration and login with JWT authentication
- Password hashing with bcrypt
- Multi-dimensional risk assessment questionnaire
- Risk profile calculation based on:
  - Time horizon
  - Investment knowledge
  - Investment objective
  - Risk capacity
  - Risk tolerance
- Portfolio allocation based on the calculated risk profile
- Financial product catalog
- Risk-aware product filtering
- Product recommendation generation
- User-specific portfolio and recommendation data
- Automated unit and integration testing
- GitHub Actions continuous integration

---

## Tech Stack

### Frontend

- React
- Vite
- React Router

### Backend

- Node.js
- Express
- Sequelize
- MySQL
- JSON Web Token
- bcrypt

### Testing

- Node.js built-in test runner
- `node:assert`
- Supertest
- Dedicated MySQL test database

### DevOps

- GitHub Actions
- MySQL service container for integration tests

---

## Application Workflow

```text
Register / Login
       ↓
Complete Risk Questionnaire
       ↓
Calculate Risk Profile
       ↓
Generate Portfolio Allocation
       ↓
Filter Compatible Financial Products
       ↓
Select Products
       ↓
Generate Recommendations
```

---

## Risk Assessment

The questionnaire evaluates five dimensions:

- Time Horizon
- Investment Knowledge
- Investment Objective
- Risk Capacity
- Risk Tolerance

Each dimension is assigned a risk profile, and the final risk level is determined by the most conservative dimension.

Supported risk levels:

- Very Conservative
- Conservative
- Balanced
- Growth
- Aggressive Growth

The risk profile calculation is implemented in a dedicated service layer so that the business logic can be tested independently from the HTTP controller layer.

---

## Portfolio Allocation

After a risk profile is calculated, the application generates an educational portfolio allocation across three asset classes:

- Equity
- Fixed Income
- Cash Equivalent

Example allocation for a **Balanced** profile:

```text
Equity:           50%
Fixed Income:     45%
Cash Equivalent:   5%
```

Portfolio allocation rules are implemented in a dedicated service layer.

---

## Financial Product Matching

Each financial product contains information such as:

- Name
- Asset class
- Product type
- Institution
- Risk level
- Fee
- Description

The backend retrieves the authenticated user's latest risk assessment and filters products according to asset class and risk level.

The current demo matching rule allows products whose risk level does not exceed the user's current risk level.

The server performs this filtering rather than relying on the frontend, so compatibility rules remain enforced even if a client request is modified.

---

## Recommendation Engine

After compatible products are selected, the backend generates product recommendations based on the user's portfolio allocation.

The recommendation workflow:

1. Retrieves the authenticated user's portfolio
2. Retrieves the selected financial products from the database
3. Re-validates product compatibility on the server
4. Groups selected products by asset class
5. Distributes each asset-class allocation across the selected products
6. Saves the resulting recommendations

Existing recommendations are replaced inside a database transaction so that an error does not leave partially updated recommendation data.

---

## Authentication

The backend uses JWT-based authentication.

Protected endpoints use centralized authentication middleware that:

- Reads the `Authorization` header
- Validates the Bearer token
- Extracts the authenticated user ID
- Makes the user ID available to downstream controllers

Passwords are hashed using bcrypt before being stored in the database.

JWTs are used to identify the authenticated user when accessing protected resources such as:

- Risk assessments
- Portfolios
- Compatible financial products
- Recommendations

---

## Testing

The backend uses both unit tests and integration tests.

### Unit Tests

Unit tests verify core business logic independently from Express and MySQL.

Current service test coverage includes:

- Risk profile calculation
- Portfolio allocation
- Product risk compatibility
- Recommendation allocation

Run unit tests:

```bash
cd server
npm test
```

### Integration Tests

Integration tests use Supertest against the Express application and a dedicated MySQL test database.

Integration test coverage includes:

- User registration
- Password hashing
- Login
- JWT generation
- Questionnaire submission
- Risk assessment persistence
- Latest risk assessment retrieval
- Compatible product filtering
- User data isolation
- Portfolio creation and retrieval
- Recommendation creation
- Recommendation replacement
- Recommendation validation
- Database transaction behavior

Run integration tests:

```bash
cd server
npm run test:integration
```

Integration test files run serially because they share the same dedicated test database.

---

## Continuous Integration

GitHub Actions automatically runs backend tests when code is pushed to:

- `main`
- `portfolio-cleanup`

The workflow also runs when a pull request targets `main`.

The CI pipeline:

```text
Checkout repository
        ↓
Set up Node.js
        ↓
Start MySQL 8.4
        ↓
Install dependencies with npm ci
        ↓
Run unit tests
        ↓
Run integration tests
```

This verifies that the backend can be installed and tested successfully in a clean Linux environment.

---

## Project Structure

```text
MyFinancialApp-Portfolio/
│
├── client/
│   └── React frontend
│
├── server/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── tests/
│   │   └── integration/
│   ├── app.js
│   └── server.js
│
├── .github/
│   └── workflows/
│       └── backend-tests.yml
│
└── README.md
```

---

## Local Setup

### 1. Clone the repository

```bash
git clone https://github.com/EmmaDz/MyFinancialApp-Portfolio.git
cd MyFinancialApp-Portfolio
```

### 2. Install backend dependencies

```bash
cd server
npm install
```

### 3. Configure backend environment variables

Create:

```text
server/.env
```

Use `server/.env.example` as a reference.

Example:

```env
DATABASE_URL=mysql://username:password@localhost:3306/database_name
TEST_DATABASE_URL=mysql://username:password@localhost:3306/test_database_name
JWT_SECRET=your_jwt_secret
PORT=4000
```

Do not commit the `.env` file.

### 4. Start the backend

```bash
npm run dev
```

### 5. Install and start the frontend

From the project root:

```bash
cd client
npm install
npm run dev
```

---

## Backend Application Structure

The backend separates Express application configuration from server startup:

```text
app.js
→ Express middleware and route configuration

server.js
→ Database connection and HTTP server startup
```

This allows integration tests to import the Express application directly without opening a network port.

---

## Security and Data Integrity

The backend includes several safeguards:

- Passwords are hashed with bcrypt
- JWT authentication is centralized in middleware
- Protected resources are scoped to the authenticated user
- Product compatibility is re-validated on the server
- Recommendation replacement uses a database transaction
- Development and integration tests use separate databases
- Environment secrets are stored outside source control

---

## Disclaimer

MyFinancialApp is an educational software project created for learning and portfolio demonstration purposes.

The application's risk profiling, portfolio allocation, financial product matching, and recommendation logic are simplified demonstration models.

They should not be interpreted as financial advice, investment recommendations, or regulatory suitability assessments.
