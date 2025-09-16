import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css';
import FeedbackRecorder from './components/FeedbackRecorder';
import SentimentsPage from './components/SentimentsPage';
import Header from './components/Header';
import Footer from './components/Footer';

function App() {
  return (
    <Router>
      <Header />

      <Routes>
        {/* Landing page */}
        <Route path="/" element={<FeedbackRecorder />} />

        {/* Sentiments page */}
        <Route path="/sentiments" element={<SentimentsPage />} />
      </Routes>

      <Footer />
    </Router>
  );
}

export default App;

