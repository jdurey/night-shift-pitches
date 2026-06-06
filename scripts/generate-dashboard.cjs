const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const pitchesDir = path.join(__dirname, '../pitches');
const outputHtml = path.join(__dirname, '../morning-console.html');

let htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Night Shift - Morning Console</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; background-color: #111827; color: #f3f4f6; margin: 0; padding: 2rem; }
    .container { max-w: 1024px; margin: 0 auto; }
    header { border-bottom: 1px solid #374151; padding-bottom: 1rem; margin-bottom: 2rem; }
    h1 { color: #60a5fa; margin: 0; font-size: 1.875rem; }
    .card { background-color: #1f2937; border: 1px solid #374151; border-radius: 0.5rem; padding: 1.5rem; margin-bottom: 1.5rem; }
    .flex-between { display: flex; justify-content: space-between; align-items: flex-start; }
    .badge { padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-size: 0.75rem; font-weight: bold; text-transform: uppercase; }
    .badge-pass { background-color: #064e3b; color: #6ee7b7; }
    .badge-fail { background-color: #7f1d1d; color: #fca5a5; }
    .link { color: #60a5fa; text-decoration: none; }
    .link:hover { text-decoration: underline; }
    .score-pass { color: #4ade80; font-weight: bold; }
    .score-fail { color: #f87171; font-weight: bold; }
    .code-block { background-color: #111827; padding: 1rem; border-radius: 0.25rem; margin-top: 1rem; font-family: monospace; font-size: 0.875rem; color: #d1d5db; }
  </style>
</head>
<body>
  <div class="container">
    <header>
      <h1>Night Shift Approval Console</h1>
      <p style="color: #9ca3af; margin-top: 0.5rem;">Review prototypes built while you were asleep.</p>
    </header>
    <div>
`;

if (fs.existsSync(pitchesDir)) {
  const companies = fs.readdirSync(pitchesDir).filter(f => fs.statSync(path.join(pitchesDir, f)).isDirectory());
  
  if (companies.length === 0) {
    htmlContent += `<p style="color: #6b7280; font-style: italic;">No pitches generated yet.</p>`;
  }

  companies.forEach(company => {
    const reportPath = path.join(pitchesDir, company, 'qa-report.json');
    let report = { status: 'pending', score: 0, blocking_failures: [] };
    if (fs.existsSync(reportPath)) {
      try {
        report = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
      } catch (e) {
        console.error("Failed to parse report for", company);
      }
    }

    const emailPath = path.join(pitchesDir, company, 'email-draft.md');
    let emailContent = "No email draft found.";
    if (fs.existsSync(emailPath)) {
      emailContent = fs.readFileSync(emailPath, 'utf8');
      
      // GENERATE THE APPLE SCRIPT EXECUTABLE
      const commandPath = path.join(__dirname, '..', `approve-${company}.command`);
      
      const safeEmail = emailContent.replace(/"/g, '\\\"').replace(/\n/g, '\\r');

      const scriptContent = `#!/bin/bash
osascript -e '
tell application "Mail"
    set newMessage to make new outgoing message with properties {subject:"${company} Knowledge Architecture", content:"${safeEmail}", visible:true}
    tell newMessage to make new to recipient at end of to recipients with properties {address:"founder@${company}.com"}
    activate
end tell
'
`;
      fs.writeFileSync(commandPath, scriptContent, 'utf8');
      execSync(`chmod +x "${commandPath}"`);
    }

    const scoreClass = report.score >= 82 ? 'score-pass' : 'score-fail';
    const badgeClass = report.status === 'pass' ? 'badge-pass' : 'badge-fail';
    const statusText = report.status === 'pass' ? 'Passed QA' : 'Failed QA';

    htmlContent += `
      <div class="card">
        <div class="flex-between">
          <div>
            <h2 style="margin-top: 0; text-transform: capitalize;">${company} <span class="badge ${badgeClass}">${statusText}</span></h2>
            <div style="margin-top: 0.5rem;">
              <a href="https://jdurey.github.io/night-shift-pitches/#/p/${company}" target="_blank" class="link">View Live Prototype</a>
              <span style="color: #6b7280; margin: 0 0.5rem;">|</span>
              <span style="font-family: monospace;">QA Score: <span class="${scoreClass}">${report.score}/100</span></span>
            </div>
          </div>
          ${report.status === 'pass' ? `<div style="background-color: #1e3a8a; padding: 0.5rem 1rem; border-radius: 0.25rem; font-size: 0.875rem;">👉 Double-click <b>approve-${company}.command</b> in the folder to draft email</div>` : ''}
        </div>
        
        <div class="code-block">
          <h3 style="color: #6b7280; text-transform: uppercase; font-size: 0.75rem; margin-top: 0; margin-bottom: 0.5rem;">QA Details</h3>
          ${report.blocking_failures && report.blocking_failures.length > 0 
            ? `<p style="color: #f87171; margin:0;">Blocking Failures:<br> - ${report.blocking_failures.join('<br> - ')}</p>`
            : '<p style="color: #4ade80; margin:0;">No blocking failures.</p>'
          }
        </div>
      </div>
    `;
  });
} else {
  htmlContent += `<p style="color: #6b7280; font-style: italic;">Pitches directory not found.</p>`;
}

htmlContent += `
    </div>
  </div>
</body>
</html>
`;

fs.writeFileSync(outputHtml, htmlContent, 'utf8');
console.log("Morning console generated at", outputHtml);
