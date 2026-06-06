const fs = require('fs');
const path = require('path');

const pitchesDir = path.join(__dirname, '../pitches');
const outputHtml = path.join(__dirname, '../morning-console.html');

let htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Night Shift - Morning Console</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-900 text-gray-100 min-h-screen p-8">
  <div class="max-w-5xl mx-auto">
    <header class="mb-10 border-b border-gray-700 pb-4">
      <h1 class="text-3xl font-bold text-blue-400">Night Shift Approval Console</h1>
      <p class="text-gray-400 mt-2">Review prototypes built while you were asleep.</p>
    </header>
    <div class="space-y-8">
`;

if (fs.existsSync(pitchesDir)) {
  const companies = fs.readdirSync(pitchesDir).filter(f => fs.statSync(path.join(pitchesDir, f)).isDirectory());
  
  if (companies.length === 0) {
    htmlContent += `<p class="text-gray-500 italic">No pitches generated yet.</p>`;
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

    const scoreColor = report.score >= 82 ? 'text-green-400' : 'text-red-400';
    const statusBadge = report.status === 'pass' 
      ? '<span class="bg-green-900 text-green-300 px-2 py-1 rounded text-xs uppercase font-bold">Passed QA</span>'
      : '<span class="bg-red-900 text-red-300 px-2 py-1 rounded text-xs uppercase font-bold">Failed QA</span>';

    htmlContent += `
      <div class="bg-gray-800 rounded-lg p-6 border border-gray-700 shadow-xl">
        <div class="flex justify-between items-start mb-4">
          <div>
            <h2 class="text-2xl font-semibold capitalize">${company} ${statusBadge}</h2>
            <div class="mt-2 space-x-4">
              <a href="https://jdurey.github.io/night-shift-pitches/p/${company}/" target="_blank" class="text-blue-400 hover:underline text-sm">View Live Prototype</a>
              <span class="text-gray-500">|</span>
              <span class="font-mono text-sm">QA Score: <span class="${scoreColor} font-bold">${report.score}/100</span></span>
            </div>
          </div>
          <button class="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded text-sm font-medium transition-colors" onclick="alert('Approve logic goes here (executes AppleScript)')">
            Approve & Draft Email
          </button>
        </div>
        
        <div class="mt-6 bg-gray-900 p-4 rounded text-sm font-mono text-gray-300">
          <h3 class="text-gray-500 uppercase tracking-wider text-xs mb-2">QA Details</h3>
          ${report.blocking_failures && report.blocking_failures.length > 0 
            ? `<p class="text-red-400">Blocking Failures:<br> - ${report.blocking_failures.join('<br> - ')}</p>`
            : '<p class="text-green-400">No blocking failures.</p>'
          }
        </div>
      </div>
    `;
  });
} else {
  htmlContent += `<p class="text-gray-500 italic">Pitches directory not found.</p>`;
}

htmlContent += `
    </div>
  </div>
</body>
</html>
`;

fs.writeFileSync(outputHtml, htmlContent, 'utf8');
console.log("Morning console generated at", outputHtml);
