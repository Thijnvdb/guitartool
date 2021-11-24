import { PopupProvider } from './components/PopupContext';
import ScaleExplorer from './pages/ScaleExplorer';
import './App.css';
import "./stylesheets/colors.scss";
import "./stylesheets/page.scss";

function App() {
  return (<PopupProvider>
    <ScaleExplorer/>
  </PopupProvider>)
}

export default App;
