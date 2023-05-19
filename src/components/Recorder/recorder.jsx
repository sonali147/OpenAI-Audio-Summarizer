import React, { useState, useRef } from "react";

const Recorder = (props) => {
  const [audioChunks, setAudioChunks] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const mediaRecorderRef = useRef(null);

  const startRecording = () => {
    // eslint-disable-next-line react/prop-types
    props.initialize();
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;

        mediaRecorder.addEventListener("dataavailable", (event) => {
          if (event.data.size > 0) {
            setAudioChunks((prevChunks) => [...prevChunks, event.data]);
          }
          console.log("dataavailable", audioChunks.length);
        });

        mediaRecorder.start();
        setIsRecording(true);
      })
      .catch((error) => {
        console.error("Error accessing microphone:", error);
      });
  };

  const pauseRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.pause();
      setIsPaused(true);
    }
  };

  const resumeRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.resume();
      setIsPaused(false);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsPaused(false);
      console.log("stop recording audioChunks", audioChunks.length);
      // eslint-disable-next-line react/prop-types
      props.onStopRecording(audioChunks);
      setAudioChunks([]);
    }
  };

  return (
    <React.Fragment>
    {!isRecording && !isPaused ? (
      <button onClick={startRecording}>Start Recording</button>
    ) : isRecording && !isPaused ? (
      <div>
        <div className="recording-section">
          <div className="recording-animation-container">
            <div className="recording-animation">Recording...</div>
          </div>
        </div>
        <div className="button-container">
          <button onClick={pauseRecording}>Pause Recording</button>
          <button onClick={stopRecording}>Stop Recording</button>
        </div>
      </div>
    ) : (
      <div>
        <div className="recording-section">
          <div className="recording-animation-container">
            <div className="recording-animation paused">Recording Paused</div>
          </div>
        </div>
        <div className="button-container">
          <button onClick={resumeRecording}>Resume Recording</button>
          <button onClick={stopRecording}>Stop Recording</button>
        </div>
      </div>
    )}
    </React.Fragment>
  )
}

export default Recorder;