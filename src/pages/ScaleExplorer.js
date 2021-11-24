import { useEffect, useState, createContext, useContext } from "react"
import { CHORD_TYPES, NOTES, progressions, romanNumerals, SCALE_FAMILIES, STANDARD_TUNING } from "../constants";
import { Scale } from "../objects/Scale";
import "../stylesheets/explorer.scss";
import ScaleDiagram from "../components/ScaleDiagram";
import ChordTab from "../components/ChordTab";
import ProgressionsTab from "../components/ProgressionsTab";
import { PopupContext } from "../components/PopupContext";

export const ScaleContext = createContext(null);
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

    const tabs = [
        { name: "Chords", content: <ChordTab /> },
        { name: "Progressions", content: <ProgressionsTab /> }
    ]
    const [tab, setTab] = useState(tabs[0].content);

    const popupContext = useContext(PopupContext);

    useEffect(() => {
        let s = new Scale(root, family, mode);
        setScale(s);

        let deg = [...family.chordTypes];
        for (let i = 0; i < mode; i++) {
            const element = deg.shift();
            deg.push(element);
        }
        setDegrees(deg);
    }, [family, root, mode])

    useEffect(() => {
        if (scale) {
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
            o.splice(i, 1);
        }
        setOmmits(o);
    }

    return (
        <div className="page">
            {popupContext.popup}
            <div className="explorer">
                <div className="input">
                    <label>
                        Root: <br />
                        <select defaultValue={0} onChange={e => setRoot(e.target.value)}>
                            {
                                NOTES.map((note, i) => <option key={i + "n"} value={i}>{note.names[0]}</option>)
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
                        Mode:<br />
                        <select defaultValue={0} onChange={e => setMode(e.target.value)}>
                            {
                                family?.modes?.map((mode, i) => <option key={i + "m"} value={i} >{mode}</option>)
                            }
                        </select>
                    </label>
                </div>
                <div className="scaleNotes">
                    {
                        scale?.notes?.map((n, i) =>
                            <span key={"ommit" + i} className={ommits.includes(i) ? "ommit" : ""} onClick={() => toggleOmmit(i)}>
                                {NOTES[n].names[0]}
                                <h3 className={"scaleDegree " + degrees[i]}>{romanNumerals[i % (scale.notes.length - 1)]}</h3>
                            </span>)
                    }
                </div>
                <div className="scaleDiagram">
                    {scale && <ScaleDiagram tuning={STANDARD_TUNING} ommits={ommits} notes={scale.notes} />}
                </div>
                <div className="tabselect">
                    {
                        tabs.map((tab, index) => <button onClick={() => { setTab(tabs[index].content) }}>{tab.name}</button>)
                    }
                </div>
                <div className="tabs">
                    {/* TODO: shorten this if possible */}
                    <ScaleContext.Provider value={
                        {
                            scale: scale,
                            setScale: setScale,
                            family: family,
                            setFamily: setFamily,
                            root: root,
                            setRoot: setRoot,
                            mode: mode,
                            setMode: setMode,
                            ommits: ommits,
                            setOmmits: setOmmits,
                            triads: triads,
                            setTriads: setTriads,
                            sevenths: sevenths,
                            setSevenths: setSevenths,
                            ninths: ninths,
                            setNinths: setNinths,
                            degrees: degrees,
                            setDegrees: setDegrees,
                        }
                    }>
                        {tab}
                    </ScaleContext.Provider>
                </div>
            </div>
        </div>)
}