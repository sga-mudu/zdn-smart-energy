# Database Connection Limit Fix

## Issue
You're getting: `Too many database connections opened: ERROR 42000 (1203): User zdnmnkw5_admin_user already has more than 'max_user_connections' active connections`

## Solution

### Option 1: Add Connection Limit to DATABASE_URL (Recommended)

Update your `.env` file to limit the number of connections in the connection string:

```env
DATABASE_URL="mysql://zdnmnkw5_report_user:Zdn@616498283@zdn.mn:3306/zdnmnkw5_new_web?connection_limit=5&pool_timeout=20"
```

**Parameters:**
- `connection_limit=5` - Limits the connection pool to 5 connections (adjust based on your server's limit)
- `pool_timeout=20` - Timeout in seconds for getting a connection from the pool

### Option 2: Check Current Connections

If you have database access, check how many connections are currently open:

```sql
SHOW PROCESSLIST;
SHOW VARIABLES LIKE 'max_user_connections';
```

### Option 3: Kill Idle Connections

If you have database admin access, you can kill idle connections:

```sql
-- Show all connections
SHOW PROCESSLIST;

-- Kill specific connection (replace ID with actual connection ID)
KILL <connection_id>;
```

### Option 4: Restart Your Development Server

Sometimes connections don't close properly during development. Try:
1. Stop your Next.js dev server
2. Wait a few seconds
3. Restart it

### Option 5: Update MySQL User Connection Limit

If you have server access, you can increase the connection limit for the user:

```sql
ALTER USER 'zdnmnkw5_report_user'@'%' WITH MAX_USER_CONNECTIONS 10;
FLUSH PRIVILEGES;
```

## Quick Fix

**Update your `.env` file:**

```env
DATABASE_URL="mysql://zdnmnkw5_report_user:Zdn@616498283@zdn.mn:3306/zdnmnkw5_new_web?connection_limit=3&pool_timeout=20"
```

Then restart your development server and test again:

```bash
npm run test:db
```

## Testing

After applying the fix, test the connection:

```bash
npm run test:db
```

This will verify:
- ✅ Database connection works
- ✅ All tables are accessible
- ✅ Queries execute successfully
- ✅ Connection pool is properly configured

