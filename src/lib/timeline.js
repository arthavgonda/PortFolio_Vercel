import { experience } from '../constants/index.js';

/*
 * Month arithmetic shared by the Experience section (scroll → time) and its 3D
 * tape (time → rotation). Time `t` is measured in months from the start of the
 * tape, which runs from January of the earliest role to December of the year
 * that contains today or the latest role, whichever is later.
 */

export const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

const toMonth = (ym) => {
    const [y, m] = ym.split('-').map(Number);
    return y * 12 + (m - 1);
};

const now = new Date();
const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
const todayAbs = now.getFullYear() * 12 + now.getMonth() + (now.getDate() - 1) / daysInMonth;

const starts = experience.map((job) => toMonth(job.start));
const ends = experience.map((job) => toMonth(job.end) + 1); // end month is inclusive

export const TAPE_START = Math.floor(Math.min(...starts) / 12) * 12;
export const TAPE_END = (Math.floor(Math.max(todayAbs, ...ends) / 12) + 1) * 12;
export const TAPE_MONTHS = TAPE_END - TAPE_START;

export const TODAY = todayAbs - TAPE_START;

// One span per role, in the same order as `experience` (newest first).
export const spans = experience.map((job, i) => ({
    label: job.tape,
    start: starts[i] - TAPE_START,
    end: ends[i] - TAPE_START,
}));

export const monthLabel = (t) => {
    const abs = Math.floor(TAPE_START + t);
    return `${MONTHS[((abs % 12) + 12) % 12]} ${Math.floor(abs / 12)}`;
};

export const activeSpan = (t) => spans.findIndex((s) => t >= s.start && t < s.end);

/*
 * Scroll progress → time. Scrolling rewinds: progress 0 is today, each role's
 * midpoint sits where its entry is centred in the list, and progress 1 is just
 * before the earliest role began. Within each stretch the motion eases in and
 * out, so the tape settles on a role while its entry is being read.
 */
const stops = [
    { p: 0, t: Math.min(TODAY, TAPE_MONTHS) },
    ...spans.map((s, i) => ({ p: (i + 0.5) / spans.length, t: (s.start + s.end) / 2 })),
    { p: 1, t: Math.max(0, Math.min(...spans.map((s) => s.start)) - 0.75) },
];

export const timeAt = (progress) => {
    const p = Math.min(Math.max(progress, 0), 1);
    let k = 0;
    while (k < stops.length - 2 && p > stops[k + 1].p) k += 1;
    const a = stops[k];
    const b = stops[k + 1];
    const local = (p - a.p) / (b.p - a.p);
    const eased = local * local * (3 - 2 * local);
    return a.t + (b.t - a.t) * eased;
};
