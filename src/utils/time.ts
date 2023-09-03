import { DetailedTime } from "../types";

/**
 * Converts time in seconds into detailed time
 * @param seconds - time to convert
 * @returns converted time as detailed time
 */
export const toDetailedTime = (seconds: number): DetailedTime => ({
    hours: Math.floor(seconds / 3600),
    minutes: Math.floor((seconds % 3600) / 60),
    seconds: Math.floor((seconds % 3600) % 60),
});

/**
 * Converts detailed time to seconds
 * @param detailedTime - time to convert
 * @returns converted time as seconds
 */
export const toSeconds = (detailedTime: DetailedTime) =>
    detailedTime.seconds + detailedTime.minutes * 60 + detailedTime.hours * 3600;
