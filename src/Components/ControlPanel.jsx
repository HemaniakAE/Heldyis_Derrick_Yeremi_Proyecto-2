import React from "react";
import './ControlPanel.css'
import { VscDebugStart } from "react-icons/vsc";
import { VscDebugRestart } from "react-icons/vsc";
import { LuPause } from "react-icons/lu";
import { GrResume } from "react-icons/gr";

function ControlPanel({ Start, Pause, Reboot, paused}) {
    return (
        <div className="control-panel">
            <h2>Control Panel</h2>
            <button onClick={Start}><VscDebugStart /></button>
            <button onClick={Reboot}><VscDebugRestart /></button>
            <button onClick={Pause}>
                {paused ? <GrResume /> : <LuPause />}
            </button>
        </div>
    );
}

export default ControlPanel