export type ModalStatus = 'visible' | 'hidden';
export type TimerStatus = 'started' | 'stopped' | 'paused';

export type MiscSettings = {
    status: {
        settings: ModalStatus,
        popup: ModalStatus,
        timer: TimerStatus
    },
    message: string
}