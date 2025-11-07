const { PrismaClient } = require('@prisma/client')

// Use minimal connection to kill old connections
const prisma = new PrismaClient({
  log: ['error'],
  datasources: {
    db: {
      url: process.env.DATABASE_URL?.replace('?connection_limit=3&pool_timeout=20', '?connection_limit=1&pool_timeout=5') || process.env.DATABASE_URL,
    },
  },
})

async function killOldConnections() {
  console.log('🔍 Attempting to kill old connections...\n')
  
  try {
    // First, try to connect with minimal connection
    await prisma.$connect()
    console.log('✅ Connected to database\n')
    
    // Get current user from DATABASE_URL
    const dbUrl = process.env.DATABASE_URL
    const userMatch = dbUrl.match(/\/\/([^:]+):/)
    const currentUser = userMatch ? userMatch[1] : 'zdnmnkw5_admin_user'
    
    console.log(`📊 Checking connections for user: ${currentUser}\n`)
    
    // Use raw query to get process list
    const processes = await prisma.$queryRaw`
      SELECT 
        id, 
        user, 
        host, 
        db, 
        command, 
        time, 
        state, 
        info
      FROM information_schema.processlist
      WHERE user = ${currentUser}
      ORDER BY time DESC
    `
    
    console.log(`Found ${processes.length} connection(s) for user ${currentUser}:\n`)
    
    if (processes.length === 0) {
      console.log('✅ No connections found - all cleared!')
      return
    }
    
    // Display connections
    processes.forEach((proc, index) => {
      console.log(`${index + 1}. ID: ${proc.id}, Command: ${proc.command}, Time: ${proc.time}s, State: ${proc.state || 'N/A'}`)
    })
    
    // Find idle/sleeping connections
    const idleConnections = processes.filter(p => 
      p.command === 'Sleep' && p.time > 5
    )
    
    if (idleConnections.length === 0) {
      console.log('\n✅ No idle connections found')
      return
    }
    
    console.log(`\n⚠️  Found ${idleConnections.length} idle connection(s) to kill\n`)
    
    // Kill idle connections
    let killed = 0
    for (const conn of idleConnections) {
      try {
        await prisma.$executeRawUnsafe(`KILL ${conn.id}`)
        console.log(`✅ Killed connection ID: ${conn.id} (idle for ${conn.time}s)`)
        killed++
      } catch (error) {
        console.error(`❌ Failed to kill connection ${conn.id}:`, error.message)
      }
    }
    
    console.log(`\n✅ Successfully killed ${killed} idle connection(s)`)
    console.log('\n💡 You can now test the connection again:')
    console.log('   npm run test:db')
    
  } catch (error) {
    console.error('❌ Error:', error.message)
    
    if (error.message.includes('Too many database connections')) {
      console.error('\n⚠️  Cannot connect to kill connections - too many are already open!')
      console.error('\n💡 Solutions:')
      console.error('   1. Contact your hosting provider to kill idle connections')
      console.error('   2. Wait 10-30 minutes for connections to timeout')
      console.error('   3. If you have MySQL CLI access, run:')
      console.error('      mysql -h zdn.mn -u zdnmnkw5_admin_user -p -e "SELECT CONCAT(\'KILL \', id, \';\') FROM information_schema.processlist WHERE user = \'zdnmnkw5_admin_user\' AND command = \'Sleep\' AND time > 30;"')
    }
    
    process.exit(1)
  } finally {
    await prisma.$disconnect()
    console.log('\n✅ Disconnected')
  }
}

killOldConnections()
  .catch((error) => {
    console.error('Unexpected error:', error)
    process.exit(1)
  })

