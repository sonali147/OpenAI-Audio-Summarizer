import { useState } from "react";
import axios from 'axios';
import "./App.css";
import DropZone from "./components/Dropzone/dropzone";
import Recorder from "./components/Recorder/recorder";
import Transcriber from "./components/Transcriber/transcriber";
import Summarizer from "./components/Summarizer/summarizer";
import ReactLoading from 'react-loading';

// eslint-disable-next-line react/prop-types
const LoadingComp = ({ type, color }) => (
  <ReactLoading type={type} color={color} height={'10%'} width={'10%'} />
);

function App() {
  const [audioBlob, setAudioBlob] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [transcribedText, setTranscribedText] = useState("");
  const [summarizedText, setSummarizedText] = useState("");
  const [isloading, setIsLoading] = useState(false);

  const initialize = () => {
    setAudioBlob(null);
    setSelectedFile(null);
    setTranscribedText("");
    setSummarizedText("");
  }

  const handleFileSelect = (file) => {
    console.log("handleFileSelect", file)
    setSelectedFile(file);
  };

  const handleAudioBlob = (blob) => {
    console.log("handleAudioBlob", blob)
    setAudioBlob(blob);
  };

  const transcribeAudio = async () => {
    try {
      setIsLoading(true);
      let response = null;
      let formData = new FormData();
      if (selectedFile) {
        console.log("selectedFile", selectedFile)
        formData.append('file', selectedFile);
        formData.append('filename', selectedFile.name);
        formData.append('mimetype', selectedFile.type);
      } else {
        const audioFile = new File([audioBlob], 'recorded_audio.webm', { type: 'audio/webm' });
        formData.append('file', audioFile);
        formData.append('filename', 'recorded_audio.webm');
        formData.append('mimetype', 'audio/webm');
      }
      response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/transcribe`, 
          formData, 
          {
          headers: {
            'Content-Type': `multipart/form-data`,
          }
        });
      // console.log(response);
      if (response.code) {
        throw new Error(response.message);
      }
      setTranscribedText(response.data.text);
    } catch (error) {
      console.log("Error transcribing audio:", error);
    } finally {
      setAudioBlob(null);
      setIsLoading(false);
    }
  };

  const summarize = async () => {
    try {
      setIsLoading(true);
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/summarize`, 
        { text : transcribedText },
      );
      if (response.code) {
        throw new Error(response.message);
      }
      setSummarizedText(response.data.choices[0].text);
      console.log(response); // Handle the summarized text data here
    } catch (error) {
      console.log("Error summarizing text:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app">
      <h1>AI Audio Summarizer</h1>
      <DropZone initialize={initialize} onFileDrop={handleFileSelect} />
      {!selectedFile && <Recorder onStopRecording={handleAudioBlob} />}
      {(audioBlob || selectedFile) &&
        transcribedText.length === 0 && (
          <div>
            <div style={{ marginBottom: "10px" }}>
              Audio Ready... Click to proceed !!!
            </div>
            <button onClick={transcribeAudio}>Transcribe Audio</button>
          </div>
        )}
      {isloading && <LoadingComp type={'spinningBubbles'} color={'#535bf2'} />}
      {transcribedText.length > 0 && (
        <div className="container">
          <Transcriber
            transcribedText={transcribedText}
          />
          <div className="divider">
            <button className="button-container" onClick={summarize}>
              Summarize
            </button>
            <button className="button-container" onClick={() => window.location.reload()}>
              Retry
            </button>
          </div>
          <Summarizer
            summarize={summarize}
            transcribedText={transcribedText}
            summarizedText={summarizedText}
          />
        </div>
      )}
      <p className="footer">Powered by OpenAI</p>
    </div>
  );
}

export default App;
