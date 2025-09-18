import React from "react";
import { useMemoryGame } from "../hooks/useMemoryGame";
import MemoryCard from "./MemoryCard";
import "../styles/memory.css";

export default function MemoryGame({ pairs = 8 }: { pairs?: number }) {
  const { cards, selection, locked, moves, allMatched, flipAt, reset } = useMemoryGame({ pairs });

  return (
    <div className="mem-wrap">
      <h1 className="mem-title">🎴 Jeu du Memory</h1>

      <header className="mem-header">
        <p className="mem-desc">Trouve toutes les paires en retournant deux cartes à la fois.</p>
        <div className="mem-stats">
          <span>Coups : <b>{moves}</b></span>
          <button onClick={reset} className="mem-btn">Rejouer</button>
        </div>
      </header>

      <div className="mem-grid">
        {cards.map((card, i) => {
          const disabled = locked || card.matched || (card.flipped && selection.length === 1);
          const visible = card.flipped || card.matched;
          return (
            <MemoryCard
              key={card.id}
              visible={visible}
              matched={card.matched}
              disabled={disabled}
              onClick={() => flipAt(i)}
            >
              {visible ? card.value : "❓"}
            </MemoryCard>
          );
        })}
      </div>

      {allMatched && (
        <div className="mem-win">
          🎉 Bravo ! Toutes les paires sont trouvées — Coups : <b>{moves}</b>
        </div>
      )}
    </div>
  );
}
