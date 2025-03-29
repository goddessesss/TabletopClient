import { Routes, Route } from 'react-router-dom';
import Home from "./pages/Home";
import Auth from "./pages/Auth.jsx";
import Events from './pages/Events.jsx';
import Profile from './pages/Profile.jsx';

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/events" element={<Events />} />
      <Route path="/profile" element={<Profile />} />

    </Routes>
  );
};

export default AppRouter;
