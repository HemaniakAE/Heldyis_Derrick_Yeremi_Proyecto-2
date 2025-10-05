import React from "react";
import './Instructions.css'
import { VscDebugStart } from "react-icons/vsc";
import { VscDebugRestart } from "react-icons/vsc";
import { LuPause } from "react-icons/lu";
import { GrResume } from "react-icons/gr";

function Instructions() {
    return (
        <div className="instructions-box">
            <h2>Instructions for use</h2>
            <ul>
                <li>Seleccione la casilla en la que desea iniciar</li>
                <li>Presione <VscDebugStart /> para iniciar el Knight's Tour</li>
                <li>Presione <VscDebugRestart /> para reiniciar el Knight's Tour</li>
                <li>Presione <LuPause /> para detener el Knight's Tour</li>
                <li>Presione <GrResume /> para reanudar el recorrido</li>
                <li>Observe las estradísticas a la derecha</li>
            </ul>
        </div>
    );
}

export default Instructions