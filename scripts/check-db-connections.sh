#!/bin/bash

echo "🔍 Checking database connection status..."
echo ""

# Check if .env file exists
if [ ! -f .env ]; then
    echo "❌ .env file not found!"
    exit 1
fi

# Extract DATABASE_URL
DB_URL=$(grep "^DATABASE_URL=" .env | cut -d '=' -f2- | tr -d '"' | tr -d "'")

if [ -z "$DB_URL" ]; then
    echo "❌ DATABASE_URL not found in .env file"
    exit 1
fi

# Check if connection_limit is already set
if echo "$DB_URL" | grep -q "connection_limit"; then
    echo "✅ Connection limit is already configured"
    echo "Current URL (masked): $(echo $DB_URL | sed 's/:[^:]*@/:***@/g')"
else
    echo "⚠️  Connection limit NOT configured"
    echo ""
    echo "Current DATABASE_URL format:"
    echo "$(echo $DB_URL | sed 's/:[^:]*@/:***@/g')"
    echo ""
    echo "To fix, update your .env file:"
    echo "DATABASE_URL=\"$(echo $DB_URL | sed 's/:[^:]*@/:***@/g' | sed 's/$/?connection_limit=3\&pool_timeout=20/')\""
    echo ""
    echo "Or manually add: ?connection_limit=3&pool_timeout=20 to the end of your DATABASE_URL"
fi

