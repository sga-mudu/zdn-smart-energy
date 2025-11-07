#!/bin/bash

echo "🔍 Attempting to kill old connections using MySQL CLI..."
echo ""

# Check if MySQL CLI is installed
if ! command -v mysql &> /dev/null; then
    echo "❌ MySQL CLI not found!"
    echo ""
    echo "Please install MySQL client:"
    echo "  macOS: brew install mysql-client"
    echo "  Linux: sudo apt-get install mysql-client"
    echo ""
    exit 1
fi

# Extract connection details from .env
if [ ! -f .env ]; then
    echo "❌ .env file not found!"
    exit 1
fi

DB_URL=$(grep "^DATABASE_URL=" .env | cut -d '=' -f2- | tr -d '"' | tr -d "'")

# Parse connection details
# Format: mysql://user:password@host:port/database
HOST=$(echo $DB_URL | sed -n 's/.*@\([^:]*\):.*/\1/p')
USER=$(echo $DB_URL | sed -n 's|.*//\([^:]*\):.*|\1|p')
PASSWORD=$(echo $DB_URL | sed -n 's|.*:[^:]*:\([^@]*\)@.*|\1|p' | sed 's|%40|@|g')
DB=$(echo $DB_URL | sed -n 's|.*/\([^?]*\).*|\1|p')

echo "📊 Connection Details:"
echo "   Host: $HOST"
echo "   User: $USER"
echo "   Database: $DB"
echo ""

# First, check current connections
echo "1️⃣ Checking current connections..."
mysql -h "$HOST" -u "$USER" -p"$PASSWORD" "$DB" -e "
SELECT 
    id, 
    user, 
    host, 
    command, 
    time, 
    state 
FROM information_schema.processlist 
WHERE user = '$USER' 
ORDER BY time DESC;
" 2>/dev/null

if [ $? -ne 0 ]; then
    echo "❌ Failed to connect to database"
    echo "   This might be because:"
    echo "   1. Too many connections are already open"
    echo "   2. MySQL CLI client is not allowed from your IP"
    echo "   3. Password needs to be URL-decoded"
    echo ""
    echo "💡 Alternative: Contact your hosting provider"
    exit 1
fi

# Count idle connections
IDLE_COUNT=$(mysql -h "$HOST" -u "$USER" -p"$PASSWORD" "$DB" -N -e "
SELECT COUNT(*) 
FROM information_schema.processlist 
WHERE user = '$USER' 
AND command = 'Sleep' 
AND time > 30;
" 2>/dev/null)

echo ""
echo "📊 Found $IDLE_COUNT idle connection(s)"
echo ""

if [ "$IDLE_COUNT" -eq 0 ]; then
    echo "✅ No idle connections to kill"
    exit 0
fi

# Ask for confirmation
read -p "Kill $IDLE_COUNT idle connection(s)? (y/n) " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Cancelled"
    exit 0
fi

# Kill idle connections
echo "2️⃣ Killing idle connections..."
mysql -h "$HOST" -u "$USER" -p"$PASSWORD" "$DB" -e "
SELECT CONCAT('KILL ', id, ';') AS kill_command
FROM information_schema.processlist 
WHERE user = '$USER' 
AND command = 'Sleep' 
AND time > 30;
" 2>/dev/null | grep -v "kill_command" | while read kill_cmd; do
    if [ ! -z "$kill_cmd" ]; then
        echo "Executing: $kill_cmd"
        mysql -h "$HOST" -u "$USER" -p"$PASSWORD" "$DB" -e "$kill_cmd" 2>/dev/null
    fi
done

echo ""
echo "✅ Done! Testing connection..."
sleep 2
npm run test:db

