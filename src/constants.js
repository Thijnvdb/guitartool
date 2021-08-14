export const SCALE_FAMILIES = [
    {name:"Major", intervals:[2,2,1,2,2,2,1], modes:["Ionian (Major)", "Dorian", "Phrygian", "Lydian", "Mixolydian", "Aeolian (Natural Minor)", "Locrian"]},
    {name:"Melodic Minor", intervals:[2,1,2,2,2,2,1], modes:["Melodic Minor", "Dorian b2", "Lydian Aug.", "Lydian dom.", "Aeo. dom.", "Half diminished", "Alt."]},
    {name:"Harmonic Minor", intervals:[2,1,2,2,1,3,1], modes:["Harmonic Minor", "Locrian nat. 6", "Major #5", "Doroam #4", "Phrygian dom.", "Lydian #2", "Alt. dom. bb7"]},
    {name:"Harmonic Major", intervals:[2,2,1,2,1,3,1], modes:["Harmonic Major", "Dorian b5", "Phrygian b4", "Lydian b3", "Mixo. b2", "Lydian Augmented #2", "Locrian bb7"]},
    {name:"Diminished", intervals:[2,1,2,1,2,1,2,1], modes:["Diminished", "Inverted Diminished"]},
    {name:"Whole Tone", intervals:[2,2,2,2,2,2], modes:["Whole Tone"]},
    {name:"Augmented", intervals:[3,1,3,1,3,1], modes:["Augmented", "Inverted Augmented"]}
]

export const CHORD_TYPES = {
    triad:[0,2,4],
    seventh:[0,2,4,6],
    ninth:[0,2,4,6,8]
}

export const NOTES = [
    {names: ["A"]},
    {names: ["A#", "Bb"]},
    {names: ["B", "Cb"]},
    {names: ["C", "B#"]},
    {names: ["C#", "Db"]},
    {names: ["D"]},
    {names: ["D#", "Eb"]},
    {names: ["E", "Fb"]},
    {names: ["F", "E#"]},
    {names: ["F#", "Gb"]},
    {names: ["G"]},
    {names: ["G#", "Ab"]}
]

export const STANDARD_TUNING = [7, 0, 5, 10, 2, 7];