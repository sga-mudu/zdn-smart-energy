# 🧪 Admin Panel Testing Checklist

## ✅ Basic Access Tests

### Login Page
- [x] Page loads at http://localhost:3000/admin/login
- [ ] Form displays correctly with email and password fields
- [ ] Can type in email field
- [ ] Can type in password field
- [ ] Login button is clickable

### Authentication Tests
- [ ] Login with correct credentials works
  - Email: `admin@zdn.mn`
  - Password: `admin123`
- [ ] Login redirects to `/admin/dashboard` on success
- [ ] Invalid credentials show error message
- [ ] Empty fields prevent submission

### Dashboard Tests
- [ ] Dashboard loads after successful login
- [ ] All 4 tabs visible: Products, News & Info, Categories, Brands
- [ ] Can click between tabs
- [ ] "Add New" button visible on Products tab
- [ ] Sign Out button works

## 📦 Product Management Tests

### Create Product
- [ ] Click "Products" tab
- [ ] Click "Add New" button
- [ ] Product form loads
- [ ] Fill in required fields (code, name, category)
- [ ] Select category from dropdown
- [ ] Fill optional fields (description, image URLs, brand)
- [ ] Toggle "Featured Product" checkbox
- [ ] Click "Create Product"
- [ ] Success redirects to dashboard
- [ ] Product appears in list (when listing is implemented)

### Categories Available
- [ ] Category dropdown shows: "Эрэмбэ хүчний хэмжээ, хэмжилт төхөөрөмж"
- [ ] Category dropdown shows: "Бол бүтээгдэхүүн"

## 🔐 Security Tests

- [ ] Cannot access `/admin/dashboard` without login (redirects to login)
- [ ] Cannot access `/admin/products/new` without login
- [ ] Session persists after page refresh
- [ ] Sign out clears session

## 🗄️ Database Tests

- [ ] Login works with seeded admin user
- [ ] Products save to database correctly
- [ ] Can view database with `npx prisma studio`

## 🎨 UI/UX Tests

- [ ] Mobile responsive
- [ ] All buttons have hover effects
- [ ] Forms show validation errors
- [ ] Loading states show during API calls
- [ ] Error messages are user-friendly

## 📊 Current Status

**Working:**
✅ Login page loads
✅ Database connected
✅ Admin user seeded
✅ Protected routes
✅ Dashboard UI
✅ Product creation form

**Not Yet Implemented:**
- Edit/Delete products
- Product listing in dashboard
- News management interface
- Brand management interface
- Image upload (currently URL-based)
- Category management interface

## 🐛 Known Issues

None at the moment! Report any issues you find.

## 💡 Testing Tips

1. **Use browser dev tools** to check for console errors
2. **Network tab** to see API calls
3. **Prisma Studio** to verify data: `npx prisma studio`
4. **Try edge cases:** long text, special characters, etc.

---

**Last Updated:** After initial implementation
**Server Status:** Running on http://localhost:3000

