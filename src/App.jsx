import { useState } from "react";
import axios from 'axios';
import "./App.css";
import DropZone from "./components/Dropzone/dropzone";
// import Recorder from "./components/Recorder/recorder";
import Transcriber from "./components/Transcriber/transcriber";
import Summarizer from "./components/Summarizer/summarizer";
import ReactLoading from 'react-loading';
import AudioRecorder from "./components/AudioRecoderPolyfill/recoder";
import Completion from "./components/OpenAICompletion/completion";

// eslint-disable-next-line react/prop-types
const LoadingComp = ({ type, color }) => (
  <ReactLoading type={type} color={color} height={'10%'} width={'10%'} />
);

function App() {
  const [audioBlob, setAudioBlob] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [transcribedText, setTranscribedText] = useState("");
  const [summarizedText, setSummarizedText] = useState("");
  const [completionPrompt, setCompletionPrompt] = useState("Create action items for this meeting");
  const [completionText, setCompletionText] = useState("");
  const [completionList, setCompletionList] = useState([]);
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
      // response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/transcribe`, 
      // response = await axios.post(`/api/v1/openai/transcribe`, 
      response = await axios.post(`/api/openai-transcribe`,
          formData, 
          {
          headers: {
            'Content-Type': `multipart/form-data`,
          }
        });
      console.log(response);
      // if (response.code) {
      if (response.status !== 200) {
        throw new Error(response.message);
      }
      // setTranscribedText(response.data.text);
      setTranscribedText(response.data.message);
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
        // `/api/v1/openai/summarize`,  
        `/api/summarize`, 
        { text : transcribedText },
        {
          headers: {
            'Content-Type': `application/json`,
          }
        }
      );
      // if (response.code) {
      if (response.status !== 200) {
        throw new Error(response.message);
      }
      // setSummarizedText(response.data.choices[0].text);
      setSummarizedText(response.data.message);
      console.log(response); // Handle the summarized text data here
    } catch (error) {
      console.log("Error summarizing text:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const createCompletion = async () => {
    try {
      setIsLoading(true);
      const response = await axios.post(
        `/api/openai-completion`, 
        { prompt: completionPrompt, text : summarizedText },
        {
          headers: {
            'Content-Type': `application/json`,
          }
        }
      );
      // if (response.code) {
      if (response.status !== 200) {
        throw new Error(response.message);
      }
      setCompletionList(response.data.response_list);
      setCompletionText(response.data.message);
      console.log(response); // Handle the summarized text data here
    } catch (error) {
      console.log("Error creating openai completion text:", error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="app">
      <h1>AI Audio Summarizer</h1>
      <DropZone initialize={initialize} onFileDrop={handleFileSelect} />
      {/* {!selectedFile && <Recorder onStopRecording={handleAudioBlob} />} */}
      {!selectedFile && <AudioRecorder onStopRecording={handleAudioBlob} />}
      {(audioBlob != null || selectedFile) &&
        transcribedText.length === 0 && (
          <div>
            <div style={{ marginBottom: "10px" }}>
              Audio Ready... Click to proceed !!!
            </div>
            <div className='transcribe-container-btn'>
              <button className='button-container' onClick={transcribeAudio}>Transcribe Audio</button>
              <button className='button-container' onClick={() => window.location.reload()}>
                Retry
              </button>
            </div>
          </div>
        )}
      {transcribedText.length > 0 && (
        <div className="container">
          <Transcriber
            transcribedText={transcribedText}
          />
          {summarizedText.length === 0 && <div className="divider">
            <button className="button-container" onClick={() => navigator.clipboard.writeText(transcribedText)}>
              Copy to Clipboard
            </button>
            <button className="button-container" onClick={summarize}>
              Summarize
            </button>
            <button className="button-container" onClick={() => window.location.reload()}>
              Retry
            </button>
          </div>}
          {summarizedText.length > 0 && <Summarizer
            summarize={summarize}
            transcribedText={transcribedText}
            summarizedText={summarizedText}
            completionPrompt={completionPrompt}
            setCompletionPrompt={setCompletionPrompt}
            // suppressContentEditableWarning={true}
          />}
          {summarizedText.length > 0 && completionText.length === 0 && <div className="divider">
            <button className="button-container" onClick={() => navigator.clipboard.writeText(summarizedText)}>
              Copy to Clipboard
            </button>
            <button className="button-container" onClick={createCompletion}>
              Create Completion
            </button>
            <button className="button-container" onClick={() => window.location.reload()}>
              Retry
            </button>
          </div>}
          {completionText.length > 0 && <Completion completionText={completionText} completionList={completionList}/>}
          {completionText.length > 0 && <button className="button-container" onClick={() => window.location.reload()}>
            Retry
          </button>}
        </div>
      )}
      {isloading && <LoadingComp type={'spinningBubbles'} color={'#535bf2'} />}
      <p className="footer">Powered by OpenAI</p>
    </div>
  );
}

export default App;
