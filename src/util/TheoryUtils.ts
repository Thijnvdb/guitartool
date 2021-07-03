import { STANDARD_TUNING } from "../constants";

export function getNoteOnString(fret:number, string:number, tuning:number[] = STANDARD_TUNING) : number {
    return (tuning[string] + fret) % 12;
}