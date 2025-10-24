import React, {useState} from "react";
import './Instructions.css'
import { VscDebugStart } from "react-icons/vsc";
import { BsSkipForward } from "react-icons/bs";
import { VscDebugRestart } from "react-icons/vsc";
import { LuPause } from "react-icons/lu";
import { GrResume } from "react-icons/gr";

function Instructions() {
    const [lang, setLang] = useState('en');

    const instructions = {
        es: [
            <>Seleccione la casilla en la que desea iniciar</>,
            <>Presiona <VscDebugStart /> para iniciar el Knight's Tour</>,
            <>Presiona <BsSkipForward /> para saltar al resultado final</>,
            <>Presiona <LuPause /> para pausar el recorrido</>,
            <>Presiona <GrResume /> para reanudar el recorrido</>,
            <>Presiona <VscDebugRestart /> para reiniciar el tablero</>,
            <>Seleccione el tamaño del tablero en el control panel</>,
            <>Seleccione modo de ejecución en el control panel</>,
            <>Observa las estadísticas a la derecha</>
            
        ],
        en: [
            <>Select the box you want to start</>,
            <>Press <VscDebugStart /> to start the Knight's Tour</>,
            <>Press <BsSkipForward /> to skip to the final result</>,
            <>Press <LuPause /> to pause execution.</>,
            <>Press <GrResume /> to resume execution.</>,
            <>Press <VscDebugRestart /> to reset the board</>,
            <>Select the board size in the control panel</>,
            <>Select the execution mode in the control panel</>,
            <>Check the statistics on the right</> 
        ]
    };

    return (
        <div className="instructions-box">
            <button
                className="lang-switch"
                onClick={() => setLang(lang === 'es' ? 'en' : 'es')}
                title="Cambiar idioma/Change language"
            >
                {lang === 'es' ? 'EN' : 'ES'}
            </button>
            <h2>{lang === 'es' ? 'Instrucciones de uso' : 'Instructions for use'}</h2>
            <ul>
                {instructions[lang].map((text, idx) => (
                    <li key={idx}>{text}</li>
                ))}
            </ul>
        </div>
    );
}

export default Instructions;