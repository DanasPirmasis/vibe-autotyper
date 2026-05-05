const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

function gaussian(mean, stddev) {
  let u, v;
  do { u = Math.random(); } while (u === 0);
  do { v = Math.random(); } while (v === 0);
  return mean + stddev * Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

const PUNCT_END = new Set(['.', '!', '?']);
const PUNCT_MID = new Set([',', ';', ':']);
const OPEN_BRACKET = new Set(['{', '(', '[']);

function delayForChar(ch, base, jitter) {
  let interval = jitter
    ? Math.max(base * 0.15, gaussian(base, base * 0.35))
    : base;

  if (ch === '\n')               interval *= 1.5 + Math.random();
  else if (PUNCT_END.has(ch))    interval *= 2.5 + Math.random() * 1.5;
  else if (PUNCT_MID.has(ch))    interval *= 1.5 + Math.random() * 0.5;
  else if (OPEN_BRACKET.has(ch)) interval *= 1.1 + Math.random() * 0.4;

  return Math.round(interval);
}

function typeChar(ch, robot) {
  if (ch === '\n')      robot.keyTap('enter');
  else if (ch === '\t') robot.keyTap('tab');
  else                  robot.unicodeTap(ch.codePointAt(0));
}

async function runCountdown(seconds) {
  for (let i = seconds; i > 0; i--) {
    process.stdout.write(`\rStarting in ${i}s... (switch to target window now)`);
    await sleep(1000);
  }
  process.stdout.write('\rTyping now!                                        \n');
}

export async function type(text, { wpm, jitter, dryRun, countdown }) {
  const base = 60_000 / (wpm * 5);
  const estMinutes = Math.round(text.length / (wpm * 5) * 10) / 10;
  console.log(`${text.length} chars  |  ${wpm} WPM  |  ~${estMinutes} min`);

  let robot = null;
  if (!dryRun) {
    process.on('SIGINT', () => {
      process.stderr.write('\nStopped.\n');
      process.exit(0);
    });

    robot = (await import('robotjs')).default;
    robot.setKeyboardDelay(0);
    await runCountdown(countdown);
  }

  let i = 0;
  for (const ch of text) {
    if (dryRun) {
      process.stdout.write(ch);
    } else {
      typeChar(ch, robot);
    }
    await sleep(delayForChar(ch, base, jitter));
    i++;
    if (!dryRun && i % 50 === 0) {
      const pct = Math.round(i / text.length * 100);
      process.stderr.write(`\r[${pct}%] ${i}/${text.length} chars`);
    }
  }

  if (!dryRun) process.stderr.write('\rDone!                              \n');
}
