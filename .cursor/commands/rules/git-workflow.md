# Git Workflow Rules

These rules help the AI assistant generate correct Git commands and workflows.

## General Rules

- Always prefer safe git commands.
- Explain what the command does before suggesting destructive commands.
- Avoid `git reset --hard` unless explicitly requested.
- Suggest the minimal number of commands needed to solve the problem.

---

# Standard Git Workflow

When the user wants to save and push changes:

1. Check repository status
2. Add changes
3. Create commit
4. Push to remote

Example:

git status
git add .
git commit -m "describe changes"
git push

---

# Creating a Feature Branch

If the user wants to create a new feature:

git checkout -b feature/<feature-name>

Then:

git add .
git commit -m "feat: add <feature>"
git push origin feature/<feature-name>

---

# Fixing Merge Conflicts

If a merge conflict occurs:

1. Check conflicted files

git status

2. Resolve conflicts manually

3. Stage resolved files

git add .

4. Complete merge

git commit

---

# Unfinished Merge

If Git shows:

"You have not concluded your merge"

Then suggest:

git status
git add .
git commit

Or abort merge if necessary:

git merge --abort

---

# Pull Latest Changes

If the user wants to update the local branch:

git pull origin <branch>

If conflicts appear, follow merge conflict rules.

---

# Viewing History

Useful commands:

git log --oneline
git show <commit-id>
git diff

---

# Undo Last Commit (Safe)

Keep changes:

git reset --soft HEAD~1

Remove commit and changes:

git reset --hard HEAD~1

Use with caution.

---

# Good Commit Message Format

Follow Conventional Commits:

feat: add new feature
fix: resolve bug
refactor: improve code structure
docs: update documentation
style: formatting changes
test: add tests
chore: maintenance tasks

Example:

git commit -m "feat: add product search filter"

---

# Branch Naming Rules

feature/<feature-name>
fix/<bug-name>
refactor/<scope>
docs/<scope>

Examples:

feature/product-search
fix/cart-bug
refactor/filter-logic

---

# AI Behavior Rules

When the user asks about Git:

1. First analyze the problem.
2. Suggest the minimal commands required.
3. Prefer safe workflows.
4. Explain commands briefly.
5. Avoid destructive commands unless necessary.