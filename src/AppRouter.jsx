import { Routes, Route } from 'react-router-dom';
import Home from "./pages/Home";
import Auth from "./pages/Auth.jsx";
import Events from './pages/Events.jsx';
import Profile from './pages/Profile.jsx';
import AddEvent from './pages/AddEvent.jsx';
import AllBoardGames from './pages/AllBoardGames.jsx';
import EventDetail from './pages/EventDetail.jsx';

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/events" element={<Events />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/addevent" element={<AddEvent />} />
      <Route path="/all" element={<AllBoardGames />} />
      <Route path="/events/:eventId" element={<EventDetail />} />

    </Routes>
  );
};

export default AppRouter;
