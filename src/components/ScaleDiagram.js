import { NOTES, STANDARD_TUNING } from "../constants";

const fretsDisplayed = 13;
const margin = {top:50,bottom:50, left:50, right:50};
const fretheight = 46;
const stringCount = 6;
const stringOffset = 25;
const circleRadius = 12;

const title = {
    fontWeight:500
}

const circle = {
    fill:"#212121"
}

const rootCircle = {
    fill:"#E75915"
}

const subtext = {
    fontWeight:500,
    fill:"#fff"
}

const line = {
    stroke:"#333333",
    strokeWidth:2
}

const nut = {
    stroke:"#000000",
    strokeWidth:7
}

const halfnut = {
    stroke:"#323232",
    strokeWidth:4
}

export default function ScaleDiagram({notes, ommits, tuning = STANDARD_TUNING}) {
    const lines = generateLines();
    const dots = generateDots();
    const numbers = generateNumbers();


    function generateLines() {
        let lines = [];
        for (let i = 1; i < fretsDisplayed + 1; i++) {
            lines.push(<line style={line} x1={margin.left + (i*fretheight)} x2={margin.left + (i*fretheight)} y1={margin.top} y2={margin.top + stringOffset * (stringCount - 1)} />)
        }
        
        for (let i = 0; i < stringCount; i++) {
            lines.push(<line style={line} x1={margin.left} x2={margin.left + fretsDisplayed*fretheight} y1={margin.top + i * stringOffset} y2={margin.top + i * stringOffset}/>)    
        }
        lines.push(<line style={nut} x1={margin.left} x2={margin.left} y1={margin.top - 2} y2={margin.top + (stringOffset * (stringCount - 1)) + 2} />);
        lines.push(<line style={halfnut} x1={margin.left + fretheight * 12} x2={margin.left + fretheight * 12} y1={margin.top - 2} y2={margin.top + (stringOffset * (stringCount - 1)) + 2} />);
        return lines;
    }

    function generateDots() {
        if(!tuning || !notes) return [];
        let dots = [];
        for (let string = 0; string < stringCount; string++) {
            const base = tuning[(stringCount - 1) - string];
            for (let fret = 0; fret < fretsDisplayed; fret++) {
                let note = (base + fret) % 12;
                if (notes.includes(note) && !ommits.includes(notes.indexOf(note))) {
                    if (fret === 0) {
                        dots.push(<circle r={circleRadius} cx={(margin.left - fretheight/2.8)} cy={margin.top + string * stringOffset} style={note === notes[0] ? rootCircle : circle}/>);
                        dots.push(<text x={(margin.left - fretheight/2.8)} y={margin.top + string * stringOffset + 5} textAnchor={"middle"} style={subtext}>{NOTES[note].names[0]}</text>);
                    } else {
                        dots.push(<circle r={circleRadius} cx={(margin.left + fret * fretheight - fretheight/2)} cy={margin.top + string * stringOffset} style={note === notes[0] ? rootCircle : circle}/>)
                        dots.push(<text x={(margin.left + fret * fretheight - fretheight/2)} y={margin.top + string * stringOffset + 5} textAnchor={"middle"} style={subtext}>{NOTES[note].names[0]}</text>);
                    }
                }
            }
            
        }
        return dots
    }

    function generateNumbers() {
        let numbers = [];
        const nums = [3,5,7,9,12];

        nums.forEach(n => {
            numbers.push(<text textAnchor={"middle"} x={margin.left + (fretheight * n) - fretheight/2} y={margin.top / 2} >{n}</text>);
        })

        return numbers;
    }

    return <svg viewBox={"0 0 "+(margin.left + (fretheight * fretsDisplayed) + margin.right)+" "+(margin.top + (stringOffset * (stringCount - 1)) + margin.bottom)}  /* width={margin.left + (fretheight * fretsDisplayed) + margin.right} height={margin.top + (stringOffset * (stringCount - 1)) + margin.bottom} */>
        {/* <rect width={margin.left+fretheight * fretsDisplayed+margin.right} height={margin.top+stringOffset * (stringCount - 1)+margin.bottom}  style={{fill:"#888"}}/> */}
        <rect y={margin.top} x={margin.left} width={fretheight * fretsDisplayed} height={stringOffset * (stringCount - 1)}  style={{fill:"#fff"}}/>
        {lines}
        {dots}
        {numbers}
    </svg>
}