# Admin Panel Setup Guide

## 🚀 Quick Start

Your admin panel is now set up and ready to use!

## 📝 Default Login Credentials

- **Email:** `admin@zdn.mn`
- **Password:** `admin123`

⚠️ **IMPORTANT:** Change this password immediately after your first login!

## 🔧 What's Been Set Up

### ✅ Database & Models
- SQLite database with Prisma ORM
- Models: User, Product, Category, News, Brand
- All relationships and indexes configured

### ✅ Authentication
- NextAuth.js with credentials provider
- Protected admin routes
- Session management with JWT

### ✅ Admin Interface
- Dashboard at `/admin/dashboard`
- Login page at `/admin/login`
- Product management (Create new products)
- Categories, News, and Brands interfaces

### ✅ API Routes
All admin API routes are protected:
- `GET/POST /api/admin/products` - Product management
- `GET/POST /api/admin/categories` - Category management
- `GET/POST /api/admin/news` - News management
- `GET/POST /api/admin/brands` - Brand management

## 🎯 How to Use

1. **Start the development server:**
   ```bash
   npm run dev
   ```

2. **Navigate to admin login:**
   ```
   http://localhost:3000/admin/login
   ```

3. **Login with credentials above**

4. **Start managing your content:**
   - Click "Products" tab to add products
   - Click "Categories" to manage categories
   - Click "News & Info" to add news articles
   - Click "Brands" to manage brands

## 📁 File Structure

```
app/
├── admin/
│   ├── dashboard/          # Main admin dashboard
│   ├── products/           # Product management
│   └── login/              # Login page
├── api/
│   ├── admin/              # Admin API routes
│   │   ├── products/       # Product CRUD
│   │   ├── categories/     # Category CRUD
│   │   ├── news/           # News CRUD
│   │   └── brands/         # Brand CRUD
│   └── auth/               # Authentication
└── [...nextauth]/          # NextAuth handler

lib/
└── prisma.ts               # Prisma client singleton

prisma/
├── schema.prisma           # Database schema
├── seed.js                 # Seed script
└── dev.db                  # SQLite database
```

## 🔒 Security Notes

- All admin routes are protected by NextAuth
- Session expires after default NextAuth settings
- Passwords are hashed with bcrypt (10 rounds)
- API routes check for valid session

## 🛠️ Adding New Admin Users

You can add more admin users by:

1. **Using Prisma Studio:**
   ```bash
   npx prisma studio
   ```
   Then go to the User table and add a new user with a hashed password

2. **Using a migration script** (recommended)

3. **Creating an admin registration interface** (future enhancement)

## 📊 Database Management

- **View data:** `npx prisma studio`
- **Reset database:** Delete `prisma/dev.db` and run migrations
- **Add migrations:** `npx prisma migrate dev --name your-migration-name`

## 🎨 Customization

### Change Admin Email/Password

You can change the default admin credentials by:

1. Opening `prisma/seed.js`
2. Modifying the email and password
3. Running `npm run seed` again (or just create a new user in Prisma Studio)

### Styling

The admin panel uses:
- Tailwind CSS for styling
- shadcn/ui components
- Lucide React icons

Customize colors and styling in the component files.

## 🚨 Troubleshooting

### Can't Login
- Make sure you ran `npm run seed` to create the admin user
- Check that NEXTAUTH_SECRET is set in `.env`

### Database Errors
- Run `npx prisma generate` to regenerate Prisma client
- Run `npx prisma migrate dev` to sync database

### Port Already in Use
- Change PORT in `.env` or kill the process using port 3000

## 📈 Next Steps

**Recommended enhancements:**
1. ✅ Add image upload functionality (currently uses URLs)
2. ✅ Add edit/delete functionality for all entities
3. ✅ Add product listing and filtering in dashboard
4. ✅ Add news/article management interface
5. ✅ Add brand management interface
6. ✅ Update frontend to fetch from database
7. ✅ Add pagination and search
8. ✅ Add role-based access control
9. ✅ Add activity logs
10. ✅ Add data export functionality

## 🤝 Support

For issues or questions, check the code comments or Next.js/Prisma documentation.

