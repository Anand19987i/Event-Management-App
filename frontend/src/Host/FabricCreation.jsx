import { useEffect, useRef, useState } from 'react';
import { fabric } from 'fabric';
import Navbar from '@/components/Navbar';
import { GoUpload } from "react-icons/go";
import MenuBar from './MenuBar';
import { Circle, RectangleHorizontal, TextIcon, Triangle, Type, MinusCircle, Minus, Star, Diamond } from 'lucide-react';
import { FaImages } from 'react-icons/fa6';
import { MdDelete, MdPolyline } from "react-icons/md";
import HostNav from '@/main/HostNav';


const FabricCreation = () => {
  const canvasRef = useRef(null);
  const [canvas, setCanvas] = useState(null);
  const [selectedColor, setSelectedColor] = useState('red'); // Default color for shapes
  const [textInput, setTextInput] = useState(''); // Store text input
  const [selectedObject, setSelectedObject] = useState(null); // Store selected object

  useEffect(() => {
    const newCanvas = new fabric.Canvas(canvasRef.current, {
      width: 700,
      height: 400,
      backgroundColor: 'white',
    });
    setCanvas(newCanvas);

    newCanvas.on('object:selected', (e) => {
      setSelectedObject(e.target);
    });

    newCanvas.on('selection:cleared', () => {
      setSelectedObject(null);
    });

    return () => newCanvas.dispose();
  }, []);

  const handleDelete = () => {
    const activeObject = canvas?.getActiveObject();
    if (activeObject) {
      canvas.remove(activeObject); // Remove the selected object
      canvas.discardActiveObject(); // Clear selection
      setSelectedObject(null); // Update state to reflect no selected object
      canvas.renderAll(); // Re-render the canvas to apply changes
    } else {
      alert('No object selected to delete!');
    }
  };

  const addRectangle = () => {
    const rect = new fabric.Rect({
      top: 50,
      left: 50,
      width: 150,
      height: 100,
      fill: selectedColor,
    });
    canvas.add(rect);
  };

  const addCircle = () => {
    const circle = new fabric.Circle({
      radius: 50,
      top: 100,
      left: 100,
      fill: selectedColor,
    });
    canvas.add(circle);
  };

  const addTriangle = () => {
    const triangle = new fabric.Triangle({
      width: 100,
      height: 100,
      top: 100,
      left: 200,
      fill: selectedColor,
    });
    canvas.add(triangle);
  };

  const addEllipse = () => {
    const ellipse = new fabric.Ellipse({
      rx: 75,
      ry: 50,
      top: 150,
      left: 150,
      fill: selectedColor,
    });
    canvas.add(ellipse);
  };

  const addLine = () => {
    const line = new fabric.Line([50, 50, 200, 200], {
      stroke: selectedColor,
      strokeWidth: 5,
    });
    canvas.add(line);
  };

  const addPolygon = () => {
    const polygon = new fabric.Polygon(
      [
        { x: 200, y: 0 },
        { x: 250, y: 50 },
        { x: 200, y: 100 },
        { x: 150, y: 50 },
      ],
      {
        fill: selectedColor,
        left: 300,
        top: 150,
      }
    );
    canvas.add(polygon);
  };

  const addPolyline = () => {
    const polyline = new fabric.Polyline(
      [
        { x: 50, y: 50 },
        { x: 150, y: 50 },
        { x: 100, y: 100 },
      ],
      {
        fill: selectedColor,
        stroke: selectedColor,
        strokeWidth: 2,
        left: 300,
        top: 200,
      }
    );
    canvas.add(polyline);
  };

  const addStar = () => {
    const points = [];
    const centerX = 400;
    const centerY = 400;
    const outerRadius = 60;
    const innerRadius = 30;
    for (let i = 0; i < 10; i++) {
      const angle = (Math.PI / 5) * i;
      const radius = i % 2 === 0 ? outerRadius : innerRadius;
      points.push({
        x: centerX + radius * Math.sin(angle),
        y: centerY - radius * Math.cos(angle),
      });
    }
    const star = new fabric.Polygon(points, {
      fill: selectedColor,
      left: 300,
      top: 300,
    });
    canvas.add(star);
  };
  const addText = () => {
    const text = new fabric.Text('Text', {
      left: 100,
      top: 100,
      fontSize: 30,
      fill: selectedColor,
    });
    canvas.add(text);
    canvas.setActiveObject(text);
  };

  const handleFileUpload = (e) => {
    const reader = new FileReader();
    reader.onload = function (event) {
      const img = new Image();
      img.onload = function () {
        const imgInstance = new fabric.Image(img, {
          left: 100,
          top: 100,
          scaleX: 0.5, // Scale to adjust size
          scaleY: 0.5,
        });
        canvas.add(imgInstance);
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(e.target.files[0]);
  };

  const saveImage = () => {
    const dataUrl = canvas.toDataURL({ format: 'png' });
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = 'poster.png';
    link.click();
  };

  const handleColorChange = (e) => {
    const color = e.target.value;
    setSelectedColor(color);
    if (!canvas) return;
    const activeObject = canvas.getActiveObject();
    if (activeObject) {
      if (activeObject.set && activeObject.fill) {
        activeObject.set('fill', color);
      }
      if (activeObject.set && activeObject.stroke) {
        activeObject.set('stroke', color);
      }
      canvas.renderAll();
    }
  };
  

  const handleTextChange = (e) => {
    setTextInput(e.target.value);
    const activeObject = canvas.getActiveObject();
    if (activeObject && activeObject.type === 'text') {
      activeObject.set({ text: e.target.value });
      canvas.renderAll();
    }
  };

  return (
    <>
      <HostNav />
      <div className="flex font-poppins">
        <div className="flex flex-col items-start w-1/4 bg-gray-100 mt-3">
          <div className="flex flex-col mb-4 gap-2 w-full">
            <div className="w-full bg-gray-200">
              <h1 className="text-black px-10">Shapes</h1>
            </div>
            <div className="flex flex-wrap gap-2 px-2">
              <button onClick={addRectangle} className="mb-2"><RectangleHorizontal /></button>
              <button onClick={addCircle} className="mb-2"><Circle /></button>
              <button onClick={addTriangle} className="mb-2"><Triangle /></button>
              <button onClick={addEllipse} className="mb-2"><MinusCircle /></button>
              <button onClick={addStar} className='mb-2'><Star/></button>
              <button onClick={addPolygon} className="mb-2"><Diamond/></button>
              <button onClick={addLine} className="mb-2"><Minus /></button>
              <button onClick={addPolyline} className="mb-2"><MdPolyline /></button>

            </div>
          </div>
          <div className="w-full flex flex-col gap-3">
            <div className="w-full bg-gray-200">
              <h1 className="text-black px-10">Add Text</h1>
            </div>
            <div className="mb-2">
              <button onClick={addText} className="mb-2 px-2"><Type /></button>
            </div>
          </div>
          <div className="w-full flex flex-col gap-3">
            <div className="w-full bg-gray-200">
              <h1 className="text-black px-10">Add Images</h1>
            </div>
            <div className="mb-2 px-2">
              <label htmlFor="image-upload" className="cursor-pointer">
                <FaImages className="text-2xl" />
              </label>
              <input id="image-upload" type="file" onChange={handleFileUpload} className="hidden" />
            </div>
          </div>
          <div className="w-full flex flex-col gap-3">
            <div className="w-full bg-gray-200">
              <h1 className="text-black px-10">Change Colors</h1>
            </div>
            <div className="mb-2 px-2 rounded-full">
              <input
                type="color"
                value={selectedColor}
                onChange={handleColorChange}
                className="mb-2 w-8 h-8 rounded-full"
              />
            </div>
          </div>
          <div className="w-full flex flex-col gap-3">
            <div className="w-full bg-gray-200">
              <h1 className="text-black px-10">Edit Text</h1>
            </div>
            <div className="mb-2 px-2">
              <label className="font-medium">Edit: </label>
              <input
                type="text"
                value={textInput}
                onChange={handleTextChange}
                placeholder="Edit text"
                className="mb-2"
              />
            </div>
          </div>
          <div className="w-full flex flex-col gap-3">
            <div className="w-full bg-gray-200">
              <h1 className="text-black px-10">Delete</h1>
            </div>
            <button
              onClick={handleDelete}
              className="bg-red-500 w-[20%] p-1 ml-16 mb-3 flex justify-center items-center  text-white  rounded "
            >
              <MdDelete />
            </button>
          </div>
        </div>
        <div className="relative w-3/4 p-4">
          <canvas
            ref={canvasRef}
            style={{ width: '100%', height: '100%' }}
            className="shadow-lg border border-gray-100 ml-20 mt-5"
          />
        </div>
        <div className="bg-indigo-600 h-10 w-30 mr-44 mt-10 flex items-center rounded shadow-md text-white font-semibold">
          <button onClick={saveImage} className="flex px-5 items-center gap-1"><GoUpload /> Save</button>
        </div>
      </div>
    </>
  );
};

export default FabricCreation;
