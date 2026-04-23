# m.sdd-cli

Custom skills library for Claude Code.

## Installation

```bash
npm install -g m.sdd-cli
sdd init
```

## Usage

```bash
# Register all skills
sdd init

# Link a specific skill
sdd link test-hello

# Remove a specific skill
sdd unlink test-hello

# Remove all installed skills
sdd unlink

# List available and installed skills
sdd list
```

## Adding New Skills

Create a new directory under `skills/<skill-name>/` with a `SKILL.md` file:

```markdown
---
name: my-skill
description: What this skill does and when to use it
---

# My Skill

Content goes here...
```
