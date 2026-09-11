# 🚆 RailOpt AI — Indian Railways Block Planning & Maintenance Optimization System

**RailOpt AI** is an intelligent decision-support and operations research platform built for Indian Railways section controllers, chief controllers, and departmental engineers (P-Way, TRD/OHE, S&T, and Mechanical). It optimizes track maintenance block allocation, eliminates train possession conflicts, and minimizes passenger train delays across high-density corridors.

---

## 🏛️ 1. System Architecture

RailOpt AI enforces a clean, tiered architecture where PostgreSQL is the single source of truth, Spring Boot provides business logic, AI optimization, and REST APIs, and React presents dynamic telemetry and controls.

```
+-------------------------------------------------------------------+
|                        React 18 Frontend                          |
|  (Vite • Tailwind CSS • Metric Cards • Corridor Timeline • Lucide)|
+---------------------------------+---------------------------------+
                                  |
                                  | HTTP REST / JSON (CORS / Proxy)
                                  v
+-------------------------------------------------------------------+
|                     Spring Boot 3.3.4 Backend                     |
|  +-------------------------------------------------------------+  |
|  |                     REST Controllers                        |  |
|  | (Assets • Trains • Corridors • Requests • Dashboard • AI)   |  |
|  +------------------------------+------------------------------+  |
|                                 |                                 |
|  +------------------------------v------------------------------+  |
|  |                       Service Layer                         |  |
|  |  - DashboardService (dynamic database KPI aggregations)     |  |
|  |  - AiBlockPlanService (11-step Pareto optimization solver)  |  |
|  |  - Core Domain Services (Assets, Trains, Tasks, Corridors)  |  |
|  +------------------------------+------------------------------+  |
|                                 |                                 |
|  +------------------------------v------------------------------+  |
|  |                    AI Priority Engine                       |  |
|  |  - PriorityEngine Interface (Pluggable Abstraction)         |  |
|  |  - RuleBasedPriorityEngine (12-Factor Deterministic Model)   |  |
|  |  - Future: Python FastAPI (OR-Tools / MILP / XGBoost)       |  |
|  +------------------------------+------------------------------+  |
|                                 |                                 |
|  +------------------------------v------------------------------+  |
|  |                Spring Data JPA & Hibernate                  |  |
|  +------------------------------+------------------------------+  |
+---------------------------------+---------------------------------+
                                  |
                                  | JDBC (PostgreSQL Driver)
                                  v
+-------------------------------------------------------------------+
|                 PostgreSQL 16 Database (Docker)                   |
|  Container: railopt-postgres • Port: 5432 • Volume Persisted       |
+-------------------------------------------------------------------+
```

### Architectural Principles
1. **React never connects directly to PostgreSQL**: All database operations and business logic are mediated through Spring Boot REST APIs.
2. **PostgreSQL is the single source of truth**: No mock hardcoded values on the dashboard (e.g. `96.4%`, `78.2 Hrs/Wk`, `0 unresolved` are computed from live tables).
3. **Transparent & Explainable AI**: The AI Priority Engine is initially implemented as a deterministic scoring engine in Spring Boot, fully decoupled behind the `PriorityEngine` interface so it can be replaced by Python ML/MILP services without altering frontend contracts.

---

## 📋 2. System Requirements

- **Java Development Kit (JDK)**: Java 17 or 21+
- **Build Tool**: Apache Maven 3.8+ (or Maven Wrapper)
- **Node.js**: v18.0+ & npm
- **Container Runtime**: Docker Desktop or Docker Engine (with Docker Compose)

---

## 🐳 3. Docker Installation & PostgreSQL Setup

PostgreSQL 16 runs isolated inside a dedicated Docker container configured via `docker-compose.yml`.

### Docker Configuration
- **Container Name**: `railopt-postgres`
- **Image**: `postgres:16`
- **Database**: `railopt`
- **User**: `railopt`
- **Password**: `railopt123`
- **Port**: `5432:5432`
- **Data Volume**: `railopt_postgres_data`

### Starting PostgreSQL via Docker Compose
From the project root directory:
```bash
docker-compose up -d
```

### Starting via Standalone Docker Command
```bash
docker run -d \
  --name railopt-postgres \
  -p 5432:5432 \
  -e POSTGRES_DB=railopt \
  -e POSTGRES_USER=railopt \
  -e POSTGRES_PASSWORD=railopt123 \
  -v railopt_postgres_data:/var/lib/postgresql/data \
  --restart unless-stopped \
  postgres:16
```

### Verifying the Container
```bash
# Check running container
docker ps --filter "name=railopt-postgres"

# Connect via psql inside the container
docker exec -it railopt-postgres psql -U railopt -d railopt

# View database tables
\dt
```

---

## ⚙️ 4. Database Configuration & Environment Variables

The backend reads configuration from `backend/src/main/resources/application.properties`, structured with environment variable overrides:

| Environment Variable | Default Value | Description |
| :--- | :--- | :--- |
| `DB_URL` | `jdbc:postgresql://localhost:5432/railopt` | JDBC connection string |
| `DB_USERNAME` | `railopt` | PostgreSQL username |
| `DB_PASSWORD` | `railopt123` | PostgreSQL password |
| `SERVER_PORT` | `8080` | Spring Boot HTTP port |

---

## 🚀 5. Startup Instructions

### 1. Start PostgreSQL (Docker)
```bash
docker-compose up -d
```

### 2. Start Backend (Spring Boot)
```bash
cd backend
mvn spring-boot:run
```
The server will initialize on `http://localhost:8080`.
Upon first run, `DataSeeder` automatically populates:
- 4 Departments (`PWAY`, `TRD`, `ST`, `MECH`)
- 3 Key Corridors (`NDLS-CNB`, `NDLS-AGC`, `CNB-PRYG`)
- 18 Operating Trains (Rajdhani, Vande Bharat, Shatabdi, Superfast, Freight)
- 18 Railway Infrastructure Assets (Track km, Bridges, Level Crossings, OHE, TSS, Signals, Cranes)
- 10 Maintenance Requisitions and Block Requests

### 3. Start Frontend (React + Vite)
From the project root directory:
```bash
npm install
npm run dev
```
Open `http://localhost:5173` in your browser. The Vite development server automatically proxies `/api` requests to `http://localhost:8080`.

---

## 📡 6. REST API Endpoints Catalog

### Assets (`/api/assets`)
- `GET /api/assets`: Retrieve all railway assets.
- `GET /api/assets/{id}`: Retrieve asset by primary key ID.
- `GET /api/assets?department={code}`: Filter assets by department (e.g. `PWAY`, `TRD`, `ST`).
- `GET /api/assets?status={status}`: Filter assets by condition status (`GOOD`, `ATTENTION_REQUIRED`, `CRITICAL`).

### Trains (`/api/trains`)
- `GET /api/trains`: Retrieve all operating trains.
- `GET /api/trains/{id}`: Retrieve train by ID.
- `GET /api/trains?corridor={code}`: Filter trains by corridor code (e.g. `NDLS-CNB`).

### Corridors (`/api/corridors`)
- `GET /api/corridors`: Retrieve all corridors with station lists and tracks.
- `GET /api/corridors/{identifier}`: Retrieve corridor by numeric ID (`1`) or corridor code (`NDLS-CNB`).

### Block Requests (`/api/block-requests`)
- `GET /api/block-requests`: Retrieve departmental maintenance block requests.
- `POST /api/block-requests`: Register a new block request.

### Dynamic Dashboard (`/api/dashboard`)
- `GET /api/dashboard/summary`: Dynamic KPI telemetry (asset availability %, critical tasks, active blocks, train conflicts, workload hours, AI Priority score & recommended action).
- `GET /api/dashboard/corridor-timeline?corridorId={id}`: Train schedules, planned block windows, and active maintenance requisitions.
- `GET /api/dashboard/conflicts?corridorId={id}`: Live conflict telemetry and AI resolution actions.
- `GET /api/dashboard/maintenance-workload`: Departmental workload distribution and estimated possession hours.

### AI Planning & Priority (`/api/ai`)
- `GET /api/ai/block-plans`: Retrieve AI generated block plans.
- `GET /api/ai/block-plans/{id}`: Retrieve plan by ID.
- `POST /api/ai/block-plans/generate`: Trigger AI optimization solver for a corridor, shift, and departments.
- `POST /api/ai/block-plans/{id}/approve`: Approve and dispatch block plan to COIS / FOIS.

---

## 🧠 7. AI Priority Engine

The **AI Priority Engine** is designed as a transparent, multi-dimensional decision support system. It compiles operational data from PostgreSQL across **12 factors** to produce a deterministic priority score ($0-100$), a priority tier, and an actionable operational recommendation:

### The 12 Analytical Dimensions
1. **Task Severity**: `CRITICAL` (25 pts), `HIGH` (18 pts), `MEDIUM` (10 pts), `LOW` (5 pts).
2. **Task Priority**: `URGENT` (20 pts), `HIGH` (14 pts), `MEDIUM` (8 pts), `LOW` (4 pts).
3. **Task Status**: `PENDING` (10 pts), `SCHEDULED` (6 pts), `IN_PROGRESS` (4 pts).
4. **Due Date Urgency**: Overdue (15 pts), Due $\le 24$h (12 pts), Due $\le 72$h (8 pts), Due $\le 7$ days (4 pts).
5. **Asset Condition & Health**: Health score $<55$ or `CRITICAL` (12 pts), Health $<75$ (7 pts).
6. **Asset Availability & TSR**: Active Temporary Speed Restriction (8 pts), High defect count (5 pts).
7. **Train Traffic & Density**: Corridor daily trains $\ge 150$ (6 pts), $\ge 100$ (4.5 pts).
8. **Corridor Importance**: Capacity utilization $\ge 85\%$ (5 pts), $\ge 75\%$ (3.5 pts).
9. **Existing Block Requests**: Pending block requisition present on section (5 pts).
10. **Train Conflicts Potential**: Multiple premium express trains (Rajdhani/Vande Bharat) in window (5 pts).
11. **Department Backlog**: Department pending task queue $\ge 4$ (5 pts).
12. **Maintenance Duration Efficiency**: Window duration $\le 3$ hours allows swift turnaround (4 pts).

### Scoring & Action Derivation
- **Score $\ge 78$ (`CRITICAL`)**: *"Schedule immediate maintenance block. Regulate conflicting freight paths to siding loops."*
- **Score $62-77$ (`HIGH`)**: *"Allocate night slack window (01:00-05:00) with multi-department shadow bundling."*
- **Score $45-61$ (`MEDIUM`)**: *"Schedule during daylight coaching slack window with caution order."*
- **Score $< 45$ (`LOW`)**: *"Routine cyclic maintenance; monitor during standard daily track inspection patrol."*

---

## ⚡ 8. AI Block Planning & Shadow Bundling

The `AiBlockPlanService` orchestrates an **11-step optimization pipeline**:
1. Ingests corridor timetable, tracks, and operating trains.
2. Identifies pending/critical requisitions across selected departments.
3. Maps shift traffic valleys:
   - **NIGHT Valley**: 01:00 – 05:00 IST (optimal for heavy track tamping and OHE isolation).
   - **MORNING Slack**: 06:00 – 10:00 IST.
   - **AFTERNOON Slack**: 13:00 – 16:30 IST.
4. Detects conflicts with scheduled passenger and freight trains.
5. Computes automated regulation: loops freight at sidings, utilizes slack buffer for coaching trains to ensure 0 terminal arrival delay.
6. **Shadow Block Bundling**: Integrates Engineering (P-Way), Electrical (TRD/OHE), and S&T tasks into a single possession, saving up to $60\%$ in independent track possession closures.
7. Evaluates multi-objective Pareto optimization score ($0-100\%$).
8. Attaches explainable confidence badges (`TIMETABLE_FIT`, `MULTI_DEPT_BUNDLING`, `SAFETY_CRITICAL`, `ASSET_OPTIMIZED`).
9. Persists and returns structured plan ready for controller authorization.

---

## 🧪 9. Automated Testing

All unit, slice, and engine tests are executed with:
```bash
cd backend
mvn clean test
```

### Test Coverage Summary
- **Controller Slice Tests (`@WebMvcTest`)**:
  - `DepartmentControllerTest`: CRUD and validation on `/api/departments`.
  - `MaintenanceTaskControllerTest`: Validation, filtering, and exception handling on `/api/maintenance-tasks`.
  - `AssetControllerTest`: Filtering by department, status, and ID on `/api/assets`.
  - `TrainControllerTest`: Corridor-based filtering and schedule retrieval on `/api/trains`.
  - `CorridorControllerTest`: ID and alphanumeric code routing on `/api/corridors`.
  - `DashboardControllerTest`: KPI summary, timeline, conflicts, and workload on `/api/dashboard`.
  - `AiBlockPlanControllerTest`: Generation and controller approval workflows on `/api/ai`.
- **Service & Engine Unit Tests (`MockitoExtension`)**:
  - `PriorityEngineTest`: 12-factor scoring formula verification, priority categorization, and plan optimization.
  - `AiBlockPlanServiceTest`: Plan lifecycle, delegation, and approval logic.
  - `DashboardServiceTest`: Dynamic PostgreSQL aggregation formulas and KPI math.

---

## 🔮 10. Future Python AI / ML Solver Integration

The architecture is built with drop-in replaceability in mind:
- To replace the rule-based engine with a Python MILP / OR-Tools / XGBoost solver:
  1. Stand up a Python FastAPI microservice (e.g. on port `8000`).
  2. Create a `PythonMicroservicePriorityEngine` implementing `com.railopt.service.ai.PriorityEngine`.
  3. Annotate it with `@Primary` to seamlessly delegate `optimizeBlockPlan` calls via HTTP.
  4. Zero changes are required in controllers, DTOs, or the React frontend.
