/**
 * QueueLock provides a strict FIFO (First-In-First-Out) mutual exclusion lock for async operations.
 * Each thread (async function) is queued and served in the order it requested the lock.
 */
class QueueLock {
    /** Indicates if the lock is currently held */
    private locked: boolean = false;
    /** Queue of waiting functions to acquire the lock */
    private queue: (() => void)[] = [];

    /**
     * Acquires the lock, returning a release function to be called when done.
     * If the lock is held, the request is queued and will be served in order.
     * @returns {Promise<() => void>} A promise that resolves to a release function
     */
    public async acquire(): Promise<() => void> {
        return new Promise((resolve) => {
            const tryAcquire = () => {
                if (!this.locked) {
                    this.locked = true;
                    /**
                     * The release function must be called to release the lock.
                     * It will serve the next waiting thread in the queue, if any.
                     */
                    resolve(() => {
                        this.locked = false;
                        if (this.queue.length > 0) {
                            const next = this.queue.shift();
                            next?.();
                        }
                    });
                } else {
                    // If locked, queue this acquire attempt
                    this.queue.push(tryAcquire);
                }
            };
            tryAcquire();
        });
    }
}

// Create a global QueueLock instance
const queuedLocks = new QueueLock();

/**
 * Simulates a thread acquiring and releasing the lock.
 * The lock is held for a random duration to simulate work.
 * @param threadId Unique identifier for the thread
 */
async function executeDemo(threadId: number) {
    const release = await queuedLocks.acquire();
    try {
        console.log(`Thread ${threadId} - Acquired lock`);
        // Simulate work (random delay)
        await new Promise((resolve) => setTimeout(resolve, Math.random() * 2000 + 500));
        console.log(`Thread ${threadId} - Releasing lock`);
    } finally {
        release();
    }
}

// Start 5 threads in parallel, each trying to acquire the lock
Promise.all([
    executeDemo(1),
    executeDemo(2),
    executeDemo(3),
    executeDemo(4),
    executeDemo(5),
]);
