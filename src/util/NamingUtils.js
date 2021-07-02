import naming from "../json/naming.json";
import extensions from "../json/extensions.json";

export function getChordName(notes) {
    let intervals = getIntervalsBetweenNotesOfChord(notes);
    return getNameFromMap(intervals);
}

function getSemitonesBetweenNotes(a, b) {
    if(a < b) {
        return b - a;
    } else {
        return b + (12 - a);
    }
}

function getIntervalsBetweenNotesOfChord(notes) {
    let res = [];
    for (let i = 1; i < notes.length; i++) {
        let semitones = getSemitonesBetweenNotes(notes[0], notes[i]);
        res.push(semitones);
    }

    return res;
}

function getNameFromMap(intervals) {
    let current = naming;
    let lastIndex = 0;
    let val = "";
    for(let i = 0; i < intervals.length; i++) {
        let interval = intervals[i];
        let next = current[interval];
        if(!next) {
            lastIndex = i;
            break;
        }
        current = next;
    }

    if(lastIndex === 0) {
        return current.value;
    }

    var ext = extensions.seventh[intervals[lastIndex]]
    

    return current.value + ext;
}