import logo from './logo.svg';
import Route, {Router} from './Router';
import ScaleExplorer from './pages/ScaleExplorer';
import './App.css';
import "./stylesheets/colors.scss";
import "./stylesheets/page.scss";
import ScaleDiagram from './components/ScaleDiagram';
import { Scale } from './objects/Scale';
import { SCALE_FAMILIES } from './constants';

function App() {
  return <Router>
    <Route path="/"><ScaleExplorer/></Route>
    <Route path="/test"><div className="page"><ScaleDiagram notes={new Scale(0, SCALE_FAMILIES[0]).notes}/></div></Route>
  </Router>;
}

export default App;
