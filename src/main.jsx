import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
// import AudioRecorder from '../audio-recorder-polyfill/index'
import AudioRecorder from "https://cdn.jsdelivr.net/npm/audio-recorder-polyfill@0.4.1/+esm"
window.MediaRecorder = AudioRecorder

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
