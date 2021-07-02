import { STANDARD_TUNING } from "../constants";
import Diagram from "../components/Diagram";

export async function getDiagramsForChord(chord: { name: any; notes: number[]}, tuning: number[]) : Promise<{name:string, fingering: Array<number>}[]> {
    let result = [];
    let fingering = getChordFingerings(chord, tuning);
    fingering = removeDuplicates(fingering);
    
    for (let crd of fingering) {
       result.push({name:chord.name, fingering:crd})
    }

    return result;
}

function removeDuplicates(array: number[][]): number[][] {
    let res : number[][] = [];
    let set : Set<any> = new Set();

    for(let val of array) {
        let string = JSON.stringify(val);
        if(!set.has(string)) {
            set.add(string);
            res.push(val);
        }
    }

    return res;
}

function getChordFingerings(chord: { name?: any; notes: any; }, tuning = STANDARD_TUNING): number[][] {
    let notes: number[] = chord.notes;
    
    let possibilities: number[][] = [];
    for(let i = 0; i < 6; i++) {
        possibilities.push([]);
    }

    for (let fret = 0; fret < 12; fret++) {
        for (let string = 0; string < 6; string++) {
            if (notes.includes((tuning[string] + fret) % 12)) {
                possibilities[string].push(fret);
            }
        }   
    }

    let chords: number[][] = [];
    for (let index = 0; index < 12; index++) {
        let ch = recursivelyGetBlock(0, index, [[-1,-1,-1,-1,-1,-1]], possibilities);
        for(let c of ch) {
            chords.push(c);
        }
    }

    return chords.filter(c => validateChord(c, notes, tuning));
}

function validateChord(c: number[], chordNotes: number[], tuning:number[]) : boolean{
    let set:Set<number> = new Set();
    let chord:any = Object.values(c);
    for (let i = 0; i < chord.length; i++) {
        let index:number = chord[i];
        let note = (tuning[i] + index) % 12;
        set.add(note);
    }

    for (let index = 0; index < chordNotes.length; index++) {
        let chordNote = chordNotes[index];
        if (!set.has(chordNote)) {
            if (chordNotes.length === 3) {
                return false;
            } else if (index !== 2) {
                return false;
            }
        }
    }

    let bassCheck = false;
    let sum = 0;
    for (let i = 0; i < chord.length; i++) {
        let strindex:number = chord[i];
        if (strindex === -1) {
            sum++;
            if ((i > 1 && i !== 5) || (i === 1 && chord[0] !== -1)) {
                return false;
            } else if (!bassCheck) {
                if (chordNotes[i] === (tuning[i] + strindex) % 12) {
                    bassCheck = true;
                } else {
                    return false;//chord does not start on bass root note
                }
            }
        } 
    }

    return sum < 3
}

function recursivelyGetBlock(currentString: number, startFret: number, currentSet: number[][], possibilities: number[][]) : number[][] {
    if (currentString === 6) return currentSet;
    let currentPossibilities: number[] = []
    let currentStringNotes: number[] = possibilities[currentString];

    for (let index of currentStringNotes) {
        if (index > startFret + 3) break;
        if (index >= startFret || index <= 0) {
            currentPossibilities.push(index);
        }
    }

    let result: number[][] = [];
    for (let possibleIndex of currentPossibilities) {
        let next:number[][] = [];
        currentSet.forEach(e => next.push(Object.assign({}, e)));

        for(let i = 0; i < next.length; i++) {
            let chord:number[] = next[i];
            chord[currentString] = possibleIndex;
            next[i] = chord;
        }

        let nextResult = recursivelyGetBlock(currentString + 1, startFret, next, possibilities);
        nextResult.forEach(e => result.push(e));
    }

    return result;
}