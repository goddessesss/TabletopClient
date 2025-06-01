import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx"
import AppRouter from './AppRouter';
import { useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import './styles/styles.scss';

function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/adminpanel');

  return (
    <div className="App">
      {!isAdminRoute && <Navbar />}
      <AppRouter />
      {!isAdminRoute && <Footer/>}
    </div>
  );
}

export default App;
