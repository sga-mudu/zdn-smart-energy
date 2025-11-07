#!/usr/bin/env node
/**
 * Check how many Prisma Client instances might be created
 * This helps diagnose connection issues
 */

const fs = require('fs');
const path = require('path');

const apiDir = path.join(process.cwd(), 'app', 'api');

function findPrismaImports(dir, files = []) {
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      findPrismaImports(fullPath, files);
    } else if (item.endsWith('.ts') || item.endsWith('.tsx')) {
      const content = fs.readFileSync(fullPath, 'utf8');
      if (content.includes('from "@/lib/prisma"') || content.includes('from "@/lib/prisma"')) {
        files.push(fullPath);
      }
    }
  }
  
  return files;
}

const files = findPrismaImports(apiDir);
console.log(`\n📊 Found ${files.length} API routes using Prisma:\n`);
files.forEach((file, index) => {
  const relativePath = path.relative(process.cwd(), file);
  console.log(`   ${index + 1}. ${relativePath}`);
});

console.log(`\n⚠️  Each of these routes imports Prisma Client`);
console.log(`   If singleton pattern fails, each could create a new instance`);
console.log(`   With connection_limit=3, ${files.length} instances = ${files.length * 3} potential connections\n`);
