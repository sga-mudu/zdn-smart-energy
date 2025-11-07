# Quick Guide: Kill Old Connections

## ⚡ Fastest Solution: Contact Hosting Provider

**What to tell them:**
> "I have too many MySQL connections open for user zdnmnkw5_admin_user. Can you please kill the idle/sleeping connections? The error is: ERROR 42000 (1203): User already has more than 'max_user_connections' active connections"

**This usually takes 5-10 minutes and is the easiest!**

---

## 🛠️ Alternative: Use MySQL CLI

Since you have MySQL CLI installed, you can try:

### Step 1: Connect to Database

```bash
mysql -h zdn.mn -u zdnmnkw5_admin_user -p zdnmnkw5_website
```

(Enter password when prompted: `Zdn@616498283`)

### Step 2: Check Connections

```sql
SHOW PROCESSLIST;
```

### Step 3: Kill Idle Connections

```sql
SELECT CONCAT('KILL ', id, ';') AS kill_command
FROM information_schema.processlist 
WHERE user = 'zdnmnkw5_admin_user' 
AND command = 'Sleep' 
AND time > 30;
```

This will show you the KILL commands. Copy and run them, or run:

```sql
-- Kill all idle connections at once
SELECT CONCAT('KILL ', id, ';') 
INTO @kill_commands
FROM information_schema.processlist 
WHERE user = 'zdnmnkw5_admin_user' 
AND command = 'Sleep' 
AND time > 30;

-- Then execute (you'll need to do this manually for each)
KILL <connection_id>;
```

### Step 4: Exit MySQL

```sql
EXIT;
```

### Step 5: Test Connection

```bash
npm run test:db
```

---

## ⏰ Option 3: Wait (Automatic)

If you can't connect or contact hosting provider, just wait 10-30 minutes for connections to timeout automatically.

---

## ✅ After Connections Are Cleared

Once connections are cleared:
1. ✅ Your code is already fixed (connection_limit=3)
2. ✅ Prisma singleton is working correctly
3. ✅ This won't happen again (unless you run multiple servers)

**Test with:**
```bash
npm run test:db
```

---

## 📝 Summary

**Why we can't kill connections automatically:**
- We need to connect to kill connections
- But we can't connect because too many connections exist
- **Chicken-and-egg problem!**

**Solutions:**
1. ⭐ **Contact hosting provider** (easiest, 5-10 min)
2. 🛠️ **Use MySQL CLI** (if you can connect)
3. ⏰ **Wait for timeout** (10-30 min automatic)

