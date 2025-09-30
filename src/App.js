import './App.css';
import DraggablePhotos from './DraggablePhotos.tsx';

function App() {
  return (
    <div className="App">
      <div className='h-screen overflow-hidden w-full'>
        <h1 className='md:text-8xl text-5xl text-justify text-[#afa99b] underline decoration-[#afa99b] decoration-1 underline-offset-[10px]'>
        The process involves collage, mixed media, and incorporating personal items such as tickets or photos to create a unique, visually interesting book that serves as a form of artistic expression and a way to document memories. It's a therapeutic and mindful activity that repurposes discarded items, giving them new life and a place to hold meaningful details about one's experiences.  
        </h1>
      </div>
      <DraggablePhotos />
    </div>
  );
}

export default App;
