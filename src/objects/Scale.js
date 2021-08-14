import { NOTES } from "../constants";
import { getChordName } from "../util/NamingUtils";

export class Scale{
    constructor(root, family, offset = 0) {
        this.root = root;
        this.family = family;
        this.offset = offset;
        this.notes = []
        this.init();
    }

    init() {
        let nts = [];
        nts[0] = Number(this.root);
        for (let i = this.offset; i < this.family.intervals.length; i++) {
            nts.push((Number(nts[nts.length - 1]) + Number(this.family.intervals[i])) % 12);
        }

        for (let i = 0; i < this.offset; i++) {
            nts.push((Number(nts[nts.length - 1]) + Number(this.family.intervals[i])) % 12);
        }

        this.notes = nts;
    }

    //get note by index, including out of range indices. this also ignores the last (doubled) note in the scale
    getNote(index) {
        return this.notes[index % (this.notes.length - 1)];
    }

    getChord(startIndex, indices) {
        let noots = [];
        for (let i = 0; i < indices.length; i++) {
            const index = indices[i];
            noots.push(this.getNote(index + startIndex));
        }

        return {name:NOTES[this.notes[startIndex]].names[0] + getChordName(noots), notes: noots};
    }

    getChordsOfType(type) {
        let result = [];
        for (let i = 0; i < this.notes.length - 1; i++) {
            result.push(this.getChord(i, type));
        }

        return result;
    }
}