import { Routes, Route } from 'react-router-dom';
import StartPage from './pages/StartPage';
import GamePage from './pages/GamePage';
import ResultPage from './pages/ResultPage';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<StartPage />} />
      <Route path="/game" element={<GamePage />} />
      <Route path="/result" element={<ResultPage />} />
    </Routes>
  );
}
