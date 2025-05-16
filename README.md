# 🚦 TypeScript Locks Demo

![TypeScript](https://img.shields.io/badge/TypeScript-4.x-blue?logo=typescript)
![Node.js](https://img.shields.io/badge/Node.js-18.x-green?logo=node.js)
![Shell](https://img.shields.io/badge/Shell-Bash-informational?logo=gnu-bash)

> **A playground for learning and comparing different lock mechanisms in TypeScript, with interactive CLI tools!**

---

## ✨ Features

| Feature                        | Description                                                                 |
|------------------------------- |-----------------------------------------------------------------------------|
| 🏷️ **QueueLock**              | Strict FIFO async lock for fairness and mutual exclusion                     |
| 🧵 **Thread Simulation**       | Simulate multiple async functions ("threads") competing for a lock           |
| 🖥️ **Interactive Shell Script**| Colorful menu to run various npm start commands and lock demos               |

---

## 🔒 Lock Types Comparison

| Lock Type    | Fairness | Use Case Example                | Star Feature                |
|--------------|----------|---------------------------------|-----------------------------|
| SimpleLock   | ❌        | Basic mutual exclusion          | Easy to implement           |
| QueueLock    | ✅        | FIFO fairness for async tasks   | Prevents starvation         |
| Semaphore    | ➖        | Limit concurrency (N at a time) | Resource pool management    |
| RWLock       | ➖        | Read/write separation           | High read, low write ratio  |

> **Legend:**
> - ✅ = Fair (FIFO)
> - ❌ = Not fair (race possible)
> - ➖ = Depends on implementation

---

## 📦 Project Structure

```text
📁 src/
   └── QueueLock.ts      # FIFO lock implementation & demo
📄 execute-threads.sh    # Interactive shell script for npm commands
📄 README.md             # Project documentation (this file)
```

---

## 🔗 Usage

### 🖥️ Interactive Script: `execute-threads.sh`

```bash
chmod +x ./execute-threads.sh
./execute-threads.sh
```

**Menu Options:**

| Option | Command                        | Description                        |
|--------|--------------------------------|------------------------------------|
| 1      | npm start:simple-lock          | Run SimpleLock thread simulation   |
| 2      | npm run start:queue-lock       | Run QueueLock thread simulation    |
| 3      | npm run start:dev              | Start in development mode          |
| 4      | npm run start:prod             | Start in production mode           |
| 5      | Exit                           | Exit the menu                      |

---

## 🧩 QueueLock (src/QueueLock.ts)

```typescript
/**
 * QueueLock provides a strict FIFO (First-In-First-Out) mutual exclusion lock for async operations.
 * Each thread (async function) is queued and served in the order it requested the lock.
 */
class QueueLock {
    // ... see source for full docs ...
}

// Usage
const lock = new QueueLock();
async function executeDemo(threadId: number) {
    const release = await lock.acquire();
    try {
        // Critical section
    } finally {
        release();
    }
}
```

---

## 📝 Requirements

- [Node.js](https://nodejs.org/) (18.x or later recommended)
- [npm](https://www.npmjs.com/)
- [Bash](https://www.gnu.org/software/bash/) (for `execute-threads.sh`)

---

## 📚 Further Reading

- [MDN: Concurrency model and Event Loop](https://developer.mozilla.org/en-US/docs/Web/JavaScript/EventLoop)
- [Wikipedia: Mutual Exclusion](https://en.wikipedia.org/wiki/Mutual_exclusion)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

---

## ⚖️ License

MIT

