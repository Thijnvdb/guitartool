import { STANDARD_TUNING } from "../constants";
import { getNoteOnString } from "../util/TheoryUtils";

const BLOCK_SIZE = 3;

export async function getDiagramsForChord(
    chord: { name: any; notes: number[]}, 
    tuning: number[], 
    options:{
        allowInversions: boolean,
        mutedMustBeConnected: boolean,
        maxMutedCount:number,
        mutedNotInCenter:boolean
    } = {allowInversions:false,mutedMustBeConnected:true, maxMutedCount:3, mutedNotInCenter:true}) 
    : Promise<{name:string, fingering: Array<number>}[]> {
    const possibleIndices = getFretBoardPositionsOfChord(chord.notes, tuning);

    let fingerings : number[][] = [];
    for (let i = 0; i < (12 - BLOCK_SIZE); i++) {
        const set: Set<number[]> = new Set();
        set.add([-1,-1,-1,-1,-1,-1])
        const fings = recursivelyGetBlock(0, i, set, possibleIndices);
        // eslint-disable-next-line no-loop-func
        fings.forEach(element => {
            fingerings.push(element);
        });
    }

    fingerings = removeDuplicates(fingerings);
    fingerings = fingerings.filter(e => validateFingering(e, tuning, chord.notes, options));

    let result:{name:string, fingering: Array<number>}[] = [];
    fingerings.forEach(e => {
        result.push({name:chord.name, fingering: e});
    })

    return result;
}

function removeDuplicates(array: number[][]): number[][] {
    let res : number[][] = [];
    let set : Set<string> = new Set();

    for(let val of array) {
        const v = Object.values(val);

        let str = "";
        v.forEach(e=>str += e);

        if(!set.has(str)) {
            set.add(str);
            res.push(v);
        }
    }

    return res;
}

function getFretBoardPositionsOfChord(notes : number[], tuning : number[] = STANDARD_TUNING) : number[][] {
    let possibleIndicesPerString : number[][] = [];
    tuning.forEach(e=>possibleIndicesPerString.push([-1]));

    //check all frets
    for (let fret = 0; fret < 12; fret++) {
        //check all strings
        for (let string = 0; string < tuning.length; string++) {
            const note = getNoteOnString(fret, string, tuning);
            if (notes.includes(note)) {
                possibleIndicesPerString[string].push(fret);
            }
        }
    }

    return possibleIndicesPerString;
}

function recursivelyGetBlock(currentString: number, startFret: number, currentSet: Set<number[]>, possibilities: number[][]) : Set<number[]> {
    if (currentString === 6) return currentSet;
    let currentPossibilities: number[] = [];
    let currentStringNotes: number[] = possibilities[currentString];

    for (let index of currentStringNotes) {
        if ((index >= startFret && index - startFret < BLOCK_SIZE) || index <= 0) {
            currentPossibilities.push(index);
        }
    }

    let result: Set<number[]> = new Set();
    for (let possibleIndex of currentPossibilities) {
        let next:Set<number[]> = new Set();
        currentSet.forEach(e => {
            let clone = {...e};
            next.add(clone);
        });

        next.forEach(entry => {
            entry[currentString] = possibleIndex;
        })

        let nextResult = recursivelyGetBlock(currentString + 1, startFret, next, possibilities);
        nextResult.forEach(e => result.add(e));
    }

    return result;
}

function validateFingering(fingering : number[], tuning:number[], chordNotes:number[], options:{allowInversions: boolean, mutedMustBeConnected: boolean, maxMutedCount:number, mutedNotInCenter:boolean}) : boolean {
    const fingers = Object.values(fingering);
    let muted = 0;
    let bassFound = false;
    let bassIsRoot = false;
    let mutedAreConnected = true;
    let allNotes:number[] = [];
    for(let i = 0; i < fingers.length; i++) {
        const note = getNoteOnString(fingers[i], i, tuning);
        allNotes.push(note);
        if(fingers[i] === -1) {
            if ([2,3,4].includes(i) && options.mutedNotInCenter) {
                return false;
            }
            if(muted > 0) {
                //check if muted string is connected to other muted strings
                let left = fingers[i - 1];
                let right = i === fingers.length - 1 ? 0 : fingers[i + 1];
                mutedAreConnected = left === -1 || right === -1;
            }
            muted += 1;
        } else if(!bassFound) {
            bassFound = true;
            if(note === chordNotes[0]) {
                bassIsRoot = true;
            }
        }
    }

    //check if all notes are present in the current chord
    chordNotes.forEach(n => {
        if(!allNotes.includes(n)) {
            return false;
        }
    })


    return (muted <= options.maxMutedCount) && (options.allowInversions || bassIsRoot) && (mutedAreConnected || !options.mutedMustBeConnected);
}