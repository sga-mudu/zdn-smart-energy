#!/bin/bash

echo "🔍 Checking for duplicate Next.js servers..."
echo ""

# Find all Next.js dev server processes
PIDS=$(ps aux | grep -E "next dev|next-server" | grep -v grep | awk '{print $2}')

if [ -z "$PIDS" ]; then
    echo "✅ No Next.js servers found running"
    exit 0
fi

echo "Found Next.js server processes:"
ps aux | grep -E "next dev|next-server" | grep -v grep
echo ""

# Count processes
COUNT=$(echo "$PIDS" | wc -l | tr -d ' ')
echo "Total processes found: $COUNT"
echo ""

if [ "$COUNT" -gt 2 ]; then
    echo "⚠️  WARNING: Multiple Next.js servers detected!"
    echo "This can cause database connection issues."
    echo ""
    read -p "Kill all Next.js servers? (y/n) " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "Stopping all Next.js servers..."
        kill $PIDS 2>/dev/null
        sleep 2
        # Force kill if still running
        kill -9 $PIDS 2>/dev/null
        echo "✅ All Next.js servers stopped"
    else
        echo "Cancelled"
    fi
else
    echo "✅ Only one or two processes (normal for dev server)"
fi

