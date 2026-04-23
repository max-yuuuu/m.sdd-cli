# sdd-cli

Custom skills library for Claude Code.

## Installation

```bash
npm install sdd-cli
```

## Usage

After installation, skills are available via the `sdd-cli` plugin namespace in Claude Code.

## Skills

- `test-hello` - Test skill to verify the plugin is working

## Adding New Skills

Create a new directory under `skills/<skill-name>/` with a `SKILL.md` file:

```markdown
---
name: my-skill
description: What this skill does
---

# My Skill

Content goes here...
```
