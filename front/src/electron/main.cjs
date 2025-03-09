const { app, BrowserWindow, protocol } = require('electron');
const path = require('path');
const { spawn, execSync } = require('child_process');
const url = require('url');
const net = require('net');

const isDev = false; // Set false for production
let backendProcess;
let frontendProcess;

function isPortInUse(port) {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.unref();
    server.on('error', () => resolve(true)); // Port is in use
    server.listen(port, () => {
      server.close(() => resolve(false)); // Port is free
    });
  });
}

async function startBackend() {
  const backendPort = 8080;
  if (await isPortInUse(backendPort)) {
    console.error(`Port ${backendPort} is already in use. Backend not started.`);
    return;
  }

  const jarPath = path.join(__dirname, '..', '..', 'backend', 'backend.jar');
  backendProcess = spawn('java', [
    '-jar',
    jarPath,
    '--server.port=8080',
    '--spring.datasource.url=jdbc:h2:file:./data/coffeedb;DB_CLOSE_DELAY=-1;AUTO_SERVER=TRUE'
  ]);

  backendProcess.stdout.on('data', (data) => console.log(`Backend: ${data}`));
  backendProcess.stderr.on('data', (data) => console.error(`Backend Error: ${data}`));

  backendProcess.on('exit', (code) => {
    console.log(`Backend exited with code ${code}`);
  });
}

async function startFrontendServer() {
  const frontendPort = 4321;
  if (await isPortInUse(frontendPort)) {
    console.error(`Port ${frontendPort} is already in use. Frontend not started.`);
    return;
  }

  const serverEntry = path.join(__dirname, '../../dist/server/entry.mjs');
  frontendProcess = spawn('node', [serverEntry]);

  frontendProcess.stdout.on('data', (data) => console.log(`Frontend: ${data}`));
  frontendProcess.stderr.on('data', (data) => console.error(`Frontend Error: ${data}`));

  frontendProcess.on('exit', (code) => {
    console.log(`Frontend exited with code ${code}`);
  });
}

function createWindow() {
  const win = new BrowserWindow({
    width: 1024,
    height: 768,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: false // Disable only for dev
    }
  });

  win.loadURL('http://localhost:4321');

  win.webContents.on('did-fail-load', () => {
    console.log('Failed to load URL, retrying...');
    setTimeout(() => win.loadURL('http://localhost:4321'), 1000);
  });
}

function killProcessOnPort(port) {
  try {
    if (process.platform === 'win32') {
      execSync(`netstat -ano | findstr :${port} | find "LISTENING" && for /f "tokens=5" %a in ('netstat -ano ^| findstr :${port} ^| find "LISTENING"') do taskkill /PID %a /F`);
    } else {
      execSync(`lsof -ti:${port} | xargs kill -9`);
    }
    console.log(`Killed process on port ${port}`);
  } catch (error) {
    console.log(`No process found on port ${port} or unable to terminate.`);
  }
}

app.whenReady().then(async () => {
  if (!isDev) {
    await startBackend();
    await startFrontendServer();
  }

  setTimeout(() => createWindow(), 3000);

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    if (backendProcess) backendProcess.kill();
    if (frontendProcess) frontendProcess.kill();

    // Ensure ports are closed properly
    killProcessOnPort(8080);
    killProcessOnPort(4321);

    app.quit();
  }
});
