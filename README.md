# vibe-autotyper

Types a file into your editor character by character, like a human would. Useful for recordings or demos.

> **Disclaimer:** This project was fully vibe coded. Use at your own risk.

## Requirements

- Node.js 18+
- macOS (uses system keyboard APIs)
- Xcode Command Line Tools (`xcode-select --install`)

## Install

```bash
npm install
```

## Setup

**macOS — Accessibility permission**

The tool simulates keyboard input, so your terminal needs Accessibility access.

Go to System Settings → Privacy & Security → Accessibility and add your terminal app (Terminal, iTerm2, Warp, etc.).

**macOS — Disable "Add period with double space"**

Go to System Settings → Keyboard → Text Input → Edit and uncheck "Add period with double space". Without this, rapidly typed spaces can get mangled.

**VSCode settings**

Add these to your `settings.json` while using the tool:

```json
"editor.autoIndent": "none",
"editor.autoClosingBrackets": "never",
"editor.autoClosingQuotes": "never",
"editor.acceptSuggestionOnEnter": "off",
"editor.quickSuggestions": {
  "comments": "off",
  "strings": "off",
  "other": "off"
}
```

## Usage

```bash
node index.js <file> [options]
```

```
Options:
  -w, --wpm <number>   typing speed in words per minute (default: 60)
  -c, --countdown <n>  seconds before typing starts (default: 3)
  --no-jitter          type at exact WPM with no variation
  -d, --dry-run        print output to terminal instead of typing it
```

Open your target file in VSCode, switch focus to the editor, then run the command. The countdown gives you time to get ready.

## Examples

```bash
# Type a file at 80 WPM
node index.js src/main.js --wpm 80

# Preview what will be typed without touching the keyboard
node index.js src/main.js --dry-run

# 5 second countdown, no timing variation
node index.js src/main.js --countdown 5 --no-jitter
```
