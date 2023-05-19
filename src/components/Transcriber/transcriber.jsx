/* eslint-disable react/prop-types */
import React from "react";

const Transcriber = (props) => {

  return (
    <React.Fragment>
      {props.transcribedText.length > 0 && (
          <div className="output-container">
            <div className="transcription-container">{props.transcribedText}</div>
          </div>
      )}
    </React.Fragment>
  );
}

export default Transcriber;