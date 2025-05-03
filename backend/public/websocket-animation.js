/**
 * WebSocket Connection Animation
 * This script creates a visual animation for WebSocket connections in the console
 */

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  underscore: '\x1b[4m',
  blink: '\x1b[5m',
  reverse: '\x1b[7m',
  hidden: '\x1b[8m',
  
  black: '\x1b[30m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  
  bgBlack: '\x1b[40m',
  bgRed: '\x1b[41m',
  bgGreen: '\x1b[42m',
  bgYellow: '\x1b[43m',
  bgBlue: '\x1b[44m',
  bgMagenta: '\x1b[45m',
  bgCyan: '\x1b[46m',
  bgWhite: '\x1b[47m'
};

// Animation frames for connection
const connectionFrames = [
  '⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'
];

// Animation frames for data transfer
const dataFrames = [
  '▁', '▂', '▃', '▄', '▅', '▆', '▇', '█', '▇', '▆', '▅', '▄', '▃', '▂'
];

// Connection animation
let connectionAnimationInterval = null;
let dataAnimationInterval = null;
let frameIndex = 0;
let dataFrameIndex = 0;

/**
 * Start the WebSocket server animation
 */
export function startWebSocketAnimation() {
  console.log('\n');
  console.log(`${colors.cyan}╔════════════════════════════════════════════════════════╗${colors.reset}`);
  console.log(`${colors.cyan}║ ${colors.bright}${colors.white}WebSocket Server Initialized${colors.reset}${colors.cyan}                          ║${colors.reset}`);
  console.log(`${colors.cyan}╚════════════════════════════════════════════════════════╝${colors.reset}`);
  console.log('\n');
  
  // Start connection animation
  connectionAnimationInterval = setInterval(() => {
    process.stdout.write(`\r${colors.cyan}${connectionFrames[frameIndex]} WebSocket server running...${colors.reset}`);
    frameIndex = (frameIndex + 1) % connectionFrames.length;
  }, 100);
}

/**
 * Display a WebSocket connection event
 * @param {string} socketId - The socket ID
 */
export function displayConnectionEvent(socketId) {
  if (connectionAnimationInterval) {
    clearInterval(connectionAnimationInterval);
    process.stdout.write('\r                                                  \r');
  }
  
  console.log(`${colors.green}▶ ${colors.bright}Client connected: ${colors.yellow}${socketId}${colors.reset}`);
  
  // Restart connection animation
  connectionAnimationInterval = setInterval(() => {
    process.stdout.write(`\r${colors.cyan}${connectionFrames[frameIndex]} WebSocket server running...${colors.reset}`);
    frameIndex = (frameIndex + 1) % connectionFrames.length;
  }, 100);
}

/**
 * Display a WebSocket disconnection event
 * @param {string} socketId - The socket ID
 */
export function displayDisconnectionEvent(socketId) {
  if (connectionAnimationInterval) {
    clearInterval(connectionAnimationInterval);
    process.stdout.write('\r                                                  \r');
  }
  
  console.log(`${colors.red}◀ ${colors.bright}Client disconnected: ${colors.yellow}${socketId}${colors.reset}`);
  
  // Restart connection animation
  connectionAnimationInterval = setInterval(() => {
    process.stdout.write(`\r${colors.cyan}${connectionFrames[frameIndex]} WebSocket server running...${colors.reset}`);
    frameIndex = (frameIndex + 1) % connectionFrames.length;
  }, 100);
}

/**
 * Display a WebSocket data event
 * @param {string} room - The room name
 * @param {string} event - The event name
 */
export function displayDataEvent(room, event) {
  if (connectionAnimationInterval) {
    clearInterval(connectionAnimationInterval);
    process.stdout.write('\r                                                  \r');
  }
  
  // Start data animation
  let animationCount = 0;
  dataAnimationInterval = setInterval(() => {
    const dataVisual = dataFrames.slice(0, dataFrameIndex + 1).join('');
    process.stdout.write(`\r${colors.magenta}${dataVisual} ${colors.bright}Emitting to ${colors.yellow}${room}${colors.reset}${colors.magenta}: ${colors.green}${event}${colors.reset}`);
    dataFrameIndex = (dataFrameIndex + 1) % dataFrames.length;
    animationCount++;
    
    if (animationCount > 20) {
      clearInterval(dataAnimationInterval);
      process.stdout.write('\r                                                                      \r');
      console.log(`${colors.magenta}✓ ${colors.bright}Emitted to ${colors.yellow}${room}${colors.reset}${colors.magenta}: ${colors.green}${event}${colors.reset}`);
      
      // Restart connection animation
      connectionAnimationInterval = setInterval(() => {
        process.stdout.write(`\r${colors.cyan}${connectionFrames[frameIndex]} WebSocket server running...${colors.reset}`);
        frameIndex = (frameIndex + 1) % connectionFrames.length;
      }, 100);
    }
  }, 50);
}

/**
 * Display a WebSocket room join event
 * @param {string} socketId - The socket ID
 * @param {string} room - The room name
 */
export function displayRoomJoinEvent(socketId, room) {
  if (connectionAnimationInterval) {
    clearInterval(connectionAnimationInterval);
    process.stdout.write('\r                                                  \r');
  }
  
  console.log(`${colors.blue}+ ${colors.bright}Socket ${colors.yellow}${socketId}${colors.reset}${colors.blue} joined room: ${colors.green}${room}${colors.reset}`);
  
  // Restart connection animation
  connectionAnimationInterval = setInterval(() => {
    process.stdout.write(`\r${colors.cyan}${connectionFrames[frameIndex]} WebSocket server running...${colors.reset}`);
    frameIndex = (frameIndex + 1) % connectionFrames.length;
  }, 100);
}

/**
 * Stop the WebSocket server animation
 */
export function stopWebSocketAnimation() {
  if (connectionAnimationInterval) {
    clearInterval(connectionAnimationInterval);
    process.stdout.write('\r                                                  \r');
  }
  
  if (dataAnimationInterval) {
    clearInterval(dataAnimationInterval);
    process.stdout.write('\r                                                                      \r');
  }
  
  console.log(`${colors.red}╔════════════════════════════════════════════════════════╗${colors.reset}`);
  console.log(`${colors.red}║ ${colors.bright}${colors.white}WebSocket Server Stopped${colors.reset}${colors.red}                              ║${colors.reset}`);
  console.log(`${colors.red}╚════════════════════════════════════════════════════════╝${colors.reset}`);
}
