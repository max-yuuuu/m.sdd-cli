#!/usr/bin/env node

import { symlinkSync, readdirSync, lstatSync, readlinkSync, unlinkSync, existsSync, mkdirSync } from 'fs';
import { join, resolve } from 'path';
import { homedir } from 'os';

const SKILLS_DIR = join(homedir(), '.claude', 'skills');
const SOURCE_SKILLS = resolve(import.meta.dirname, '../skills');

function isLinkedSkill(name) {
  const linkPath = join(SKILLS_DIR, name);
  try {
    const st = lstatSync(linkPath);
    return st.isSymbolicLink() && readlinkSync(linkPath).includes('sdd-cli');
  } catch { return false; }
}

function getAvailableSkills() {
  return readdirSync(SOURCE_SKILLS).filter(name =>
    existsSync(join(SOURCE_SKILLS, name, 'SKILL.md'))
  );
}

function getInstalledSkills() {
  if (!existsSync(SKILLS_DIR)) return [];
  return readdirSync(SKILLS_DIR).filter(isLinkedSkill);
}

function cmdInit() {
  if (!existsSync(SKILLS_DIR)) mkdirSync(SKILLS_DIR, { recursive: true });

  const available = getAvailableSkills();
  if (available.length === 0) {
    console.log('No skills found in this package.');
    return;
  }

  let count = 0;
  for (const skill of available) {
    const linkPath = join(SKILLS_DIR, skill);
    if (existsSync(linkPath)) {
      if (isLinkedSkill(skill)) {
        console.log(`  ✓ ${skill} (already linked)`);
        count++;
        continue;
      }
      console.log(`  ✗ ${skill} (exists, skipping)`);
      continue;
    }
    symlinkSync(join(SOURCE_SKILLS, skill), linkPath, 'dir');
    console.log(`  + ${skill}`);
    count++;
  }
  console.log(`\n${count} skill(s) registered in ${SKILLS_DIR}`);
}

function cmdLink(skillName) {
  if (!existsSync(SKILLS_DIR)) mkdirSync(SKILLS_DIR, { recursive: true });

  if (skillName) {
    const src = join(SOURCE_SKILLS, skillName);
    if (!existsSync(join(src, 'SKILL.md'))) {
      console.error(`Skill "${skillName}" not found.`);
      process.exit(1);
    }
    const linkPath = join(SKILLS_DIR, skillName);
    if (existsSync(linkPath)) unlinkSync(linkPath);
    symlinkSync(src, linkPath, 'dir');
    console.log(`+ ${skillName}`);
  } else {
    cmdInit();
  }
}

function cmdUnlink(skillName) {
  if (!skillName) {
    const installed = getInstalledSkills();
    if (installed.length === 0) { console.log('No skills to remove.'); return; }
    for (const skill of installed) {
      unlinkSync(join(SKILLS_DIR, skill));
      console.log(`  - ${skill}`);
    }
    console.log(`\n${installed.length} skill(s) removed.`);
    return;
  }

  const linkPath = join(SKILLS_DIR, skillName);
  if (!existsSync(linkPath)) { console.error(`Skill "${skillName}" not found.`); process.exit(1); }
  unlinkSync(linkPath);
  console.log(`- ${skillName}`);
}

function cmdList() {
  const available = getAvailableSkills();
  const installed = getInstalledSkills();
  console.log('\nAvailable skills:');
  for (const skill of available) {
    console.log(`  ${skill} ${installed.includes(skill) ? '(installed)' : '(not installed)'}`);
  }
  console.log();
}

const commands = { init: cmdInit, link: cmdLink, unlink: cmdUnlink, list: cmdList };
const cmd = process.argv[2];

if (!cmd || !commands[cmd]) {
  console.log(`Usage: sdd <command> [skill-name]

Commands:
  init                Register all skills to ~/.claude/skills/
  link [skill-name]   Link a specific skill (or all if omitted)
  unlink [skill-name] Remove a specific skill (or all if omitted)
  list                Show available and installed skills`);
  process.exit(0);
}

commands[cmd](process.argv[3]);
