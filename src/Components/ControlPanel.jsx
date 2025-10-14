import React from "react";
import './ControlPanel.css'
import { VscDebugStart } from "react-icons/vsc";
import { VscDebugRestart } from "react-icons/vsc";
import { LuPause } from "react-icons/lu";
import { GrResume } from "react-icons/gr";

function ControlPanel({ Start, Pause, Reboot, paused, size, setSize }) {
  return (
    <div className="control-panel">
      <h2>Control Panel</h2>
      <div className="actions">
        Sizes:&nbsp;
        <select value={size} title="Elegir tamaño" onChange={(e) => setSize(Number(e.target.value))}>
          <option value={4}>4x4</option>
          <option value={5}>5x5</option>
          <option value={6}>6x6</option>
          <option value={7}>7x7</option>
        </select>
        <div className="buttons">
          <button onClick={Start} title="Iniciar">
            <VscDebugStart />
          </button>
          <button onClick={Reboot} title="Reiniciar">
            <VscDebugRestart />
          </button>
          <button onClick={Pause} title={paused ? "Reanudar" : "Pausar"}>
            {paused ? <GrResume /> : <LuPause />}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ControlPanel