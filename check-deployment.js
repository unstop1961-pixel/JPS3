#!/usr/bin/env node

/**
 * Digital Museum Guide - Deployment Readiness Verification
 * This script verifies that all deployment requirements are met
 */

const fs = require('fs');
const path = require('path');

console.log(`
╔════════════════════════════════════════════════════════════════╗
║     Digital Museum Guide - Deployment Readiness Check         ║
╚════════════════════════════════════════════════════════════════╝
`);

const checks = [
  {
    name: 'Backend package.json exists',
    check: () => fs.existsSync(path.join(__dirname, 'backend/package.json'))
  },
  {
    name: 'Backend server.js exists',
    check: () => fs.existsSync(path.join(__dirname, 'backend/server.js'))
  },
  {
    name: 'Frontend index.html exists',
    check: () => fs.existsSync(path.join(__dirname, 'frontend/index.html'))
  },
  {
    name: 'Frontend styles.css exists',
    check: () => fs.existsSync(path.join(__dirname, 'frontend/css/styles.css'))
  },
  {
    name: 'Frontend script.js exists',
    check: () => fs.existsSync(path.join(__dirname, 'frontend/js/script.js'))
  },
  {
    name: 'Museum images exist',
    check: () => fs.existsSync(path.join(__dirname, 'frontend/images/museum-1.jpg'))
  },
  {
    name: 'Museums data exists',
    check: () => fs.existsSync(path.join(__dirname, 'data/museums.json'))
  },
  {
    name: 'Quiz data exists',
    check: () => fs.existsSync(path.join(__dirname, 'data/quiz.json'))
  },
  {
    name: 'Museum quiz data exists',
    check: () => fs.existsSync(path.join(__dirname, 'data/museum-quiz.json'))
  },
  {
    name: 'Dockerfile exists (for Docker deployment)',
    check: () => fs.existsSync(path.join(__dirname, 'Dockerfile'))
  },
  {
    name: 'docker-compose.yml exists (for Docker Compose)',
    check: () => fs.existsSync(path.join(__dirname, 'docker-compose.yml'))
  },
  {
    name: 'Procfile exists (for Heroku)',
    check: () => fs.existsSync(path.join(__dirname, 'Procfile'))
  },
  {
    name: '.gitignore configured',
    check: () => fs.existsSync(path.join(__dirname, '.gitignore'))
  },
  {
    name: '.env.example template exists',
    check: () => fs.existsSync(path.join(__dirname, '.env.example'))
  },
  {
    name: 'DEPLOYMENT_READY.md documentation exists',
    check: () => fs.existsSync(path.join(__dirname, 'DEPLOYMENT_READY.md'))
  },
  {
    name: 'PRODUCTION_READY.md guide exists',
    check: () => fs.existsSync(path.join(__dirname, 'PRODUCTION_READY.md'))
  }
];

let passedChecks = 0;
let totalChecks = checks.length;

checks.forEach(check => {
  const passed = check.check();
  const status = passed ? '✅ PASS' : '❌ FAIL';
  console.log(`${status} - ${check.name}`);
  if (passed) passedChecks++;
});

console.log(`
╔════════════════════════════════════════════════════════════════╗
║                      DEPLOYMENT STATUS                        ║
╚════════════════════════════════════════════════════════════════╝

  Checks Passed: ${passedChecks}/${totalChecks}
  Status: ${passedChecks === totalChecks ? '✅ READY FOR DEPLOYMENT' : '⚠️  INCOMPLETE'}

`);

if (passedChecks === totalChecks) {
  console.log(`
🎉 Congratulations! Your application is ready for deployment!

📚 Documentation:
  1. PRODUCTION_READY.md - Quick start guide
  2. DEPLOYMENT_READY.md - Detailed deployment options
  3. DEPLOYMENT_CHECKLIST.md - Full checklist

🚀 Ready to Deploy? Choose one:

  1. HEROKU (Easiest)
     $ heroku login
     $ heroku create your-app-name
     $ git push heroku main

  2. DOCKER (Flexible)
     $ docker-compose up --build

  3. RAILWAY (Modern)
     Visit https://railway.app and connect your GitHub

  4. TRADITIONAL VPS
     See DEPLOYMENT_READY.md for AWS/DigitalOcean setup
`);
} else {
  console.log(`
⚠️  Please fix the missing items above before deploying.
`);
}

console.log(`
════════════════════════════════════════════════════════════════
  For more information, read the deployment documentation.
════════════════════════════════════════════════════════════════
`);
