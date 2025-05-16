/**
 * ReadWriteLock allows multiple concurrent readers or exclusive access for a single writer.
 * - Multiple readers can hold the lock simultaneously if no writer is active or waiting.
 * - Writers get exclusive access, blocking both new readers and writers until done.
 * - Writers are prioritized over readers when both are waiting (writer preference).
 *
 * Methods:
 *   acquireRead(): Promise<() => void>  // Acquire a read lock
 *   acquireWrite(): Promise<() => void> // Acquire a write lock
 */
class ReadWriteLock {
  /** Number of active readers */
  private readers = 0;
  /** Whether a writer is currently active */
  private writer = false;
  /** Queue of waiting reader requests (FIFO) */
  private readQueue: (() => void)[] = [];
  /** Queue of waiting writer requests (FIFO) */
  private writeQueue: (() => void)[] = [];

  /**
   * Acquire the lock for reading. Multiple readers can hold the lock concurrently
   * if no writer is active or waiting. Returns a release function to call when done.
   * @returns {Promise<() => void>} Promise resolving to a release function
   */
  async acquireRead(): Promise<() => void> {
    return new Promise(resolve => {
      const tryAcquire = () => {
        // Allow read if no writer is active or waiting (writer preference)
        if (!this.writer && this.writeQueue.length === 0) {
          this.readers++;
          resolve(() => this.releaseRead());
        } else {
          // Otherwise, queue this read request
          this.readQueue.push(tryAcquire);
        }
      };
      tryAcquire();
    });
  }

  /**
   * Acquire the lock for writing. Only one writer can hold the lock, and only when
   * there are no active readers or writers. Returns a release function to call when done.
   * @returns {Promise<() => void>} Promise resolving to a release function
   */
  async acquireWrite(): Promise<() => void> {
    return new Promise(resolve => {
      const tryAcquire = () => {
        // Allow write if no readers or writers
        if (!this.writer && this.readers === 0) {
          this.writer = true;
          resolve(() => this.releaseWrite());
        } else {
          // Otherwise, queue this write request
          this.writeQueue.push(tryAcquire);
        }
      };
      tryAcquire();
    });
  }

  /**
   * Release a read lock. If this was the last reader and writers are waiting,
   * the next writer is allowed to proceed.
   */
  private releaseRead() {
    this.readers--;
    // If no more readers and writers are waiting, allow the next writer
    if (this.readers === 0 && this.writeQueue.length > 0) {
      const next = this.writeQueue.shift();
      next?.();
    }
  }

  /**
   * Release a write lock. Writers are prioritized: if writers are waiting,
   * the next writer is allowed to proceed. Otherwise, all waiting readers are allowed.
   */
  private releaseWrite() {
    this.writer = false;
    // Priority to writers (writer preference)
    if (this.writeQueue.length > 0) {
      const next = this.writeQueue.shift();
      next?.();
    } else {
      // If no writers are waiting, allow all waiting readers
      while (this.readQueue.length > 0) {
        const next = this.readQueue.shift();
        next?.();
      }
    }
  }
}

const rwLock = new ReadWriteLock();
let sharedData = 0;

// Reader function
async function read(id: number) {
  const release = await rwLock.acquireRead();
  console.log(`[Reader ${id}] Reading: ${sharedData}`);
  await new Promise(res => setTimeout(res, 500));
  console.log(`[Reader ${id}] Done`);
  release();
}

// Writer function
async function write(id: number, value: number) {
  const release = await rwLock.acquireWrite();
  console.log(`[Writer ${id}] Writing: ${value}`);
  sharedData = value;
  await new Promise(res => setTimeout(res, 1000));
  console.log(`[Writer ${id}] Done`);
  release();
}

// Simulate parallel reads and writes
read(1);
read(2);
read(3);
read(4);
read(5);
read(6);
write(1, 42);
write(2, 100);
write(3, 200);
read(7);
read(8);
read(9);
write(4, 300);
read(10);
write(5, 100);

