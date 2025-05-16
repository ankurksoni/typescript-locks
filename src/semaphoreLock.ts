/**
 * SemaphoreLock allows up to a specified number of concurrent async operations.
 * Threads (async functions) that exceed the concurrency limit are queued and served in order.
 *
 */
class SemaphoreLock {
    /** Queue of waiting acquire requests (FIFO) */
    private readonly queue: Array<() => void> = [];

    /**
     * @param maxConcurrency Maximum number of concurrent operations allowed
     */
    constructor(private permits: number) {
        if (!Number.isInteger(permits) || permits < 1) {
            throw new Error('maxConcurrency must be a positive integer');
        }
        this.permits = permits;
    }

    /**
     * Acquires a permit, returning a release function to be called when done.
     * If no permits are available, the request is queued and will be served in order.
     * @returns {Promise<() => void>} Promise resolving to a release function
     */
    public async acquire(): Promise<() => void> {
        return new Promise(resolve => {
            const tryAcquire = () => {
                if (this.permits > 0) {
                    this.permits--;
                    // Return a release function bound to this instance
                    resolve(() => this.release());
                } else {
                    // No permits available, queue this request
                    this.queue.push(tryAcquire);
                }
            };
            tryAcquire();
        });
    }

    /**
     * Releases a permit, allowing the next waiting thread (if any) to proceed.
     * Called by the release function returned from acquire().
     */
    private release(): void {
        this.permits++;
        if (this.queue.length > 0) {
            // Serve the next waiting acquire request
            const next = this.queue.shift();
            next?.();
        }
    }
}

const semaphore = new SemaphoreLock(3); // Allow up to 3 concurrent threads

async function executeDemo(threadId: number) {
    const release = await semaphore.acquire();
    try {
        console.log(`Thread ${threadId} is executing...`);
        // random number between 10 and 1000
        const randomNumber = Math.floor(Math.random() * 990) + 10;
        await new Promise(resolve => setTimeout(resolve, randomNumber));
        console.log(`Thread ${threadId} has completed.`);
    } catch (error) {
        console.error(`Thread ${threadId} failed: ${error}`);
    } finally {
        if (typeof release === 'function') release();
    }
}

Promise.all([
    executeDemo(1),
    executeDemo(2),
    executeDemo(3),
    executeDemo(4),
    executeDemo(5),
    executeDemo(6),
    executeDemo(7),
    executeDemo(8),
    executeDemo(9),
    executeDemo(10),
]);