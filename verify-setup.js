#!/usr/bin/env node

/**
 * Digital Museum Guide - Setup Verification Script
 * This script checks if all required files are in place
 */

const fs = require('fs');
const path = require('path');

const baseDir = __dirname;

// Files to check
const requiredFiles = {
  'Root': [
    'README.md',
    'QUICKSTART.md',
    'TECHNICAL.md',
    'DEPLOYMENT.md',
    'PROJECT_SUMMARY.md'
  ],
  'Backend': [
    'backend/server.js',
    'backend/package.json'
  ],
  'Frontend': [
    'frontend/index.html',
    'frontend/css/styles.css',
    'frontend/js/script.js'
  ],
  'Data': [
    'data/museums.json',
    'data/quiz.json'
  ],
  'Folders': [
    'backend',
    'frontend',
    'frontend/css',
    'frontend/js',
    'frontend/images',
    'data'
  ]
};

console.log('\n╔════════════════════════════════════════════════════════════╗');
console.log('║  Digital Museum Guide - Installation Verification         ║');
console.log('╚════════════════════════════════════════════════════════════╝\n');

let allGood = true;
let fileCount = 0;

// Check folders
console.log('📁 Checking folders...');
requiredFiles['Folders'].forEach(folder => {
  const folderPath = path.join(baseDir, folder);
  const exists = fs.existsSync(folderPath) && fs.statSync(folderPath).isDirectory();
  console.log(`  ${exists ? '✓' : '✗'} ${folder}`);
  if (!exists) allGood = false;
});

// Check files
console.log('\n📄 Checking files...');
for (const [category, files] of Object.entries(requiredFiles)) {
  if (category === 'Folders') continue;
  
  console.log(`\n  ${category}:`);
  files.forEach(file => {
    const filePath = path.join(baseDir, file);
    const exists = fs.existsSync(filePath) && fs.statSync(filePath).isFile();
    const size = exists ? fs.statSync(filePath).size : 0;
    const sizeStr = size > 1024 ? `${(size / 1024).toFixed(1)}KB` : `${size}B`;
    console.log(`    ${exists ? '✓' : '✗'} ${file} ${exists ? `(${sizeStr})` : '(MISSING)'}`);
    if (exists) fileCount++;
    if (!exists) allGood = false;
  });
}

// Check if package.json has required dependencies
console.log('\n📦 Checking dependencies...');
try {
  const packageJson = JSON.parse(fs.readFileSync(path.join(baseDir, 'backend/package.json'), 'utf8'));
  const deps = Object.keys(packageJson.dependencies || {});
  const required = ['express', 'cors', 'body-parser'];
  
  let depsOk = true;
  required.forEach(dep => {
    const exists = deps.includes(dep);
    console.log(`  ${exists ? '✓' : '✗'} ${dep}`);
    if (!exists) depsOk = false;
  });
  
  if (!depsOk) allGood = false;
} catch (e) {
  console.log(`  ✗ Error reading package.json: ${e.message}`);
  allGood = false;
}

// Check data content
console.log('\n📊 Checking data files...');
try {
  const museums = JSON.parse(fs.readFileSync(path.join(baseDir, 'data/museums.json'), 'utf8'));
  console.log(`  ✓ museums.json contains ${museums.length} museums`);
  
  const quiz = JSON.parse(fs.readFileSync(path.join(baseDir, 'data/quiz.json'), 'utf8'));
  console.log(`  ✓ quiz.json contains ${quiz.length} questions`);
} catch (e) {
  console.log(`  ✗ Error reading data files: ${e.message}`);
  allGood = false;
}

// Summary
console.log('\n╔════════════════════════════════════════════════════════════╗');
if (allGood) {
  console.log('║  ✓ Setup verification PASSED!                             ║');
  console.log('║                                                            ║');
  console.log('║  Your application is ready to run.                         ║');
  console.log('║  Follow these steps:                                       ║');
  console.log('║                                                            ║');
  console.log('║  1. cd backend && npm install                              ║');
  console.log('║  2. npm start (keep this terminal open)                    ║');
  console.log('║  3. In new terminal: cd frontend                           ║');
  console.log('║  4. python -m http.server 8000                             ║');
  console.log('║  5. Open: http://localhost:8000                            ║');
} else {
  console.log('║  ✗ Setup verification FAILED!                             ║');
  console.log('║                                                            ║');
  console.log('║  Some required files are missing.                          ║');
  console.log('║  Please check the errors above.                            ║');
}
console.log('╚════════════════════════════════════════════════════════════╝\n');

process.exit(allGood ? 0 : 1);
