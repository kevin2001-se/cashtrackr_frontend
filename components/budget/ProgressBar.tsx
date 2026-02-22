'use client'

import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import 'react-circular-progressbar/dist/styles.css';

type ProgressBar = {
    porcentaje: number;
}

export default function ProgressBar({porcentaje}: ProgressBar) {
    return (
        <div className="flex justify-center p-10">
            <CircularProgressbar 
                value={porcentaje}
                styles={buildStyles({
                    pathColor: porcentaje >= 100 ? '#DC2626' : '#F59E0B',
                    trailColor: '#E1E1E1',
                    textColor:  porcentaje >= 100 ? '#DC2626' : '#F59E0B',
                    textSize: 8
                })}
                text={`${porcentaje}% Gastado`}
            />
        </div>
    )
}
