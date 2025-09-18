import "./App.css";
import MemoryGame from "./components/MemoryGame";

export default function App() {
  return <MemoryGame pairs={8} />; // ✅ correspond bien à la prop
}
