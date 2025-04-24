const readline = require("readline")
const { execSync } = require("child_process")
const net = require('net')

const colors = {
  green: "\x1b[32m",
  blue: "\x1b[34m",
  white: "\x1b[37m",
  yellow: "\x1b[33m",
  red: "\x1b[31m",
  reset: "\x1b[0m",
}

const availableApps = {
  web: true,
  server: true,
}

const requiredApps = ["server"]

function parseArgs() {
  const args = process.argv.slice(2)
  if (args.length === 0) {
    console.log(`${colors.yellow}⚠️ Warning: No apps specified. Running all available apps.${colors.reset}`)
    return Object.keys(availableApps)
  }

  return args.filter((app) => availableApps[app] !== undefined)
}

function buildPnpmFilter(selectedApps) {
  const allApps = [...requiredApps, ...selectedApps]
  return allApps.map((app) => app === 'web' ? 'frontend' : 'backend').join(",")
}

async function generatePrisma() {
  console.log(`${colors.blue}🔧 Generating Prisma Client...${colors.reset}`)
  try {
    execSync("cd backend && npx prisma generate", { stdio: "inherit" })
    console.log(`${colors.green}✓ Prisma Client generated successfully${colors.reset}\n`)
  } catch (error) {
    console.error(`${colors.red}❌ Failed to generate Prisma Client: ${error.message}${colors.reset}`)
    process.exit(1)
  }
}

function findAvailablePort(startPort) {
  return new Promise((resolve, reject) => {
    const server = net.createServer()
    server.listen(startPort, () => {
      const port = server.address().port
      server.close(() => resolve(port))
    })
    server.on('error', () => {
      resolve(findAvailablePort(startPort + 1))
    })
  })
}

async function startDevelopment(selectedApps) {
  console.log(`${colors.blue}Starting development with apps:${colors.reset}`)
  console.log(`${colors.green}• ${[...requiredApps, ...selectedApps].join("\n• ")}${colors.reset}\n`)

  console.log(`${colors.yellow}🚀 Preparing for launch! Paperclip's engines are warming up...${colors.reset}\n`)

  try {
    await generatePrisma()

    const frontendPort = await findAvailablePort(3000)
    const backendPort = await findAvailablePort(4000)

    console.log(`${colors.blue}📡 Frontend will run on port ${frontendPort}${colors.reset}`)
    console.log(`${colors.yellow}📡 Backend will run on port ${backendPort}${colors.reset}\n`)

    const apps = buildPnpmFilter(selectedApps)
    execSync(
      `PORT=${backendPort} NEXT_PORT=${frontendPort} dotenv -e .env.local -- concurrently -c "blue.bold,yellow.bold" -n "@paperclip/web:dev,@paperclip/server:dev" "pnpm --filter frontend dev --port ${frontendPort}" "pnpm --filter backend dev"`,
      { stdio: "inherit" }
    )
  } catch (error) {
    console.error(`${colors.red}❌ Error starting development servers: ${error.message}${colors.reset}`)
    process.exit(1)
  }
}

const selectedApps = parseArgs()
startDevelopment(selectedApps)
