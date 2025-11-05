# MySQL Database Connection Setup

## Issue: Authentication Plugin Error

You're getting this error:
```
Unknown authentication plugin 'sha256_password'
```

This happens because your MySQL server is using `sha256_password` authentication, but Prisma's MySQL connector doesn't support it.

## Solutions

### Option 1: Update MySQL User (Recommended - Server Side)

If you have access to your MySQL server, run this SQL command to change the user's authentication method:

```sql
ALTER USER 'zdnmnkw5_report_user'@'%' IDENTIFIED WITH mysql_native_password BY 'Zdn@616498283';
FLUSH PRIVILEGES;
```

Then your connection string will work as-is:
```
DATABASE_URL="mysql://zdnmnkw5_report_user:Zdn@616498283@zdn.mn:3306/zdnmnkw5_new_web"
```

### Option 2: Use Connection Pooling Service

Some MySQL hosting services provide connection pooling that handles this:
- Use a connection pooler URL if available
- Or use Prisma Accelerate (paid service)

### Option 3: Update MySQL Client Libraries

Update your MySQL client libraries:
```bash
npm install mysql2
```

Then try using `mysql2` in your Prisma schema (though this may require schema changes).

### Option 4: Check MySQL Version

If you're using MySQL 8.0+, you might need to:
1. Update the MySQL user's authentication plugin on the server
2. Or use a different MySQL client library

## Current Status

✅ Prisma schema updated to use MySQL  
✅ Using DATABASE_URL from .env  
⚠️ Authentication plugin mismatch - needs server-side fix  

## Next Steps

1. **Contact your hosting provider** to update the MySQL user's authentication method
2. Or **update it yourself** if you have MySQL server access
3. Once fixed, run: `npx prisma db push` to sync your schema

## Testing Connection

After fixing the authentication, test with:
```bash
npx prisma db push
```

This will create/update your database tables to match your Prisma schema.

