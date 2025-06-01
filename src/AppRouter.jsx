import { Routes, Route } from 'react-router-dom';
import Home from "./pages/Home";
import Auth from "./pages/Auth.jsx";
import Events from './pages/Events.jsx';
import Profile from './pages/Profile.jsx';
import AddEvent from './pages/AddEvent.jsx';
import AllBoardGames from './pages/AllBoardGames.jsx';
import EventDetail from './pages/EventDetail.jsx';
import EventCalendar from './pages/EventCalendar.jsx';
import AdminPanel from './pages/AdminPanel.jsx';
import EmailConfirmationPage from './pages/ConfirmEmail.jsx';
import ResetPasswordConfirm from './pages/ResetPassword.jsx';

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/events" element={<Events />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/events/addevent" element={<AddEvent />} />
      <Route path="/board-games" element={<AllBoardGames />} />
      <Route path="/events/:id" element={<EventDetail />} />
      <Route path="/calendar" element={<EventCalendar />} />
      <Route path="/adminpanel" element={<AdminPanel />} />
      <Route path="/confirm-email/confirm" element={<EmailConfirmationPage />} />
      <Route path="/reset-password/confirm" element={<ResetPasswordConfirm />} />

    </Routes>
  );
};

export default AppRouter;
