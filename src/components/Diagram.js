import React from "react";
const margin = {top:70,bottom:10, left:50, right:50};
const fretsDisplayed = 4;
const fretHeight = 46; 
const stringCount = 6;
const stringOffset = 30;
const circleRadius = 12;

const title = {
    fontWeight:500
}

const subtext = {
    fontWeight:500,
    /* fill:"#323232" */
}

const line = {
    /* stroke:"#000000", */
    strokeWidth:2
}

const nut = {
    /* stroke:"#000000", */
    strokeWidth:3
}

const circle = {
    /* fill:"#212121" */
}

export default function Diagram(props) {
    const chordData = props.data;
    if(!chordData || !chordData.fingering) return "";

    chordData.fingering = Object.values(chordData.fingering)

    function _generateLines() {
        let lines = [];
        for (let i = 0; i < stringCount; i++) {
            let x = margin.left + i * stringOffset;
            lines.push(<line x1={x} x2={x} y1={margin.top} y2={margin.top + (fretHeight*fretsDisplayed)} style={line}/>)
        }
        return lines;
    }

    function _generateFrets() {
        let frets = [];
        for (let index = 1; index <= fretsDisplayed; index++) {
            frets.push(<line x1={margin.left} x2={margin.left + stringOffset*(stringCount - 1)} y1={margin.top + index*fretHeight} y2={margin.top + index*fretHeight} style={line}/>)
        }
        return frets;
    }

    function _generateChordDisplay(chord, nutLocation = 0) {
        let data = [];
        if(nutLocation !== 0) {
            //add fret # next t highest finger
            data.push(<text style={subtext} x={margin.left + stringOffset*5.7} y={margin.top + fretHeight/1.66}>{nutLocation + 1}</text>)
        }
        for (let i = 0; i < stringCount; i++) {
            let position = chord.fingering[i] - nutLocation;

            if(position >= 1) {
                data.push(<circle r={circleRadius} cx={(margin.left + i * stringOffset)} cy={margin.top + position * fretHeight - fretHeight/2} style={circle}/>)
            } else {
                let symbol = position === -1 ? "x" : "o";
                data.push(<text width={12} height={14} x={i * stringOffset + margin.left} y={margin.top - 14}/*  fill={"#000000"} */ textAnchor="middle" style={title}>{symbol}</text>)
            }
        }

        return data;
    }

    let lines = _generateLines();
    let frets = _generateFrets();
    let lowestString = 24;
    let highestString = -1;
    chordData.fingering.forEach(e => {
        if (e < lowestString && e > 0) lowestString = e;
        if (e > highestString) highestString = e;
    })

    const diff = highestString - lowestString;
    const nutLocation = lowestString + diff < 4 ? 0 : lowestString - 1; 
    
    let fingerPlacement = _generateChordDisplay(chordData, nutLocation);

    return (<svg className="diagram" viewBox={"0 0 "+((stringOffset*(stringCount-1)) + margin.left + margin.right)+" "+((fretHeight*fretsDisplayed) + margin.top + margin.bottom)}>
        <text className="name" x={((stringOffset*(stringCount-1)) + margin.left + margin.right)/2} y={margin.top / 2} textAnchor="middle" style={title}>{chordData.name}</text>
        <line x1={margin.left - 5} x2={margin.left + stringOffset*(stringCount - 1) + 5} y1={margin.top} y2={margin.top} style={nut}/>
        {lines}
        {frets}
        {fingerPlacement}
    </svg>)
}