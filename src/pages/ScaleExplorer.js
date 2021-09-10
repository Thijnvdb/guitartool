import { useEffect, useState } from "react"
import { CHORD_TYPES, NOTES, progressions, romanNumerals, SCALE_FAMILIES, STANDARD_TUNING } from "../constants";
import { Scale } from "../objects/Scale";
import "../stylesheets/explorer.scss";
import ScaleDiagram from "../components/ScaleDiagram";

export default function ScaleExplorer() {
    const [scale, setScale] = useState();
    const [family, setFamily] = useState(SCALE_FAMILIES[0]);
    const [root, setRoot] = useState(0);
    const [mode, setMode] = useState(0);
    const [ommits, setOmmits] = useState([]);

    const [triads, setTriads] = useState([]);
    const [sevenths, setSevenths] = useState([]);
    const [ninths, setNinths] = useState([]);
    const [degrees, setDegrees] = useState(family.chordTypes);

    useEffect(()=> {
        let s = new Scale(root, family, mode);
        setScale(s);

        let deg = [...family.chordTypes];
        for (let i = 0; i < mode; i++) {
            const element = deg.shift();
            deg.push(element);
        }
        setDegrees(deg);
    }, [family, root, mode])

    useEffect(()=> {
        if(scale) {
            setTriads(scale.getChordsOfType(CHORD_TYPES.triad));
            setSevenths(scale.getChordsOfType(CHORD_TYPES.seventh));
            setNinths(scale.getChordsOfType(CHORD_TYPES.ninth));
        }
    }, [scale])

    function toggleOmmit(n) {
        let o = [...ommits];
        let i = o.indexOf(n);
        if (i === -1) {
            o.push(n);
        } else {
            o.splice(i,1);
        }
        setOmmits(o);
    }

    return <div className="page">
        <div className="explorer">
            <div className="input">
                <label>
                    Root: <br/>
                    <select defaultValue={0} onChange={e=>setRoot(e.target.value)}>
                        {
                            NOTES.map((note, i) => <option key={i+"n"} value={i}>{note.names[0]}</option>)
                        }
                    </select>
                </label>
                {/* <label>
                    Scale Type:<br/> 
                    <select onChange={e=>setFamily(SCALE_FAMILIES[e.target.value])}>
                        {
                            SCALE_FAMILIES.map((fam, i) => <option key={i+"f"} value={i} selected={family.name === fam.name ? "selected":null}>{fam.name}</option>)
                        }
                    </select>
                </label> */}
                <label>
                    Mode:<br/> 
                    <select defaultValue={0} onChange={e=>setMode(e.target.value)}>
                        {
                            family?.modes?.map((mode, i) => <option key={i+"m"} value={i} >{mode}</option>)
                        }
                    </select>
                </label>
            </div>
            <div className="scaleNotes">
                {
                    scale?.notes?.map((n, i) => 
                        <span key={"ommit"+i}className={ommits.includes(i) ? "ommit" : ""} onClick={()=>toggleOmmit(i)}>
                            {NOTES[n].names[0]} 
                            <h3 className={"scaleDegree " + degrees[i]}>{romanNumerals[i % (scale.notes.length - 1)]}</h3>
                        </span>)
                }
            </div>
            <div className="scaleDiagram">
                {scale && <ScaleDiagram tuning={STANDARD_TUNING} ommits={ommits} notes={scale.notes}/>}
            </div>
            <div className="progressions">
                <h1>Progressions</h1>
                <div className="grid">
                    {
                            progressions.map(p => 
                                <div className="progression">
                                    {
                                        p.map(c => 
                                            <span>
                                                <h2>{triads[c]?.name}</h2>
                                                <h3 className={"scaleDegree "+degrees[c]}>{romanNumerals[c]}</h3>
                                            </span>    
                                        )
                                    }
                                </div>    
                            )
                        }
                </div>
            </div>
            <div className="chords">
                <div className="repeater">
                    <h3>Triads</h3>
                    <div className="chordelements">
                        {
                            triads?.map((e,i) => ommits.includes(i) ? <></> : <span className="chord" key={i+"b3"} /* onClick={()=>getDiagrams(e)} */>
                                <h4 className={"scaleDegree " + degrees[i]}>{romanNumerals[i]}</h4>
                                {e.name}
                                <span className="notes">{e.notes.map((n,j) => 
                                    <span key={j+"3"+i} className="note">
                                        {NOTES[n].names[0]}
                                    </span>)}
                                </span>
                            </span>)
                        }        
                    </div>
                </div>
                <div className="repeater">
                    <h3>Sevenths</h3>
                    <div className="chordelements">
                        {
                            sevenths?.map((e,i) => ommits.includes(i) ? <></> : <span className="chord" key={i+"b7"} /* onClick={()=>getDiagrams(e)} */>
                                <h4 className={"scaleDegree " + degrees[i]}>{romanNumerals[i]}7</h4>
                                {e.name}
                                <span className="notes">{e.notes.map((n,j) => 
                                    <span key={j+"7"+i} className="note">
                                        {NOTES[n].names[0]}
                                    </span>)}
                                </span>
                            </span>)
                        }
                    </div>
                </div>
                <div className="repeater">
                    <h3>Ninths</h3>
                    <div className="chordelements">
                        {
                            ninths?.map((e,i) => ommits.includes(i) ? <></> : <span className="chord" key={i+"b9"} /* onClick={()=>getDiagrams(e)} */>
                                <h4 className={"scaleDegree " + degrees[i]}>{romanNumerals[i]}9</h4>
                                {e.name}
                                <span className="notes">{e.notes.map((n,j) => 
                                    <span key={j+"9"+i} className="note">
                                        {NOTES[n].names[0]}
                                    </span>)}
                                </span>
                            </span>)
                        }        
                    </div>
                </div>
            </div>
        </div>
    </div>
}