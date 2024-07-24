import React from 'react';
import ImgEditor from './components/ImgEditor';
import Renderer3D from './components/Renderer3D';
import ImgPreview from './components/ImgPreview';

function App() {
  return (
    <div>
      <ImgPreview />
      <ImgEditor />
      <Renderer3D />
    </div>
  );
}

export default App;