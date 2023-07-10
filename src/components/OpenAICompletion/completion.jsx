/* eslint-disable react/prop-types */
import React from 'react';
import ShareModal from '../../modals/share';

// eslint-disable-next-line react/prop-types
const Completion = (props) => {
  if (props.completionList.length > 0) {
    return (
      <React.Fragment>
        {props.completionList.map((completion, index) => {
          return (
            <div key={index}>
              <div className="output-container" key={index}>
                <div className="summary-container" key={index}>{completion}</div>
              </div>
              {/* <button onClick={() => console.log('share > ', completion)}>Share</button> */}
              <ShareModal content={completion} />
            </div>
          )
         })}
      </React.Fragment>
    );
  }
  if (props.completionText.length > 0) {
    console.log('completionText')
    return (
      <React.Fragment>
        <div className="output-container">
          {props.completionText.length > 0 && (
            <div className="summary-container">{props.completionText}</div>
          )}
        </div>
      </React.Fragment>
    );
  }
}

export default Completion;