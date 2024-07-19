import React from 'react';

function ImgEditor() {
  return (
    <div>
      <div className="caption">
          image Preview
          <input type="file" id="fileInput" name="file" />
      </div>
      <canvas className="previewCanvas"></canvas>
      <canvas className="resultCanvas"></canvas>
    </div>
  );
}

export default ImgEditor;