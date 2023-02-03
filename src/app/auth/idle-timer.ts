export class IdleTimer {
    private readonly timeout: any;
    private readonly onTimeout: any;
    private readonly eventHandler: any;
    private interval: any;
    private timeoutTracker: any;

    constructor({ timeout, onTimeout }) {
        this.timeout = timeout;
        this.onTimeout = onTimeout;

        this.eventHandler = this.updateExpiredTime.bind(this);
        this.tracker();
        this.startInterval();
    }

    private tracker() {
        window.addEventListener('mousemove', this.eventHandler);
        window.addEventListener('scroll', this.eventHandler);
        window.addEventListener('keydown', this.eventHandler);
    }

    private startInterval() {
        this.updateExpiredTime();

        this.interval = setInterval(() => {
            const expiredTime = parseInt(localStorage.getItem('_expiredTime'), 10);
            if (expiredTime < Date.now()) {
                if (this.onTimeout) {
                    this.onTimeout();
                    this.cleanUp();
                }
            }
        }, 1000);
    }

    private updateExpiredTime() {
        if (this.timeoutTracker) {
            clearTimeout(this.timeoutTracker);
        }
        this.timeoutTracker = setTimeout(() => {
            localStorage.setItem('_expiredTime', String(Date.now() + this.timeout * 1000));
        }, 300);
    }

    private cleanUp() {
        console.log('cleanup')
        clearInterval(this.interval);
        window.removeEventListener('mousemove', this.eventHandler);
        window.removeEventListener('scroll', this.eventHandler);
        window.removeEventListener('keydown', this.eventHandler);
    }

}
