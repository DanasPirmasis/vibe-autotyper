import { execSync } from 'child_process';
import { existsSync, readFileSync } from 'fs';
import { program } from 'commander';
import { type } from './typer.js';

program
  .name('vibe-autotyper')
  .description('Types a code file character-by-character into the focused window')
  .version('1.0.0')
  .argument('<file>', 'path to source file to type')
  .option('-w, --wpm <number>', 'target typing speed in words per minute', (v) => parseFloat(v), 60)
  .option('-c, --countdown <n>', 'seconds to count down before typing starts', (v) => parseInt(v, 10), 3)
  .option('--no-jitter', 'disable random timing variation (exact WPM)')
  .option('-d, --dry-run', 'print characters to stdout without typing')
  .parse();

const [filePath] = program.args;
const { wpm, countdown, jitter, dryRun } = program.opts();

if (isNaN(wpm) || wpm <= 0) {
  console.error('Invalid --wpm value: must be a positive number.');
  process.exit(1);
}

if (isNaN(countdown) || countdown < 0) {
  console.error('Invalid --countdown value: must be a non-negative integer.');
  process.exit(1);
}

if (!existsSync(filePath)) {
  console.error(`File not found: ${filePath}`);
  process.exit(1);
}

const raw = readFileSync(filePath, 'utf8');
const text = raw.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

if (text.length === 0) {
  console.error('File is empty, nothing to type.');
  process.exit(0);
}

if (!dryRun) {
  try {
    execSync(
      "osascript -e 'tell application \"System Events\" to return name of first process'",
      { stdio: 'ignore', timeout: 3000 }
    );
  } catch {
    console.error([
      'ERROR: Accessibility permission denied.',
      'Grant access at:',
      '  System Settings > Privacy & Security > Accessibility',
      'Add your terminal app (Terminal, iTerm2, Warp, etc.) and retry.',
    ].join('\n'));
    process.exit(1);
  }
}

console.log(`File: ${filePath}`);
type(text, { wpm, countdown, jitter, dryRun })
  .catch(err => { console.error(err); process.exit(1); });
