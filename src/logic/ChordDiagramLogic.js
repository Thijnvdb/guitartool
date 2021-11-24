import { NOTES, STANDARD_TUNING } from "../constants";
import { getNoteOnString, getNotePositionOnString } from "../util/TheoryUtils";

//TODO:
//1. get possible fret positions
//2. combine fret positions in range of 4
//3. validate chords



export async function getDiagramsForChord(chord = { name: 'chord', notes: [] }, options = { allowInversion: true, maxMutedCount: 2, tuning: STANDARD_TUNING, mutedOnSidesOnly: true}) {
    let possibilities = getPossibleFretPositions(chord.notes, options.tuning);
    let chordVoicings = getPossibleCombinations(possibilities, chord, options);
    chordVoicings = multiDimensionalUnique(chordVoicings);

    let result = [];
    chordVoicings.forEach(voicing => {
        //change name if chord is an inversion
        let name = chord.name;

        let voicingRootString = 0;
        for (let index = 0; index < 6; index++) {
            if(voicing[index] !== -1) {
                voicingRootString = index;
                break;
            }
        }

        let voicingRoot = getNoteOnString(voicing[voicingRootString], voicingRootString, options.tuning);
        if(voicingRoot !== chord.notes[0])
            name += '/'+NOTES[voicingRoot].names[0];

        result.push(
            {
                name: name,
                fingering: voicing
            }
        )
    })

    return result;
}

//for each string, get the frets which contain notes of the chord
function getPossibleFretPositions(notes, tuning) {
    let possibilities = [[-1], [-1], [-1], [-1], [-1], [-1]];

    for (const note in notes) {
        if (Object.hasOwnProperty.call(notes, note)) {
            const n = notes[note];
            for (let index = 0; index < tuning.length; index++) {
                possibilities[index].push(getNotePositionOnString(n, index, tuning));
            }
        }
    }

    return possibilities;
}

function getPossibleCombinations(fretPossibilities, chord, options) {
    let diagrams = [];
    for (let fret = 0; fret < 9; fret++) {
        let diagramList = getPossibleCombinationRecursiveStep(fret, 0, [-1, -1, -1, -1, -1, -1], fretPossibilities);
        diagramList.forEach(e => diagrams.push(e));
    }

    //filter results
    diagrams = diagrams.filter(e => validateChord(e, chord, options));
    return diagrams;
}

//recursively construct all possible chords from the given possibilities
function getPossibleCombinationRecursiveStep(startFret, string, chordPositions, possibilities) {
    if (string > 5) {
        return [chordPositions]
    };
    //filter on blocks of 4 (THIS DOES NOT INCLUDE OPEN STRINGS)
    let nextPossiblePositions = possibilities[string].filter(f => f === -1 || (f >= startFret && f < startFret + 4));

    //enter recursive step for each next possibility
    let resultPosibilities = [];
    nextPossiblePositions.forEach(pos => {
        let next = [...chordPositions];
        next[string] = pos;
        let nextChords = getPossibleCombinationRecursiveStep(startFret, string + 1, next, possibilities);
        nextChords.forEach(e => {
            if(!resultPosibilities.includes(e))
                resultPosibilities.push(e);
        });
    })

    return resultPosibilities;
}

function validateChord(chordPositions, chord, options) {
    let chordNotes = [];
    let mutedCount = 0;
    chordPositions.forEach((e,i) => {
        if(e !== -1)
            chordNotes.push(getNoteOnString(e, i, options.tuning));
        else
            mutedCount++;
    })
    let missingNotes = [...chord.notes].filter(note => !chordNotes.includes(note));
    if(missingNotes.length > 0 || mutedCount > options.maxMutedCount) return false;
    if(!options.allowInversion && chordNotes[0] !== chord.notes[0]) return false;
    if(options.mutedOnSidesOnly) {
        let notMuted = [2,3,4];
        for (let index = 0; index < notMuted.length; index++) {
            if(chordPositions[notMuted[index]] === -1) {
                return false;
            }
        }
    }
    return true;
}

function multiDimensionalUnique(arr) {
    var uniques = [];
    var itemsFound = {};
    for(var i = 0, l = arr.length; i < l; i++) {
        var stringified = JSON.stringify(arr[i]);
        if(itemsFound[stringified]) { continue; }
        uniques.push(arr[i]);
        itemsFound[stringified] = true;
    }
    return uniques;
}