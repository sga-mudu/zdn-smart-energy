# Why We Can't Terminate Old Connections - And Solutions

## 🔍 The Problem

We **cannot connect** to kill old connections because:
1. **Too many connections are already open** (exceeding `max_user_connections`)
2. **MySQL rejects new connections** when the limit is reached
3. **This is a chicken-and-egg problem**: We need to connect to kill connections, but we can't connect because there are too many connections!

## ⚠️ Why This Happens

When you run multiple Next.js servers or have connection leaks:
- Each server creates a connection pool (default: 21 connections)
- Connections don't close immediately when servers stop
- MySQL has a `max_user_connections` limit (often 5-10 for shared hosting)
- Once limit is reached, **no new connections are allowed**

## ✅ Solutions

### Solution 1: Use MySQL CLI (If Available) ⭐ RECOMMENDED

If you have MySQL CLI installed, you can connect directly and kill connections:

```bash
# Check if MySQL CLI is installed
mysql --version

# If installed, run the script:
./scripts/kill-connections-mysql-cli.sh
```

**Or manually:**

```bash
# Extract details from your .env
# Then connect:
mysql -h zdn.mn -u zdnmnkw5_admin_user -p zdnmnkw5_website

# Once connected, run:
SHOW PROCESSLIST;

# Kill idle connections:
SELECT CONCAT('KILL ', id, ';') 
FROM information_schema.processlist 
WHERE user = 'zdnmnkw5_admin_user' 
AND command = 'Sleep' 
AND time > 30;
```

### Solution 2: Contact Hosting Provider ⭐ EASIEST

**This is the easiest solution:**

1. Contact your hosting provider (zdn.mn)
2. Ask them to kill idle connections for user `zdnmnkw5_admin_user`
3. They have database admin access and can do this immediately
4. Usually takes 5-10 minutes

**What to tell them:**
> "I have too many MySQL connections open for user zdnmnkw5_admin_user. Can you please kill the idle/sleeping connections? The error is: ERROR 42000 (1203): User already has more than 'max_user_connections' active connections"

### Solution 3: Wait for Timeout (Automatic)

MySQL connections automatically timeout after:
- **Wait time**: Usually 8 hours, but can be 10-30 minutes depending on server settings
- **No action needed** - just wait
- **Test after waiting**: `npm run test:db`

### Solution 4: Use Different Database User (If Available)

If you have another database user with higher connection limits:
1. Create a temporary `.env` with that user
2. Run the kill script
3. Switch back to original user

### Solution 5: Access phpMyAdmin or cPanel (If Available)

If your hosting provides phpMyAdmin or cPanel:
1. Log into phpMyAdmin/cPanel
2. Go to "Processes" or "Connections"
3. Kill idle connections manually

## 🛠️ Scripts Available

### 1. `npm run kill:connections`
- Attempts to connect and kill connections via Prisma
- **Will fail if too many connections exist** (chicken-and-egg problem)

### 2. `./scripts/kill-connections-mysql-cli.sh`
- Uses MySQL CLI directly
- **Works if MySQL CLI is installed and allowed**
- Bypasses connection limit by using direct connection

### 3. `npm run test:db`
- Tests database connection
- Use this **after** connections are cleared

## 📋 Recommended Action Plan

1. **First**: Try MySQL CLI script:
   ```bash
   ./scripts/kill-connections-mysql-cli.sh
   ```

2. **If that fails**: Contact hosting provider (easiest and fastest)

3. **If you can't contact them**: Wait 10-30 minutes and try again

4. **After connections are cleared**: Test with `npm run test:db`

## 🔐 Prevention (For Future)

Once connections are cleared, the fixes we've applied will prevent this:

✅ **Connection limit configured** (3 connections max)  
✅ **Prisma singleton fixed** (no duplicate instances)  
✅ **Proper cleanup** (connections close when server stops)

**Just make sure to:**
- Only run **one** Next.js dev server at a time
- Stop the server properly (Ctrl+C)
- Don't run multiple instances

## 💡 Why This Is Different from Before

**Before:**
- Multiple servers = 40+ connections
- No connection limit = 21 per server
- Connection leaks = never closing

**Now:**
- Single server = 3 connections max
- Connection limit = enforced
- Proper cleanup = connections close correctly

Once the old connections are cleared, **this won't happen again!** 🎉

