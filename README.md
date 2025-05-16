# TypeScript Locks Demo

This project demonstrates advanced locking mechanisms in TypeScript, simulating thread-like behavior using async functions. It includes a strict FIFO queue-based lock (`QueueLock`) and a colorful shell script for running different npm start commands interactively.

## Features

- **QueueLock**: A strict FIFO async lock for mutual exclusion, ensuring only one async function ("thread") can access a critical section at a time, and that threads are served in the order they requested the lock.
- **Thread Simulation**: Multiple async functions attempt to acquire and release the lock, simulating concurrent access and demonstrating fairness.
- **Interactive Shell Script**: `execute-threads.sh` provides a colorful menu to run various npm start commands and returns to the menu after each run.

---

## QueueLock (src/QueueLock.ts)

- Implements a strict FIFO mutual exclusion lock for async operations.
- Each "thread" (async function) is queued and served in the order it requested the lock.
- The lock is released after the critical section, allowing the next waiting thread to proceed.

### Usage

```typescript
const lock = new QueueLock();

async function executeDemo(threadId: number) {
    const release = await lock.acquire();
    try {
        // Critical section
    } finally {
        release();
    }
}

Promise.all([
    executeDemo(1),
    executeDemo(2),
    // ...
]);
```

---

## Interactive Script: `execute-threads.sh`

This script provides a colorful, interactive menu to run different npm start commands. After each command finishes, the menu is shown again, allowing you to run multiple commands in sequence without restarting the script.

### Menu Options

1. **npm start (default)**: Runs the default start script defined in your `package.json`.
2. **npm run start:dev**: Runs the development start script (if defined in your `package.json`).
3. **npm run start:prod**: Runs the production start script (if defined in your `package.json`).
4. **npm run queue-lock**: Runs the QueueLock thread simulation (see below).
5. **Exit**: Exits the menu.

### How to Use

1. Make the script executable (already done if you followed setup):
   ```bash
   chmod +x ./execute-threads.sh
   ```
2. Run the script:
   ```bash
   ./execute-threads.sh
   ```
3. Select an option by entering the corresponding number. The selected npm command will run, and when it finishes, you'll return to the menu.

### Customization
- You can add more menu options or npm scripts by editing `execute-threads.sh` and `package.json`.
- The script uses ANSI color codes for a better terminal experience.

---

## Project Structure

- `src/QueueLock.ts`: Queue-based lock implementation and thread simulation.
- `execute-threads.sh`: Interactive shell script for running npm commands.
- `README.md`: Project documentation.

---

## Requirements
- Node.js and npm
- Bash shell (for `execute-threads.sh`)

---

## License
MIT
