import './App.css';
import TemplateData from './components/TemplateData';
import { Component } from 'react';
import CanvasEditor from './components/Canvas_Editor';

class App extends Component {
  render() {
    return (
      <div>
        <CanvasEditor templateData={TemplateData} /> {/*Render CanvasEditor */}
      </div>
    );
  }
}

export default App;
