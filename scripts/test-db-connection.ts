import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
})

async function testConnection() {
  console.log('🔍 Testing database connection...\n')
  
  try {
    // Test 1: Basic connection
    console.log('1️⃣ Testing basic connection...')
    await prisma.$connect()
    console.log('✅ Successfully connected to database\n')
    
    // Test 2: Query a simple table
    console.log('2️⃣ Testing query capability...')
    const userCount = await prisma.user.count()
    console.log(`✅ Found ${userCount} user(s) in database\n`)
    
    // Test 3: Query categories
    console.log('3️⃣ Testing categories table...')
    const categoryCount = await prisma.category.count()
    console.log(`✅ Found ${categoryCount} category/categories in database\n`)
    
    // Test 4: Query products
    console.log('4️⃣ Testing products table...')
    const productCount = await prisma.product.count()
    console.log(`✅ Found ${productCount} product(s) in database\n`)
    
    // Test 5: Query brands
    console.log('5️⃣ Testing brands table...')
    const brandCount = await prisma.brand.count()
    console.log(`✅ Found ${brandCount} brand(s) in database\n`)
    
    // Test 6: Test a simple query with relations
    console.log('6️⃣ Testing relations...')
    const categories = await prisma.category.findMany({
      take: 5,
      include: {
        parent: true,
        _count: {
          select: { products: true }
        }
      }
    })
    console.log(`✅ Successfully queried ${categories.length} category/categories with relations\n`)
    
    console.log('🎉 All database connection tests passed!')
    console.log('\n📊 Database Summary:')
    console.log(`   - Users: ${userCount}`)
    console.log(`   - Categories: ${categoryCount}`)
    console.log(`   - Products: ${productCount}`)
    console.log(`   - Brands: ${brandCount}`)
    
  } catch (error) {
    console.error('❌ Database connection failed!\n')
    console.error('Error details:')
    console.error(error)
    
    if (error instanceof Error) {
      console.error('\nError message:', error.message)
      console.error('Error stack:', error.stack)
      
      // Check for common errors
      if (error.message.includes('authentication')) {
        console.error('\n⚠️  Authentication error detected!')
        console.error('This might be due to MySQL authentication plugin mismatch.')
        console.error('See MYSQL_SETUP.md for solutions.')
      }
      
      if (error.message.includes('ECONNREFUSED')) {
        console.error('\n⚠️  Connection refused!')
        console.error('Check if:')
        console.error('  1. MySQL server is running')
        console.error('  2. DATABASE_URL is correct')
        console.error('  3. Firewall allows connection')
      }
      
      if (error.message.includes('Access denied')) {
        console.error('\n⚠️  Access denied!')
        console.error('Check if:')
        console.error('  1. Database credentials are correct')
        console.error('  2. User has proper permissions')
        console.error('  3. User can connect from your IP address')
      }
    }
    
    process.exit(1)
  } finally {
    await prisma.$disconnect()
    console.log('\n✅ Disconnected from database')
  }
}

// Run the test
testConnection()
  .catch((error) => {
    console.error('Unexpected error:', error)
    process.exit(1)
  })

