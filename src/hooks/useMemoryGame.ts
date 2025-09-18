import { useCallback, useEffect, useMemo, useState } from "react";

export type Card = {
  id: number;
  value: string;
  flipped: boolean;
  matched: boolean;
};

export type UseMemoryGameOptions = {
  pairs?: number;        // nombre de paires (2..8)
  symbols?: string[];    // jeu de symboles custom
  flipDelayMs?: number;  // délai avant de re-retourner une mauvaise paire
};

const DEFAULT_EMOJIS = ["🍎","🍋","🍉","🍇","🍓","🥑","🍒","🍍"];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function makeDeck(symbols: string[]): Card[] {
  let id = 0;
  const deck: Card[] = [];
  for (const s of symbols) {
    deck.push({ id: id++, value: s, flipped: false, matched: false });
    deck.push({ id: id++, value: s, flipped: false, matched: false });
  }
  return shuffle(deck);
}

/** Hook custom pour gérer toute la logique du Memory */
export function useMemoryGame(opts: UseMemoryGameOptions = {}) {
  const { pairs = 8, symbols = [...DEFAULT_EMOJIS], flipDelayMs = 650 } = opts;

  const activeSymbols = useMemo(() => symbols.slice(0, pairs), [pairs, symbols]);

  const [cards, setCards] = useState<Card[]>(() => makeDeck(activeSymbols));
  const [selection, setSelection] = useState<number[]>([]);
  const [locked, setLocked] = useState(false);
  const [moves, setMoves] = useState(0);

  useEffect(() => {
    setCards(makeDeck(activeSymbols));
    setSelection([]);
    setLocked(false);
    setMoves(0);
  }, [activeSymbols.join("|")]);

  const allMatched = cards.length > 0 && cards.every(c => c.matched);

  const flipAt = useCallback((index: number) => {
    if (locked) return;
    const c = cards[index];
    if (!c || c.flipped || c.matched) return;

    const next = cards.map((x, i) => (i === index ? { ...x, flipped: true } : x));
    const nextSel = [...selection, index];
    setCards(next);
    setSelection(nextSel);

    if (nextSel.length === 2) {
      setLocked(true);
      setMoves(m => m + 1);
      const [a, b] = nextSel;
      const isPair = next[a].value === next[b].value;

      window.setTimeout(() => {
        setCards(prev =>
          prev.map((x, i) => {
            if (i === a || i === b) {
              return isPair ? { ...x, matched: true } : { ...x, flipped: false };
            }
            return x;
          })
        );
        setSelection([]);
        setLocked(false);
      }, flipDelayMs);
    }
  }, [cards, selection, locked, flipDelayMs]);

  const reset = useCallback(() => {
    setCards(makeDeck(activeSymbols));
    setSelection([]);
    setLocked(false);
    setMoves(0);
  }, [activeSymbols.join("|")]);

  return {
    cards,
    selection,
    locked,
    moves,
    allMatched,
    flipAt,
    reset,
  } as const;
}
