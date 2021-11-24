import { STANDARD_TUNING } from "../constants";

//get note on a string on a given fret
export function getNoteOnString(fret:number, string:number, tuning:number[] = STANDARD_TUNING) : number {
    return (tuning[string] + fret) % 12;
}

export function getNotePositionOnString(note:number, string:number, tuning:number[]) {
    let base = tuning[string];
    let diff = note - base;
    if(diff >= 0)
        return diff;
    return 12 - Math.abs(diff);
}