import {useContext} from 'react'
import { ScaleContext } from '../pages/ScaleExplorer'
import { progressions, romanNumerals } from "../constants";

export default function ProgressionsTab() {
    const state = useContext(ScaleContext);

    return (
        <div className="progressions tab">
            <h1>Progressions</h1>
            <div className="grid">
                {
                    progressions.map((p,i) => 
                        <div key={p+i}className="progression">
                            {
                                p.map((c,j) => 
                                    <span key={"c"+j}>
                                        <h2>{state?.triads[c]?.name}</h2>
                                        <h3 className={"scaleDegree "+state?.degrees[c]}>{romanNumerals[c]}</h3>
                                    </span>    
                                )
                            }
                        </div>    
                    )
                }
            </div>
        </div>
    )
}