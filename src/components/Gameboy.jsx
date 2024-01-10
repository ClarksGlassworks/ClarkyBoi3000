import React from 'react';
import Viewport from './Viewport.jsx';

const Gameboy = ({ isOn, setIsOn }) => {
  return (
    <div id="gameboy">
      <div id="top">
        <div id="bezel">
          <div id="inner-screen">{isOn ? <Viewport /> : null}</div>
        </div>
      </div>
      <div id="bottom">
        <div id="controls-top">
          <div id="dpad">
            <div className="dpad-group">
              <div className="dpad-square"></div>
              <div className="dpad-square"></div>
            </div>
            <div className="dpad-group">
              <div className="dpad-square"></div>
              <div className="dpad-square"></div>
            </div>
          </div>
          <div id="buttons">
            <div className="button" style={{ marginTop: '2em' }}>
              <div className="button-text">B</div>
            </div>
            <div className="button">
              <div className="button-text">A</div>
            </div>
          </div>
        </div>
        <div id="controls-bottom">
          <div id="bottom-button-group">
            <div className="bottom-button">
              <div className="bottom-text">SELECT</div>
            </div>
            <div className="bottom-button" onClick={() => setIsOn(!isOn)}>
              <div className="bottom-text">START</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Gameboy;
