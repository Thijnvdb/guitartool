import { useEffect, useState } from "react"
import { CHORD_TYPES, NOTES, SCALE_FAMILIES, STANDARD_TUNING } from "../constants";
import { Scale } from "../objects/Scale";
import "../stylesheets/explorer.scss";
import Diagram from "../components/Diagram";
import ScaleDiagram from "../components/ScaleDiagram";
import { getDiagramsForChord } from "../logic/ChordDiagramLogic";

const presets = [
    {name:"Minor Pentatonic", family:SCALE_FAMILIES[0], mode:5, ommits:[1,5]}
]

export default function ScaleExplorer() {
    const [scale, setScale] = useState();
    const [family, setFamily] = useState(SCALE_FAMILIES[0]);
    const [root, setRoot] = useState(0);
    const [mode, setMode] = useState(0);
    const [ommits, setOmmits] = useState([]);
    const [notesWithOmmits, setNotesWithOmmits] = useState([])

    const [triads, setTriads] = useState([]);
    const [sevenths, setSevenths] = useState([]);
    const [ninths, setNinths] = useState([]);

    const [diagrams, setDiagrams] = useState([]);

    useEffect(()=> {
        updateScale();
    }, [family, root, mode])

    useEffect(()=> {
        if(scale) {
            setTriads(scale.getChordsOfType(CHORD_TYPES.triad));
            setSevenths(scale.getChordsOfType(CHORD_TYPES.seventh));
            setNinths(scale.getChordsOfType(CHORD_TYPES.ninth));
        }
    }, [scale])

    function updateScale() {
        let s = new Scale(root, family, mode);
        setScale(s);
    }

    function toggleOmmit(n) {
        let o = [...ommits];
        let i = o.indexOf(n);
        if (i === -1) {
            o.push(n);
        } else {
            o.splice(i,1);
        }
        setOmmits(o);
        console.log(ommits);
    }

    async function getDiagrams(chord) {
        const d = await getDiagramsForChord(chord);
        console.log("diagrams:", d);
        setDiagrams(d);
    }

    function applyPreset(preset) {
        if (preset.family) setFamily(preset.family);
        if (preset.mode) setMode(preset.mode);
        if (preset.ommits) setOmmits(preset.ommits);
    }

    return <div className="page">
        <div className="explorer">
            <div className="input">
                <label>
                    Root: <br/>
                    <select onChange={e=>setRoot(e.target.value)}>
                        {
                            NOTES.map((note, i) => <option key={i+"n"} value={i} selected={root === i ? "selected":null}>{note.names[0]}</option>)
                        }
                    </select>
                </label>
                <label>
                    Scale Type:<br/> 
                    <select onChange={e=>setFamily(SCALE_FAMILIES[e.target.value])}>
                        {
                            SCALE_FAMILIES.map((fam, i) => <option key={i+"f"} value={i} selected={family.name === fam.name ? "selected":null}>{fam.name}</option>)
                        }
                    </select>
                </label>
                <label>
                    Scale Type:<br/> 
                    <select onChange={e=>setMode(e.target.value)}>
                        {
                            family?.modes?.map((mode, i) => <option key={i+"m"} value={i} selected={mode === i ? "selected" : null}>{mode}</option>)
                        }
                    </select>
                </label>
            </div>
            <div className="scaleNotes">
                {
                    scale?.notes?.map((n, i) => <span key={"ommit"+i}className={ommits.includes(i) ? "ommit" : ""} onClick={()=>toggleOmmit(i)}>{NOTES[n].names[0]} <h3>{i}</h3></span>)
                }
            </div>
            <div className="chords">
                <h1>Triads</h1>
                <div className="repeater">
                {
                    triads?.map((e,i) => ommits.includes(i) ? <></> : <button key={i+"b3"} onClick={()=>getDiagrams(e)}>
                        {e.name}
                        <span className="notes">{e.notes.map((n,j) => <span key={j+"3"+i} className="note">{NOTES[n].names[0]}</span>)}</span>
                    </button>)
                }
                </div>
                <h1>Sevenths</h1>
                <div className="repeater">
                {
                    sevenths?.map((e,i) => ommits.includes(i) ? <></> : <button key={i+"b7"} onClick={()=>getDiagrams(e)}>
                        {e.name}
                        <span className="notes">{e.notes.map((n,j) => <span key={j+"7"+i} className="note">{NOTES[n].names[0]}</span>)}</span>
                    </button>)
                }
                </div>
                <h1>Ninths</h1>
                <div className="repeater">
                {
                    ninths?.map((e,i) => ommits.includes(i) ? <></> : <button key={i+"b9"} onClick={()=>getDiagrams(e)}>
                        {e.name}
                        <span className="notes">{e.notes.map((n,j) => <span key={j+"9"+i} className="note">{NOTES[n].names[0]}</span>)}</span>
                    </button>)
                }
                </div>
            </div>
            <div className="presets">
                <h1>Presets</h1>
                {
                    presets.map(preset => 
                        <button onClick={()=>applyPreset(preset)}>{preset.name}</button>    
                    )
                }
            </div>
            <div className="diagrams">
               {diagrams.map((e,i)=> <Diagram k={i+"di"} data={e}/>)}
            </div>
            <div className="scaleDiagram">
                {scale && <ScaleDiagram tuning={STANDARD_TUNING} ommits={ommits} notes={scale.notes}/>}
            </div>
        </div>
    </div>
}