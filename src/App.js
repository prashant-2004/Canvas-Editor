import './App.css';
import { SpeedInsights } from '@vercel/speed-insights/react';
import TemplateData from './components/TemplateData';
import { Component } from 'react';
import CanvasEditor from './components/Canvas_Editor';

class App extends Component {
  render() {
    return (
      <div>
        <CanvasEditor templateData={TemplateData} /> {/*Render CanvasEditor */}
        <SpeedInsights />
      </div>
    );
  }
}

export default App;
