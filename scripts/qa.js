import fs from 'fs';
import path from 'path';
import { execSync, spawn } from 'child_process';
import { fileURLToPath } from 'url';
import puppeteer from 'puppeteer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const slug = process.argv[2];
if (!slug) {
  console.error("❌ Error: Must provide a company slug (e.g. npm run qa vimi)");
  process.exit(1);
}

const rootDir = path.join(__dirname, '..');
const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);
const componentName = capitalize(slug);

console.log(`\n=== 🧪 Starting QA Gate for: ${slug} ===\n`);

try {
  // 1. Lint
  console.log("1. Running Lint...");
  execSync('npm run lint', { stdio: 'inherit', cwd: rootDir });
  
  // 2. Build
  console.log("2. Running Build...");
  execSync('npm run build', { stdio: 'inherit', cwd: rootDir });

  // 3. Route Check
  console.log("3. Checking App.jsx for route...");
  const appPath = path.join(rootDir, 'src', 'App.jsx');
  const appCode = fs.readFileSync(appPath, 'utf8');
  if (!appCode.includes(`path="/p/${slug}"`)) {
    throw new Error(`Route path="/p/${slug}" not found in App.jsx`);
  }

  // 4. Disclaimer Check
  console.log("4. Checking for UI Disclaimer...");
  const compPath = path.join(rootDir, 'src', 'pitches', `${componentName}.jsx`);
  if (!fs.existsSync(compPath)) {
    throw new Error(`Component not found: ${compPath}`);
  }
  const compCode = fs.readFileSync(compPath, 'utf8');
  const hasDisclaimer = compCode.toLowerCase().includes('simulated data') || compCode.toLowerCase().includes('mockup');
  if (!hasDisclaimer) {
    throw new Error(`Component missing "Simulated Data" or "Mockup" disclaimer.`);
  }

  // 5. Email Check
  console.log("5. Checking Email Draft...");
  const emailPath = path.join(rootDir, 'pitches', slug, 'email-draft.md');
  if (!fs.existsSync(emailPath)) {
    throw new Error(`Email draft not found: ${emailPath}`);
  }

  // 6. Screenshot Check (Test Render)
  console.log("6. Generating Screenshots...");
  const serveProcess = spawn('npm', ['run', 'preview'], { cwd: rootDir });
  
  // Wait a few seconds for preview server to start
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  const browser = await puppeteer.launch({ headless: "new", args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  
  try {
    await page.setViewport({ width: 1280, height: 800 });
    await page.goto(`http://localhost:4173/night-shift-pitches/#/p/${slug}`, { waitUntil: 'networkidle2' });
    
    const screenshotDir = path.join(rootDir, 'pitches', slug);
    await page.screenshot({ path: path.join(screenshotDir, 'screenshot-desktop.png') });
    
    await page.setViewport({ width: 375, height: 667, isMobile: true });
    await page.screenshot({ path: path.join(screenshotDir, 'screenshot-mobile.png') });
    
    console.log("Screenshots captured successfully.");
  } finally {
    await browser.close();
    serveProcess.kill();
  }

  console.log(`\n✅ QA GATE PASSED for ${slug}\n`);
  process.exit(0);

} catch (error) {
  console.error(`\n❌ QA GATE FAILED for ${slug}\n`);
  console.error(error.message || error);
  process.exit(1);
}
