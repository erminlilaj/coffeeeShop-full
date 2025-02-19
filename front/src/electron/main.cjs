// File: src/electron/main.cjs

const { app, BrowserWindow, protocol } = require('electron');
const path = require('path');
const { spawn } = require('child_process');
const url = require('url');

// const isDev = process.env.NODE_ENV === 'development';
const isDev = false; // Change this to false
let backendProcess; // Add this line back
let frontendProcess;

function createWindow() {
  const win = new BrowserWindow({
    width: 1024,
    height: 768,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: false // Only for development
    }
  });

  // Register protocol if needed (for local file handling)
  protocol.registerFileProtocol('file', (request, callback) => {
    const filePath = url.fileURLToPath(
      'file://' + request.url.slice('file://'.length)
    );
    callback(filePath);
  });

  // In both dev and production, load the running server at port 4321.
  win.loadURL('http://localhost:4321');

  // Handle navigation failures by retrying.
  win.webContents.on('did-fail-load', () => {
    console.log('Failed to load URL');
    setTimeout(() => {
      win.loadURL('http://localhost:4321');
    }, 1000);
  });
}

function startFrontendServer() {
  // In production, start the Astro server bundle.
  const serverEntry = path.join(__dirname, '../../dist/server/entry.mjs');
  frontendProcess = spawn('node', [serverEntry]);

  frontendProcess.stdout.on('data', (data) => {
    console.log(`Frontend: ${data}`);
  });

  frontendProcess.stderr.on('data', (data) => {
    console.error(`Frontend Error: ${data}`);
  });
}

function startBackend() {
  const jarPath = path.join(__dirname, '..', '..', 'backend', 'backend.jar');
  backendProcess = spawn('java', [
    '-jar',
    jarPath,
    '--server.port=8080', // Set the backend port
    '--spring.datasource.url=jdbc:h2:file:./data/coffeedb;DB_CLOSE_DELAY=-1;AUTO_SERVER=TRUE'
  ]);

  backendProcess.stdout.on('data', (data) => {
    console.log(`Backend: ${data}`);
  });
  backendProcess.stderr.on('data', (data) => {
    console.error(`Backend Error: ${data}`);
  });
}

app.whenReady().then(() => {
  if (!isDev) {
    startBackend(); // Call the backend
    startFrontendServer();
  }

  // Give the server time to start up before creating the window.
  setTimeout(() => {
    createWindow();
  }, 3000);

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    if (backendProcess) backendProcess.kill();
    app.quit();
  }
});
