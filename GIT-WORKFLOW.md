# Git Workflow Guide

## 🔄 Feature-Based Development & Version Control

This guide establishes a systematic Git workflow for Echo development, ensuring every small feature is properly committed and pushed to GitHub.

---

## 🎯 Workflow Philosophy

**Commit Early, Commit Often**
- Commit after every small feature completion
- Push to GitHub regularly for backup
- Maintain clean, descriptive commit history
- Enable easy rollback if needed

---

## 📋 Initial Setup

### 1. Initialize Git Repository

```bash
# Navigate to project directory
cd c:\Users\mdrkk\Desktop\Echo

# Initialize Git (if not already done)
git init

# Add all documentation files
git add .

# First commit
git commit -m "docs: initial project documentation and setup"
```

### 2. Create GitHub Repository

**Option A: Via GitHub Website**
1. Go to https://github.com/new
2. Repository name: `echo` or `secondbrain`
3. Description: "Personal AI companion app - mood-aware productivity system"
4. Visibility: **Public** (for portfolio) or **Private** (for development)
5. **DO NOT** initialize with README (we already have one)
6. Click "Create repository"

**Option B: Via GitHub CLI**
```bash
# Install GitHub CLI: https://cli.github.com/
gh auth login
gh repo create echo --public --source=. --remote=origin --push
```

### 3. Connect Local to GitHub

```bash
# Add remote repository
git remote add origin https://github.com/YOUR_USERNAME/echo.git

# Verify remote
git remote -v

# Push initial commit
git branch -M main
git push -u origin main
```

---

## 🌿 Branch Strategy

### Main Branches

```
main (production-ready code)
  ↓
develop (integration branch)
  ↓
feature/* (individual features)
```

### Branch Naming Convention

```bash
# Features
feature/mood-tracking
feature/task-management
feature/ai-integration

# Bug fixes
fix/mood-chart-crash
fix/notification-timing

# Documentation
docs/api-documentation
docs/setup-guide

# Refactoring
refactor/database-layer
refactor/state-management

# Performance
perf/image-optimization
perf/api-caching
```

---

## 📝 Commit Message Convention

### Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- **feat:** New feature
- **fix:** Bug fix
- **docs:** Documentation changes
- **style:** Code formatting (no logic change)
- **refactor:** Code restructuring
- **perf:** Performance improvement
- **test:** Adding tests
- **chore:** Maintenance tasks
- **build:** Build system changes
- **ci:** CI/CD changes

### Examples

```bash
# Good commit messages
git commit -m "feat(mood): add mood logging functionality"
git commit -m "feat(mood): implement mood chart visualization"
git commit -m "fix(tasks): resolve task completion state bug"
git commit -m "docs(readme): update installation instructions"
git commit -m "refactor(database): extract mood repository"
git commit -m "perf(api): add caching for Gemini API calls"
git commit -m "test(mood): add unit tests for mood service"

# Bad commit messages (avoid these)
git commit -m "updates"
git commit -m "fixed stuff"
git commit -m "WIP"
git commit -m "asdfasdf"
```

### Detailed Commit Example

```bash
git commit -m "feat(mood): add mood logging with AI analysis

- Implement mood input UI with emoji selector
- Add mood intensity slider (1-10)
- Integrate Gemini API for mood analysis
- Store mood entries in SQLite database
- Display mood history in chart format

Closes #12"
```

---

## 🔄 Feature Development Workflow

### Step-by-Step Process

#### 1. Start New Feature

```bash
# Make sure you're on develop branch
git checkout develop

# Pull latest changes
git pull origin develop

# Create feature branch
git checkout -b feature/mood-tracking

# Verify you're on the right branch
git branch
```

#### 2. Develop Feature (Small Increments)

**Break features into small commits:**

```bash
# Example: Mood Tracking Feature

# Commit 1: Create UI component
git add src/components/mood/MoodSelector.tsx
git commit -m "feat(mood): create mood selector component"
git push origin feature/mood-tracking

# Commit 2: Add database schema
git add src/database/schema/mood.ts
git commit -m "feat(mood): add mood entry database schema"
git push origin feature/mood-tracking

# Commit 3: Implement service layer
git add src/services/MoodService.ts
git commit -m "feat(mood): implement mood logging service"
git push origin feature/mood-tracking

# Commit 4: Connect UI to service
git add src/screens/Mood/MoodScreen.tsx
git commit -m "feat(mood): connect mood screen to service layer"
git push origin feature/mood-tracking

# Commit 5: Add tests
git add tests/unit/MoodService.test.ts
git commit -m "test(mood): add unit tests for mood service"
git push origin feature/mood-tracking
```

#### 3. Regular Commits (Every 30-60 Minutes)

```bash
# Check what changed
git status

# Review changes
git diff

# Stage specific files
git add src/components/mood/MoodSelector.tsx
git add src/components/mood/MoodChart.tsx

# Or stage all changes
git add .

# Commit with descriptive message
git commit -m "feat(mood): add mood chart visualization"

# Push to GitHub
git push origin feature/mood-tracking
```

#### 4. Complete Feature

```bash
# Final commit
git add .
git commit -m "feat(mood): complete mood tracking module

- Mood logging with emoji selector
- Mood intensity tracking
- Historical mood chart
- AI-powered mood analysis
- Database persistence

Feature complete and tested."

# Push final changes
git push origin feature/mood-tracking
```

#### 5. Merge to Develop

```bash
# Switch to develop
git checkout develop

# Pull latest changes
git pull origin develop

# Merge feature branch
git merge feature/mood-tracking

# Push to GitHub
git push origin develop

# Delete feature branch (optional)
git branch -d feature/mood-tracking
git push origin --delete feature/mood-tracking
```

---

## 📅 Daily Workflow

### Morning Routine

```bash
# 1. Pull latest changes
git checkout develop
git pull origin develop

# 2. Check what you're working on
git branch

# 3. Create or switch to feature branch
git checkout -b feature/task-management
# or
git checkout feature/task-management
```

### During Development

```bash
# Every 30-60 minutes or after completing a small piece:

# 1. Check status
git status

# 2. Review changes
git diff

# 3. Stage changes
git add .

# 4. Commit
git commit -m "feat(tasks): add task creation form"

# 5. Push to GitHub (backup)
git push origin feature/task-management
```

### End of Day

```bash
# 1. Commit any work in progress
git add .
git commit -m "wip(tasks): task list component in progress"

# 2. Push to GitHub
git push origin feature/task-management

# 3. Document progress (optional)
echo "$(date): Completed task creation UI" >> PROGRESS.md
git add PROGRESS.md
git commit -m "docs: update progress log"
git push origin feature/task-management
```

---

## 🎯 Feature Completion Checklist

Before merging a feature, ensure:

- [ ] Code is complete and functional
- [ ] No console errors or warnings
- [ ] Code follows TypeScript conventions
- [ ] Comments added for complex logic
- [ ] Tests written (if applicable)
- [ ] Documentation updated
- [ ] Committed with descriptive message
- [ ] Pushed to GitHub
- [ ] Feature branch merged to develop

---

## 🚨 Common Scenarios

### Scenario 1: Made a Mistake in Last Commit

```bash
# Undo last commit but keep changes
git reset --soft HEAD~1

# Make corrections
# ... edit files ...

# Commit again
git add .
git commit -m "feat(mood): add mood selector (corrected)"
```

### Scenario 2: Need to Discard All Changes

```bash
# Discard all uncommitted changes
git reset --hard HEAD

# Or discard specific file
git checkout -- src/components/MoodSelector.tsx
```

### Scenario 3: Forgot to Create Feature Branch

```bash
# You're on develop and made changes

# Stash changes
git stash

# Create feature branch
git checkout -b feature/my-feature

# Apply stashed changes
git stash pop

# Now commit normally
git add .
git commit -m "feat: my feature"
```

### Scenario 4: Need to Update Feature Branch with Latest Develop

```bash
# On feature branch
git checkout feature/my-feature

# Fetch latest develop
git fetch origin develop

# Rebase on develop
git rebase origin/develop

# If conflicts, resolve them, then:
git add .
git rebase --continue

# Force push (since history changed)
git push origin feature/my-feature --force
```

### Scenario 5: Working on Multiple Features

```bash
# Save current work
git stash save "WIP: mood chart improvements"

# Switch to other feature
git checkout feature/task-management

# Work on it...

# Switch back
git checkout feature/mood-tracking
git stash pop
```

---

## 📊 Recommended Commit Frequency

### By Feature Size

| Feature Size | Commits | Example |
|--------------|---------|---------|
| **Tiny** (1-2 hours) | 2-3 commits | Add button, fix typo |
| **Small** (half day) | 4-6 commits | Create component, add styling |
| **Medium** (1-2 days) | 8-12 commits | Complete screen with logic |
| **Large** (3-5 days) | 15-25 commits | Full module with tests |

### Commit Triggers

Commit after:
- ✅ Creating a new component
- ✅ Implementing a function
- ✅ Fixing a bug
- ✅ Adding tests
- ✅ Updating documentation
- ✅ Completing a logical unit of work
- ✅ Before taking a break
- ✅ End of coding session

---

## 🎯 Phase 1 MVP - Commit Plan

### Week 1-2: Project Setup

```bash
# Day 1
git commit -m "chore: initialize React Native project"
git commit -m "chore: configure TypeScript and ESLint"
git commit -m "chore: set up project structure"

# Day 2
git commit -m "feat(db): create SQLite database schema"
git commit -m "feat(db): implement database initialization"
git commit -m "feat(nav): set up React Navigation"

# Day 3
git commit -m "feat(ui): create basic app shell"
git commit -m "feat(ui): implement tab navigation"
git commit -m "style(ui): add color theme constants"
```

### Week 3-4: Mood Tracking

```bash
# Day 1
git commit -m "feat(mood): create mood selector component"
git commit -m "feat(mood): add mood intensity slider"
git commit -m "style(mood): style mood input UI"

# Day 2
git commit -m "feat(mood): implement mood service"
git commit -m "feat(mood): add mood database repository"
git commit -m "feat(mood): connect UI to service layer"

# Day 3
git commit -m "feat(mood): create mood history screen"
git commit -m "feat(mood): implement mood chart"
git commit -m "feat(mood): add mood filtering"

# Day 4
git commit -m "feat(ai): integrate Gemini API"
git commit -m "feat(ai): implement mood analysis"
git commit -m "feat(mood): display AI insights"

# Day 5
git commit -m "test(mood): add mood service tests"
git commit -m "docs(mood): update mood module documentation"
git commit -m "feat(mood): mood tracking module complete"
```

### Week 5-6: Task Management

```bash
# Similar pattern for tasks
git commit -m "feat(tasks): create task input form"
git commit -m "feat(tasks): implement task service"
git commit -m "feat(tasks): add task list view"
# ... etc
```

---

## 🔍 Code Review Checklist (Self-Review)

Before each commit, review:

```bash
# 1. Check what's being committed
git diff --staged

# 2. Verify no sensitive data
# - No API keys
# - No passwords
# - No personal information

# 3. Check code quality
# - No console.logs (except intentional)
# - No commented-out code
# - No TODO comments (or track them)
# - Proper formatting

# 4. Verify files
# - Only relevant files included
# - No build artifacts
# - No node_modules
```

---

## 📈 Tracking Progress

### Create Progress Log

```bash
# Create progress file
echo "# Echo Development Progress" > PROGRESS.md
git add PROGRESS.md
git commit -m "docs: create progress tracking file"
```

### Update After Each Feature

```markdown
# Echo Development Progress

## Week 1 (Nov 4-10, 2025)
- [x] Project setup and configuration
- [x] Database schema created
- [x] Navigation structure implemented
- [ ] Mood tracking UI (in progress)

## Week 2 (Nov 11-17, 2025)
- [ ] Mood tracking complete
- [ ] AI integration
- [ ] Basic dashboard

## Commits This Week: 15
## Total Commits: 15
```

---

## 🎓 Git Best Practices

### DO ✅

- Commit frequently (every 30-60 min)
- Write descriptive commit messages
- Push to GitHub regularly
- Use feature branches
- Review changes before committing
- Keep commits focused and atomic
- Update documentation with code

### DON'T ❌

- Commit broken code
- Use vague messages ("fix", "update")
- Commit sensitive data (API keys)
- Work directly on main branch
- Make huge commits (100+ files)
- Forget to push (lose work)
- Commit node_modules or build files

---

## 🔐 Security Reminders

### Before Every Commit

```bash
# 1. Check for secrets
git diff | grep -i "api_key\|password\|secret"

# 2. Verify .env is not staged
git status | grep ".env"

# 3. Check .gitignore is working
git status
# Should NOT see: .env, node_modules, build/
```

### If You Accidentally Commit Secrets

```bash
# Remove from last commit
git reset --soft HEAD~1
# Remove secret from file
# Commit again

# If already pushed, rotate the API key immediately!
```

---

## 📊 Example: Complete Feature Flow

### Feature: Mood Tracking Module

```bash
# Day 1: Setup
git checkout develop
git pull origin develop
git checkout -b feature/mood-tracking

# Commit 1: Component
# Create src/components/mood/MoodSelector.tsx
git add src/components/mood/MoodSelector.tsx
git commit -m "feat(mood): create mood selector component with emoji UI"
git push origin feature/mood-tracking

# Commit 2: Styling
# Style the component
git add src/components/mood/MoodSelector.tsx
git add src/styles/mood.styles.ts
git commit -m "style(mood): add styling to mood selector"
git push origin feature/mood-tracking

# Commit 3: Database
# Create database schema
git add src/database/schema/mood.ts
git commit -m "feat(mood): add mood entry database schema"
git push origin feature/mood-tracking

# Commit 4: Service
# Create service layer
git add src/services/MoodService.ts
git commit -m "feat(mood): implement mood logging service"
git push origin feature/mood-tracking

# Commit 5: Integration
# Connect UI to service
git add src/screens/Mood/MoodScreen.tsx
git commit -m "feat(mood): connect mood screen to service layer"
git push origin feature/mood-tracking

# Commit 6: Chart
# Add visualization
git add src/components/mood/MoodChart.tsx
git commit -m "feat(mood): add mood history chart visualization"
git push origin feature/mood-tracking

# Commit 7: AI
# Integrate AI analysis
git add src/services/AIService.ts
git add src/screens/Mood/MoodInsights.tsx
git commit -m "feat(mood): integrate AI mood analysis with Gemini"
git push origin feature/mood-tracking

# Commit 8: Tests
# Add tests
git add tests/unit/MoodService.test.ts
git commit -m "test(mood): add unit tests for mood service"
git push origin feature/mood-tracking

# Commit 9: Documentation
# Update docs
git add docs/03-Feature-Overview.md
git commit -m "docs(mood): update mood tracking documentation"
git push origin feature/mood-tracking

# Day 2: Merge
git checkout develop
git pull origin develop
git merge feature/mood-tracking
git push origin develop

# Tag milestone
git tag -a v0.2.0-mood -m "Mood tracking module complete"
git push origin v0.2.0-mood
```

---

## 🎯 Milestone Tagging

### Tag Major Milestones

```bash
# After completing MVP
git tag -a v0.2.0 -m "MVP: Mood tracking and tasks complete"
git push origin v0.2.0

# After completing Phase 2
git tag -a v0.3.0 -m "Enhanced features: Learning and finance modules"
git push origin v0.3.0

# Portfolio ready
git tag -a v1.0.0 -m "Portfolio ready: All features complete"
git push origin v1.0.0
```

---

## 📱 Quick Reference Commands

```bash
# Daily workflow
git status                          # Check current state
git add .                           # Stage all changes
git commit -m "feat: description"   # Commit
git push origin branch-name         # Push to GitHub

# Branch management
git branch                          # List branches
git checkout -b feature/name        # Create new branch
git checkout branch-name            # Switch branch
git merge branch-name               # Merge branch

# Undo operations
git reset --soft HEAD~1             # Undo last commit
git reset --hard HEAD               # Discard all changes
git stash                           # Save work temporarily
git stash pop                       # Restore stashed work

# View history
git log --oneline                   # Compact history
git log --graph --all               # Visual branch history
```

---

**Commit often, push regularly, and maintain a clean Git history! 🚀**
