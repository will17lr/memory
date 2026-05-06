import { useState } from "react";
import "../styles/IntroScreen.css";

type IntroScreenProps = {
  onFinish: () => void;
  isLeaving: boolean;
};

const FRUITS = ["🍎", "🍋", "🍉", "🍇", "🍓", "🥑", "🍒", "🍍"];

function getRandomFruit() {
  const randomIndex = Math.floor(Math.random() * FRUITS.length);
  return FRUITS[randomIndex];
}

function createInitialFruits(count: number) {
  return Array.from({ length: count }, () => getRandomFruit());
}

export default function IntroScreen({ onFinish, isLeaving }: IntroScreenProps) {
  const [introFruits, setIntroFruits] = useState(() => createInitialFruits(3));

  const changeFruit = (cardIndex: number) => {
    setIntroFruits((currentFruits) =>
      currentFruits.map((fruit, index) =>
        index === cardIndex ? getRandomFruit() : fruit
      )
    );
  };

  return (
    <div className={`intro-screen ${isLeaving ? "intro-screen--leaving" : ""}`}>
      <div className="intro-content">
        <div className="intro-cards" aria-hidden="true">
          {introFruits.map((fruit, index) => (
            <div className="intro-card" key={index}>
              <div
                className="intro-card-inner"
                onAnimationIteration={() => changeFruit(index)}
              >
                <div className="intro-card-face intro-card-front">❓</div>
                <div className="intro-card-face intro-card-back">{fruit}</div>
              </div>
            </div>
          ))}
        </div>

        <h1 className="intro-title">Memory Game</h1>
        <p className="intro-text">Teste ta mémoire et retrouve les paires.</p>

        <button className="intro-button" onClick={onFinish}>
          Commencer
        </button>
      </div>
    </div>
  );
}