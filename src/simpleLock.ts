/**
 * SimpleLock provides a basic mutual exclusion lock for async operations.
 * Only one thread (async function) can acquire the lock at a time.
 * Other threads will wait until the lock is released.
 */
class SimpleLock {
    /** Indicates if the lock is currently held */
    private locked: boolean = false;

    /** Maximum wait time (ms) for each sleep cycle while waiting for the lock */
    private readonly maxWaitTime: number;

    /**
     * @param maxWaitTime Maximum time (ms) to wait between lock acquisition attempts
     */
    constructor(maxWaitTime: number) {
        this.maxWaitTime = maxWaitTime;
    }

    /**
     * Simulates waiting before retrying to acquire the lock.
     * Uses setTimeout to pause for maxWaitTime milliseconds.
     */
    private async sleepSimulation() {
        await new Promise((resolve) => setTimeout(resolve, this.maxWaitTime));
    }

    /**
     * Attempts to acquire the lock for a thread.
     * If the lock is held, waits and retries until it is available.
     * @param threadId Unique identifier for the thread (for logging)
     */
    public async acquire(threadId: number) {
        while (this.locked) {
            await this.sleepSimulation();
        }
        console.log(`Thread ${threadId} - Acquired lock`);
        this.locked = true;
    }

    /**
     * Releases the lock, allowing other threads to acquire it.
     * @param threadId Unique identifier for the thread (for logging)
     */
    public release(threadId: number) {
        this.locked = false;
        console.log(`Thread ${threadId} - Released lock`);
    }
}

// Create a lock instance with a 2-second max wait time per retry
const lock = new SimpleLock(2000);

/**
 * Simulates a thread attempting to acquire and release the lock.
 * @param threadId Unique identifier for the thread
 */
async function executeDemo(threadId: number) {
    try {
        await lock.acquire(threadId);
        // DO some work where only one thread can be in this block at a time.
    } catch (error) {
        console.error(error);
    } finally {
        lock.release(threadId);
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