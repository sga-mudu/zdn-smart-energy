#!/usr/bin/env node

/**
 * Validate and fix DATABASE_URL format
 */

const fs = require('fs');
const path = require('path');

const envPath = path.join(process.cwd(), '.env');

if (!fs.existsSync(envPath)) {
  console.error('❌ .env file not found');
  process.exit(1);
}

const envContent = fs.readFileSync(envPath, 'utf8');
const lines = envContent.split('\n');

let found = false;
let needsFix = false;
let fixedUrl = '';

const fixedLines = lines.map((line, index) => {
  if (line.startsWith('DATABASE_URL=')) {
    found = true;
    const match = line.match(/^DATABASE_URL=(.*)$/);
    if (match) {
      let dbUrl = match[1].replace(/^["']|["']$/g, ''); // Remove quotes
      
      console.log('\n📋 Analyzing DATABASE_URL...');
      
      // Check if connection_limit or pool_timeout exists but missing ?
      const hasConnectionParams = dbUrl.includes('connection_limit') || dbUrl.includes('pool_timeout');
      const hasQuestionMark = dbUrl.includes('?');
      
      if (hasConnectionParams && !hasQuestionMark) {
        // Missing ? separator - this is the bug!
        console.log('\n❌ ISSUE FOUND: Missing "?" separator before connection parameters');
        console.log('   Current format: mysql://.../databaseconnection_limit=3&pool_timeout=20');
        console.log('   Should be:      mysql://.../database?connection_limit=3&pool_timeout=20');
        
        // Find where to insert the ?
        const dbNameEnd = dbUrl.lastIndexOf('/');
        if (dbNameEnd !== -1) {
          const beforeSlash = dbUrl.substring(0, dbNameEnd + 1);
          const afterSlash = dbUrl.substring(dbNameEnd + 1);
          
          // Find where connection_limit starts
          const connectionLimitIndex = afterSlash.indexOf('connection_limit');
          if (connectionLimitIndex !== -1) {
            const dbName = afterSlash.substring(0, connectionLimitIndex);
            const params = afterSlash.substring(connectionLimitIndex);
            
            // Fix: Add ? before connection_limit
            fixedUrl = `${beforeSlash}${dbName}?${params}`;
            needsFix = true;
            
            console.log('\n✅ Fixed format:');
            console.log(`   ${fixedUrl.substring(0, 60)}...`);
            
            const quote = line.includes('"') ? '"' : (line.includes("'") ? "'" : '');
            return `DATABASE_URL=${quote}${fixedUrl}${quote}`;
          }
        }
      }
      
      // Check if format is correct
      if (hasConnectionParams && hasQuestionMark) {
        console.log('\n✅ DATABASE_URL format is correct!');
        console.log('   Connection pooling parameters are properly formatted');
      } else if (!hasConnectionParams) {
        console.log('\n⚠️  DATABASE_URL missing connection pooling parameters');
        console.log('   The code will add them automatically, but you can add them manually:');
        const separator = dbUrl.includes('?') ? '&' : '?';
        const suggestedUrl = `${dbUrl}${separator}connection_limit=3&pool_timeout=20`;
        console.log(`\n   DATABASE_URL="${suggestedUrl}"`);
      }
      
      return line;
    }
  }
  return line;
});

if (!found) {
  console.error('❌ DATABASE_URL not found in .env file');
  process.exit(1);
}

if (needsFix) {
  console.log('\n🔧 Fixing DATABASE_URL in .env file...');
  const fixedContent = fixedLines.join('\n');
  fs.writeFileSync(envPath, fixedContent, 'utf8');
  console.log('✅ DATABASE_URL has been fixed!');
  console.log('\n⚠️  IMPORTANT: Please restart your dev server for changes to take effect.');
  console.log('   Run: npm run dev');
} else {
  console.log('\n✅ No fixes needed - DATABASE_URL format is correct.');
}

// Final validation
console.log('\n📊 Final Validation:');
const dbUrlLine = fixedLines.find(line => line.startsWith('DATABASE_URL='));
if (dbUrlLine) {
  const match = dbUrlLine.match(/^DATABASE_URL=(.*)$/);
  if (match) {
    const dbUrl = match[1].replace(/^["']|["']$/g, '');
    
    // Check key components
    const checks = {
      'Starts with mysql://': dbUrl.startsWith('mysql://'),
      'Has host': dbUrl.includes('@') && dbUrl.includes(':'),
      'Has database name': dbUrl.includes('/') && dbUrl.split('/').length >= 2,
      'Has connection pooling': dbUrl.includes('connection_limit') && dbUrl.includes('pool_timeout'),
      'Has proper separator': !dbUrl.includes('connection_limit') || dbUrl.includes('?connection_limit') || dbUrl.includes('&connection_limit')
    };
    
    console.log('\n   Validation checks:');
    Object.entries(checks).forEach(([check, passed]) => {
      console.log(`   ${passed ? '✅' : '❌'} ${check}`);
    });
    
    if (Object.values(checks).every(v => v)) {
      console.log('\n✅ All validation checks passed!');
    } else {
      console.log('\n⚠️  Some validation checks failed. Please review your DATABASE_URL.');
    }
  }
}
