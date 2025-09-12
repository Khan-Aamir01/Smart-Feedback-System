import { useEffect , useState } from 'react'
import './App.css'
import AudioRecorder from './components/AudioRecorder';

function App() {
  return(<div className="h-screen flex items-center justify-center bg-gray-500">
      <AudioRecorder />
    </div>);
}

export default App
