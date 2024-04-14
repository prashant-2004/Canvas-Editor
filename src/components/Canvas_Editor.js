import React, { Component } from 'react';
import { SketchPicker } from 'react-color';

class CanvasEditor extends Component {
  constructor(props) {
    super(props);
    this.canvasRef = React.createRef();
    this.state = {
      selectedColors: [],
      showColorPicker: false,
      backgroundColor: '#0369A1',
      captionText: '1 & 2 BHK Luxury Apartments at just Rs.34.97 Lakhs',
      ctaText: 'Shop Now',
      file:null
    };

    this.handleFileSelect = this.handleFileSelect.bind(this);
    this.wrapText = this.wrapText.bind(this);
  }

  componentDidMount() {
    this.drawCanvas();
  }

  componentDidUpdate() {
    this.drawCanvas();
  }

  drawCanvas() {
    const canvas = this.canvasRef.current;
    const ctx = canvas.getContext('2d');
    const { templateData } = this.props;
    const { backgroundColor, captionText, ctaText, file } = this.state;

    // Draw background color
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw design pattern
    const designPatternImage = new Image();
    designPatternImage.onload = function() {
      ctx.drawImage(designPatternImage, 0, 0, canvas.width, canvas.height);
    };
    designPatternImage.src = templateData.urls.design_pattern;

    // Draw mask stroke after mask image has loaded
    const maskStrokeImage = new Image();
    maskStrokeImage.onload = () => {
        ctx.drawImage(maskStrokeImage, templateData.mask_stroke.x, templateData.mask_stroke.y, templateData.mask_stroke.width, templateData.mask_stroke.height);
    };
    maskStrokeImage.src = templateData.urls.stroke;
    
    // Draw image mask
    const maskImage = new Image();
    maskImage.onload = function() {
        ctx.globalCompositeOperation = 'source-atop';
        ctx.drawImage(maskImage, templateData.image_mask.x, templateData.image_mask.y, templateData.image_mask.width, templateData.image_mask.height);
        ctx.globalCompositeOperation = 'source-over';
    };
    maskImage.src =file;
        
    // Draw caption text
    if (backgroundColor !== '#000000')
        ctx.fillStyle = templateData.caption.text_color;
    else
        ctx.fillStyle = '#FFFFFF';

    ctx.font = `${templateData.caption.font_size}px Arial`;
    ctx.textAlign = templateData.caption.alignment;

    const lines = this.wrapText(captionText, templateData.caption.max_characters_per_line);
    lines.forEach((line, index) => {
        ctx.fillText(line, templateData.caption.position.x, templateData.caption.position.y + index * templateData.caption.font_size);
    });


    // Draw call-to-action text with background
    if (backgroundColor !== '#000000')
        ctx.fillStyle = templateData.cta.background_color;
    else
        ctx.fillStyle = '#FFFFFF';

    const radius = 15; // Adjusting the Radius of the Curve
    ctx.beginPath();
    ctx.moveTo(templateData.cta.position.x + radius, templateData.cta.position.y - 40);
    ctx.lineTo(templateData.cta.position.x + 200 - radius, templateData.cta.position.y - 40);
    ctx.arcTo(templateData.cta.position.x + 200, templateData.cta.position.y - 40, templateData.cta.position.x + 200, templateData.cta.position.y - 40 + radius, radius);
    ctx.lineTo(templateData.cta.position.x + 200, templateData.cta.position.y - 40 + 70 - radius);
    ctx.arcTo(templateData.cta.position.x + 200, templateData.cta.position.y - 40 + 70, templateData.cta.position.x + 200 - radius, templateData.cta.position.y - 40 + 70, radius);
    ctx.lineTo(templateData.cta.position.x + radius, templateData.cta.position.y - 40 + 70);
    ctx.arcTo(templateData.cta.position.x, templateData.cta.position.y - 40 + 70, templateData.cta.position.x, templateData.cta.position.y - 40 + 70 - radius, radius);
    ctx.lineTo(templateData.cta.position.x, templateData.cta.position.y - 40 + radius);
    ctx.arcTo(templateData.cta.position.x, templateData.cta.position.y - 40, templateData.cta.position.x + radius, templateData.cta.position.y - 40, radius);
    ctx.closePath();
    ctx.fill();
    
    ctx.fillStyle = backgroundColor;
    
    ctx.font = `35px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const wrapLength = templateData.cta.wrap_length || 20;
    const wrappedText = this.wrapText(ctaText, wrapLength);
    wrappedText.forEach((line, index) => {
        ctx.fillText(line, templateData.cta.position.x+95, templateData.cta.position.y + (index-0.20) * 30);
    });
  }

  wrapText(text, maxCharsPerLine) {
    const words = text.split(' ');
    const lines = [];
    let line = '';
    words.forEach(word => {
      if (line.length + word.length <= maxCharsPerLine) {
        line += (line === '' ? '' : ' ') + word;
      } else {
        const lastSpaceIndex = line.lastIndexOf(' ');
        const breakIndex = lastSpaceIndex !== -1 ? lastSpaceIndex : maxCharsPerLine;
        lines.push(line.substring(0, breakIndex));
        line = line.substring(breakIndex + 1) + ' ' + word;
      }
    });
    if (line !== '') {
      lines.push(line);
    }
    return lines;
  }

  handleColorChange = (color) => {
    this.setState({ backgroundColor: color.hex });
    this.updateSelectedColors(color.hex);
  };

  handleFileSelect=(e) => {
    console.log(e.target.files);
    this.setState({
      file: URL.createObjectURL(e.target.files[0])
    });
  }

  updateSelectedColors = (color) => {
    this.setState(prevState => ({
      selectedColors: [color, ...prevState.selectedColors.slice(0, 4)]
    }));
  };

  render() {
    const { selectedColors, showColorPicker, backgroundColor, captionText, ctaText } = this.state;

    return (
      <div className="container absolute flex w-full" style={{flexDirection: "row"}}>
        {/* CANVAS */}
        <div className="relative flex-1  mt-4 ml-10 mx-auto p-4 w-50%">
          <canvas
            ref={this.canvasRef}
            id="canvas"
            height="1080"
            width="1080"
            style={{ height:600, width: 700 }}
          ></canvas>
        </div>

        {/* Ad Customization */}
        <div className='relative pl-5 flex-1 text-center ml-10 w-full' style={{ display: "flex", flexDirection:"column" }}>
          <div className="mt-4 ml-4 font-calibri">
            <h4 className="text-2xl font-bold text-center mt-10">Ad Customization</h4>
            <h5 className="text-xl mt-0 text-gray-500">Customise your ad & get the templates accordingly..</h5>
          </div>

          {/* Text Inputs for Caption & the CTA Text */}
          <div className=" w-full mb-4 relative">
            <h4 className="text-center text-gray-500 mt-10 ml-0"> Change the ad creative Image.
              <label htmlFor="fileInput" className="text-blue-500 mb-4 text-u text-decoration-line: underline cursor-pointer">
                Select File
                <input
                  id="fileInput"
                  type="file"
                  className="hidden"
                  accept="image/*" 
                  onChange={this.handleFileSelect}
                />
              </label>
            </h4>

            <div className="flex items-center justify-center mt-10" style={{flexDirection: "row"}}>
              <hr className="w-1/4 border-t border-gray-400 mr-10" />
              <p className="text-gray-500">Edit Contents</p>
              <hr className="w-1/4 border-t border-gray-400 ml-10" />
            </div>
            
            <input
              type="text"
              placeholder="Ad Content"
              className="w-full mt-10 border border-gray-300 rounded-md py-2 px-4 placeholder-gray-500 text-gray-900 focus:outline-none focus:border-blue-500"    
              value={captionText}
              onChange={(e) => this.setState({ captionText: e.target.value })}
            />
            <span className="absolute inset-y-30 mt-3 left-0 pl-2 text-gray-500 pointer-events-none">Ad Content</span>
            <br></br>
            <input
              type="text"
              placeholder="CTA"
              className="w-full mt-9 border border-gray-300 rounded-md py-2 px-4 placeholder-gray-500 text-gray-900 focus:outline-none focus:border-blue-500"    
              value={ctaText}
              onChange={(e) => this.setState({ ctaText: e.target.value })}
            />
            <span className="absolute inset-y-30 mt-3 left-0 pl-1 text-gray-500 pointer-events-none">CTA</span>
          </div>

          {/* Color Picker Display */}
          <div className="relative flex mt-2 text-left">
            {selectedColors.map((color, index) => (
              <div
                key={index}
                className="w-7 h-7 border rounded-full mx-1 cursor-pointer border-3"
                style={{ backgroundColor: color }}
                onClick={() => this.setState({ backgroundColor: color })}
                ></div>
            ))}
            <button className="bg-gray-300 w-7 h-7 items-center justify-center font-2 rounded-full mx-1 cursor-pointer flex" onClick={() => this.setState({ showColorPicker: !showColorPicker })}> <span className="text-l">+</span></button>
          </div>
          {showColorPicker && (
            <div className="absolute mt-10 ml-1">
              <SketchPicker
                color={backgroundColor} 
                onChange={this.handleColorChange} 
              />
            </div>
          )}
        </div>
      </div>
      
    );
  }
}

export default CanvasEditor;
