import "./App.css";
import "./index.css";
import GlobeCanvas from "./components/GlobeCanvas.jsx";

export default function App() {
  return (
    <div className="h-screen w-screen bg-black text-white">
      <div className="text-3xl font-bold text-blue-500 p-4">
        Hello from Tailwind!
      </div>
      <GlobeCanvas />
    </div>
  );
}
