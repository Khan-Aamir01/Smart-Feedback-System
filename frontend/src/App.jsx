import { useEffect , useState } from 'react'
import './App.css'

function App() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/")
      .then(res => res.json())
      .then(data => setMessage(data.message));
  }, []);

  return(<div className="h-screen flex items-center justify-center bg-gray-500">
      <h1 className="text-4xl font-bold text-white">{message}</h1>
    </div>);
}

export default App
