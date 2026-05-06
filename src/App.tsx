import { useCallback, useEffect, useState } from "react";
import "./App.css";
import IntroScreen from "./components/IntroScreen";
import MemoryGame from "./components/MemoryGame";

export default function App() {
  const [showIntro, setShowIntro] = useState(true);
  const [introLeaving, setIntroLeaving] = useState(false);

  const handleStartGame = useCallback(() => {
    if (introLeaving) return;

    setIntroLeaving(true);

    setTimeout(() => {
      setShowIntro(false);
    }, 600);
  }, [introLeaving]);

  useEffect(() => {
    if (!showIntro || introLeaving) return;

    const timer = setTimeout(() => {
      handleStartGame();
    }, 5000);

    return () => clearTimeout(timer);
  }, [showIntro, introLeaving, handleStartGame]);

  return (
    <>
      {showIntro && (
        <IntroScreen onFinish={handleStartGame} isLeaving={introLeaving} />
      )}

      <div
        className={
          showIntro ? "game-wrapper game-waiting" : "game-wrapper game-ready"
        }
      >
        <MemoryGame pairs={8} />
      </div>
    </>
  );
}