# 🚆 RailOpt AI — Intelligent Railway Block Planning & Maintenance Optimization

**RailOpt AI** is a decision-support and operations research platform built for railway operations managers, section controllers, and maintenance engineers. It optimizes maintenance block allocation, eliminates track occupancy conflicts, and minimizes passenger train delays across dense railway corridors.

---

## 🏗️ Tech Stack

- **Framework**: [React 18](https://react.dev/) + [Vite 6](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Visualizations**: [Recharts](https://recharts.org/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Optimization Engine**: Custom Priority-Weighted Conflict Solver (`src/services/blockOptimizer.js`)

---

## 🌳 Git Branching Workflow & Architecture

To maintain a production-grade codebase, this repository adheres to a strict **tree-based Git workflow**.

### Branch Structure

```
main (Production / Stable Releases Only)
│
├── feature/dashboard           # Operational KPIs, corridor timeline & alerts
├── feature/maintenance         # Preventive/corrective maintenance task workflows
├── feature/assets              # Rolling stock, tracks, OHE, and signal asset registry
├── feature/trains-corridors    # Corridor layouts, train schedules & speed limits
├── feature/block-planning      # Interactive block slot reservations & gantt charts
├── feature/ai-optimization     # Heuristic solver & conflict resolution algorithms
└── feature/reports             # Analytics, SLA reports, and maintenance audits
```

---

## 📜 Golden Rules

1. **`main` is sacred & always stable**: Never commit experimental or untested code directly to `main`.
2. **Feature branches for all work**: Always branch off the latest `main` when starting work on any feature or fix.
3. **No Force Pushing**: Never use `git push --force` on shared branches.
4. **Test Before Merge**: Always verify that the project builds cleanly (`npm run build`) before merging into `main`.
5. **Clean Commit History**: Write clear, descriptive commit messages describing *what* changed and *why*.
6. **Sync before branching**: Update your local `main` from remote before starting a new feature branch.

---

## 🛠️ Git Command Cheat Sheet

### 1. Creating a New Feature Branch
Always pull latest `main` before creating your new branch:
```bash
# Ensure you are on main and up to date
git checkout main
git pull origin main

# Create and switch to your new feature branch
git checkout -b feature/<feature-name>

# Example:
git checkout -b feature/dashboard
```

### 2. Switching Between Branches
```bash
# Switch to an existing local branch
git checkout <branch-name>
# or using git switch
git switch <branch-name>

# Example:
git switch feature/maintenance
```

### 3. Saving & Committing Changes
Make atomic commits with clear messages:
```bash
# Check status of changed files
git status

# Stage changes
git add .

# Commit with descriptive message
git commit -m "feat(dashboard): add live corridor congestion metric"
```

### 4. Pushing a Branch to GitHub
Set the upstream tracking branch on the first push:
```bash
# Push current feature branch to GitHub
git push -u origin <branch-name>

# Example:
git push -u origin feature/dashboard
```

### 5. Returning to `main`
```bash
git checkout main
# or
git switch main
```

### 6. Updating `main` from GitHub
Keep your local `main` in sync with remote updates:
```bash
git checkout main
git pull origin main
```

### 7. Merging a Completed Feature into `main`
Always test the build before merging:
```bash
# 1. Ensure feature branch builds cleanly
npm run build

# 2. Switch to main and update
git checkout main
git pull origin main

# 3. Merge feature branch with a merge commit
git merge --no-ff feature/<feature-name> -m "Merge feature/<feature-name> into main"

# 4. Push updated main to GitHub
git push origin main
```

### 8. Reverting to a Previous Stable Commit
If a bug is introduced, safely revert changes without rewriting history:
```bash
# View commit history to find commit hash
git log --oneline -n 10

# Create a new commit that safely reverses changes of a specific commit
git revert <commit-hash>

# Push the revert commit
git push origin main
```

### 9. Creating a New Branch from an Older Commit
To test or fork off a specific past stable point:
```bash
# Find the desired commit hash
git log --oneline

# Create a new branch pointing to that commit
git checkout -b fix/rollback-investigation <commit-hash>
```

---

## 🚀 Getting Started Locally

```bash
# Clone the repository
git clone https://github.com/sidhatva/RailOptAi.git

# Navigate to project directory
cd RailOptAi

# Install dependencies
npm install

# Start local development server
npm run dev

# Build for production
npm run build
```
