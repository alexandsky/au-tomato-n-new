/**
 * Ticker function for web worker
 */
export function ticker() {
    // Tick delay
    const DELAY = 1000;

    // Ticker state
    const state = {
        // Tick function
        func: () => {
            postMessage(0);
        },
        // Stop function
        stop: () => { },
    };

    // SAJ stands for self-adjusting timer
    /**
     * Creates self-adjusting timer
     * @param func - function to execute on every timer tick
     * @param delay - timer tick delay
     * @returns stop function
     */
    const setSAJ = (func: () => void, delay: number) => {
        // expected time on the moment of the next timer tick
        let expected = Date.now() + delay;

        // single tick timer
        let timer = setTimeout(tick, delay);

        // stop function
        const stop = () => {
            clearTimeout(timer);
        };

        // tick function
        function tick() {
            let drift = Date.now() - expected; // time drift (positive for overshooting)
            if (drift > delay) {
                console.error(
                    `Unexpectedly big timer drift: ${drift}ms. Timer will be stopped.`
                );
            } else {
                func();
                expected += delay;
                timer = setTimeout(tick, Math.max(0, delay - drift)); // take into account drift
            }
        }

        return stop;
    };

    // Stops state SAJ timer
    const stop = () => {
        state.stop();
    };

    // Possible worker 'actions'
    const actions: { [key: string]: () => void } = {
        /**
         * Starts ticker
         */
        start: () => {
            stop();
            state.stop = setSAJ(state.func, DELAY);
        },

        /**
         * Stops ticker
         */
        stop
    };

    // postMessage handler
    onmessage = (e: { data?: 'start' | 'stop' }) => {
        if (e.data) {
            actions[e.data]();
        }
    };
}
