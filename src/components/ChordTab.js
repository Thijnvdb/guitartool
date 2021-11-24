import {useContext} from 'react'
import { NOTES, romanNumerals } from "../constants";
import { getDiagramsForChord } from '../logic/ChordDiagramLogic';
import { ScaleContext } from "../pages/ScaleExplorer";
import ChordDiagram from './ChordDiagram';
import Diagram from './ChordDiagram';
import { PopupContext } from './PopupContext';

export default function ChordTab() {
    const state = useContext(ScaleContext);
    const popupContext = useContext(PopupContext);

    async function getDiagrams(chord) {
        let diagrams = await getDiagramsForChord(chord);
        console.log(diagrams);

        popupContext.createPopup(
            <div className="center">
                {
                    diagrams.map((d,i) => <ChordDiagram key={"d"+i} k={"dia"+i} data={d}/>)
                }
            </div>
        );
    }

    return (
    <div className="chords tab">
        <div className="repeater">
            <h3>Triads</h3>
            <div className="chordelements">
                {
                    state.triads?.map((e, i) => state.ommits.includes(i) ? <></> : <span className="chord" key={i + "b3"} onClick={()=>getDiagrams(e)}>
                        <h4 className={"scaleDegree " + state.degrees[i]}>{romanNumerals[i]}</h4>
                        {e.name}
                        <span className="notes">{e.notes.map((n, j) =>
                            <span key={j + "3" + i} className="note">
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
                    state.sevenths?.map((e, i) => state.ommits.includes(i) ? <></> : <span className="chord" key={i + "b7"} onClick={()=>getDiagrams(e)}>
                        <h4 className={"scaleDegree " + state.degrees[i]}>{romanNumerals[i]}7</h4>
                        {e.name}
                        <span className="notes">{e.notes.map((n, j) =>
                            <span key={j + "7" + i} className="note">
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
                    state.ninths?.map((e, i) => state.ommits.includes(i) ? <></> : <span className="chord" key={i + "b9"} onClick={()=>getDiagrams(e)}>
                        <h4 className={"scaleDegree " + state.degrees[i]}>{romanNumerals[i]}9</h4>
                        {e.name}
                        <span className="notes">{e.notes.map((n, j) =>
                            <span key={j + "9" + i} className="note">
                                {NOTES[n].names[0]}
                            </span>)}
                        </span>
                    </span>)
                }
            </div>
        </div>
    </div>)
}