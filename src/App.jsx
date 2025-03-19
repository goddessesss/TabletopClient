import Navbar from "./components/Navbar/Navbar.jsx";
import AppRouter from './AppRouter';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';

function App() {
  return (
    <div className="App">
      <Navbar /> 
      <AppRouter />
    </div>
  );
}

export default App;
