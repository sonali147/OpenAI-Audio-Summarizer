/* eslint-disable react/prop-types */
import React from 'react';

// eslint-disable-next-line react/prop-types
const Completion = (props) => {
  return (
    <React.Fragment>
      {props.completionText.length > 0 && (
        <div className="output-container">
          {props.completionText.length > 0 && (
            <div className="summary-container">{props.completionText}</div>
          )}
        </div>
      )}
    </React.Fragment>
  );
}

export default Completion;