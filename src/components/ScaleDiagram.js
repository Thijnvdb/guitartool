import { NOTES, STANDARD_TUNING } from "../constants";

const fretsDisplayed = 13;
const margin = {top:30,bottom:30, left:10, right:10};
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
            lines.push(<line x1={margin.left + (i*fretheight)} x2={margin.left + (i*fretheight)} y1={margin.top} y2={margin.top + stringOffset * (stringCount - 1)} />)
        }
        
        for (let i = 0; i < stringCount; i++) {
            lines.push(<line x1={margin.left} x2={margin.left + fretsDisplayed*fretheight} y1={margin.top + i * stringOffset} y2={margin.top + i * stringOffset}/>)    
        }
        lines.push(<line className="nut" x1={margin.left} x2={margin.left} y1={margin.top - 2} y2={margin.top + (stringOffset * (stringCount - 1)) + 2} />);
        lines.push(<line className="halfnut" x1={margin.left + fretheight * 12} x2={margin.left + fretheight * 12} y1={margin.top - 2} y2={margin.top + (stringOffset * (stringCount - 1)) + 2} />);
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
                        dots.push(<circle r={circleRadius} cx={(margin.left - fretheight/2.8)} cy={margin.top + string * stringOffset} className={note === notes[0] ? "rootCircle" : "circle"}/>);
                        dots.push(<text className="subtext" x={(margin.left - fretheight/2.8)} y={margin.top + string * stringOffset + 3} textAnchor={"middle"}>{NOTES[note].names[0]}</text>);
                    } else {
                        dots.push(<circle r={circleRadius} cx={(margin.left + fret * fretheight - fretheight/2)} cy={margin.top + string * stringOffset} className={note === notes[0] ? "rootCircle" : "circle"}/>)
                        dots.push(<text className="subtext" x={(margin.left + fret * fretheight - fretheight/2)} y={margin.top + string * stringOffset + 3} textAnchor={"middle"}>{NOTES[note].names[0]}</text>);
                    }
                }
            }
            
        }
        return dots
    }

    function generateNumbers() {
        let numbers = [];
        const nums = [1,3,5,7,9,12];

        nums.forEach(n => {
            numbers.push(<text textAnchor={"middle"} x={margin.left + (fretheight * n) - fretheight/2} y={margin.top + stringOffset*6 + margin.bottom / 10} className="fretNumber">{n}</text>);
            
            if(n === 12) {
                numbers.push(<circle r={circleRadius/2} className="boardDot" cx={margin.left + (fretheight * n) - fretheight/2} cy={margin.top + stringOffset*1.5}></circle>)
                numbers.push(<circle r={circleRadius/2} className="boardDot" cx={margin.left + (fretheight * n) - fretheight/2} cy={margin.top + stringOffset*3.5}></circle>)
            } else {
                numbers.push(<circle r={circleRadius/2} className="boardDot" cx={margin.left + (fretheight * n) - fretheight/2} cy={margin.top + stringOffset*2.5}></circle>)
            }
        })

        return numbers;
    }

    return <svg viewBox={"0 0 "+(margin.left + (fretheight * fretsDisplayed) + margin.right)+" "+(margin.top + (stringOffset * (stringCount - 1)) + margin.bottom)}  /* width={margin.left + (fretheight * fretsDisplayed) + margin.right} height={margin.top + (stringOffset * (stringCount - 1)) + margin.bottom} */>
        {/* <rect width={margin.left+fretheight * fretsDisplayed+margin.right} height={margin.top+stringOffset * (stringCount - 1)+margin.bottom}  style={{fill:"#888"}}/> */}
        <rect y={margin.top} x={margin.left} width={fretheight * fretsDisplayed} height={stringOffset * (stringCount - 1)}  class="background"/>
        {numbers}
        {lines}
        {dots}
    </svg>
}