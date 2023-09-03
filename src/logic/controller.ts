import { defaultPopupMessages } from "../data";
import { DetailedTime, MiscSettings, PomoSettings, PomoState } from "../types";
import { MAX_POMO_CYCLE_VALUE, toDetailedTime } from "../utils";
import { ticker } from "./ticker";
import blip from '../assets/sounds/blip.wav';

export class Controller {
    private misc: MiscSettings;
    private settings: PomoSettings;
    private state: PomoState;
    private time: DetailedTime;
    private ticker = new Worker(
        URL.createObjectURL(new Blob([`(${ticker})()`]))
    );
    private blip = new Audio(blip);

    constructor(
        misc: MiscSettings,
        settings: PomoSettings,
        state: PomoState,
        time: DetailedTime
    ) {
        this.misc = misc;
        this.settings = settings;
        this.state = state;
        this.time = time;
        this.ticker.onmessage = () => {
            if (!this.secondsTick()) {
                this.nextPhase();
            }
        }
    }

    // timer-related methods

    private secondsTick() {
        if (this.time.seconds > 0) {
            this.time.seconds--;
            return true;
        }

        if (this.minutesTick()) {
            this.time.seconds = 59;
            return true;
        }

        return false;
    }

    private minutesTick() {
        if (this.time.minutes > 0) {
            this.time.minutes--;
            return true;
        }

        if (this.hoursTick()) {
            this.time.minutes = 59;
            return true;
        }

        return false;
    }

    private hoursTick() {
        if (this.time.hours > 0) {
            this.time.hours--;
            return true;
        }

        return false;
    }

    // pomodoro-related methods

    private updateTime() {
        Object.assign(this.time, toDetailedTime(this.settings.time[this.state.phase] * 60));
    }

    private showPopup() {
        this.misc.message = defaultPopupMessages[this.state.phase];
        this.misc.status.popup = 'visible';
        setTimeout(() => this.misc.status.popup = 'hidden', 5000);
    }

    private nextCycle() {
        if (this.state.cycle + 1 > MAX_POMO_CYCLE_VALUE) {
            console.error("Pomodoro timer has reached cycle limit!");
            this.state.cycle = 0;
            return;
        }
        this.state.cycle++;
    }

    private nextPhase() {
        if (this.state.phase !== 'work') {
            this.state.phase = 'work';
            this.nextCycle();
        }
        else if ((this.state.cycle + 1) % this.settings.period === 0) {
            this.state.phase = 'rest';
        }
        else {
            this.state.phase = 'break';
        }
        this.updateTime();
        this.blip.play();
        this.showPopup();
    }

    reset() {
        Object.assign(this.time, toDetailedTime(this.settings.time.work * 60));
        this.state.cycle = 0;
        this.state.phase = 'work';
    }

    start() {
        this.reset();
        this.ticker.postMessage('start');
        this.misc.status.timer = 'started';
    }

    resume() {
        this.ticker.postMessage('start');
        this.misc.status.timer = 'started';
    }

    stop() {
        this.ticker.postMessage('stop');
        this.reset();
        this.misc.status.timer = 'stopped';
    }

    pause() {
        this.ticker.postMessage('stop');
        this.misc.status.timer = 'paused';
    }
}