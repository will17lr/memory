import { useEffect, useMemo, useState, type ChangeEvent } from "react";
import MemoryGame from "./MemoryGame";
import "../styles/memory-frame.css";

type BackgroundId = "soft" | "night" | "forest" | "sunset" | "animated" | "video" | "custom";

type BackgroundOption = {
  id: BackgroundId;
  label: string;
  background: string;
};

const BACKGROUNDS: BackgroundOption[] = [
  {
    id: "soft",
    label: "Candy Pop",
    background:
      "radial-gradient(circle at 20% 20%, #f9a8d4 0%, transparent 28%), radial-gradient(circle at 80% 10%, #93c5fd 0%, transparent 26%), radial-gradient(circle at 50% 90%, #facc15 0%, transparent 30%), linear-gradient(135deg, #8b5cf6 0%, #ec4899 45%, #f97316 100%)",
  },
  {
    id: "night",
    label: "Neon Night",
    background:
      "radial-gradient(circle at 15% 20%, #22d3ee 0%, transparent 26%), radial-gradient(circle at 85% 30%, #a855f7 0%, transparent 28%), radial-gradient(circle at 50% 85%, #f43f5e 0%, transparent 30%), linear-gradient(135deg, #020617 0%, #111827 50%, #312e81 100%)",
  },
  {
    id: "forest",
    label: "Arcade Grid",
    background:
      "linear-gradient(rgba(34, 211, 238, 0.22) 1px, transparent 1px), linear-gradient(90deg, rgba(34, 211, 238, 0.22) 1px, transparent 1px), radial-gradient(circle at top, #ec4899 0%, transparent 35%), linear-gradient(135deg, #020617 0%, #111827 55%, #0f172a 100%)",
  },
  {
    id: "sunset",
    label: "Tropical Sunset",
    background:
      "radial-gradient(circle at 25% 25%, #fde047 0%, transparent 28%), radial-gradient(circle at 80% 20%, #fb7185 0%, transparent 30%), radial-gradient(circle at 50% 90%, #38bdf8 0%, transparent 35%), linear-gradient(135deg, #f97316 0%, #ec4899 45%, #7c3aed 100%)",
  },
  {
    id: "animated",
    label: "Aurora animée",
    background:
      "linear-gradient(120deg, #22d3ee, #8b5cf6, #ec4899, #f97316, #22c55e)",
  },
  {
    id: "video",
    label: "Vidéo",
    background:
      "linear-gradient(135deg, #020617 0%, #111827 50%, #312e81 100%)",
  },
  {
    id: "custom",
    label: "Image perso",
    background: "",
  },
];

export default function MemoryFrame() {
  const [selectedBackground, setSelectedBackground] = useState<BackgroundId>(() => {
    const saved = localStorage.getItem("memory-background") as BackgroundId | null;
    return saved ?? "soft";
  });

  const [customImage, setCustomImage] = useState(() => {
    return localStorage.getItem("memory-custom-image") ?? "";
  });

  useEffect(() => {
    localStorage.setItem("memory-background", selectedBackground);
  }, [selectedBackground]);

  useEffect(() => {
    if (customImage) {
      localStorage.setItem("memory-custom-image", customImage);
    }
  }, [customImage]);

  const defaultBackground = BACKGROUNDS[0].background;

  const currentBackground = useMemo(() => {
    if (selectedBackground === "custom") {
      if (!customImage) return defaultBackground;

      return `linear-gradient(rgba(15, 23, 42, 0.70), rgba(15, 23, 42, 0.35)), url(${customImage})`;
    }

    const found = BACKGROUNDS.find(
      (background) => background.id === selectedBackground
    );

    return found?.background ?? defaultBackground;
  }, [selectedBackground, customImage, defaultBackground]);

  const pageClassName = [
    "memory-page",
    selectedBackground === "animated" ? `memory-page--animated` : "",
    selectedBackground === "video" ? `memory-page--video` : ""
  ]
    .filter(Boolean)
    .join(" ");

  function handleCustomImage(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Merci de choisir un fichier image.");
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      const result = reader.result;

      if (typeof result === "string") {
        setCustomImage(result);
        setSelectedBackground("custom");
      }
    };

    reader.readAsDataURL(file);
  }

  function removeCustomImage() {
    setCustomImage("");
    localStorage.removeItem("memory-custom-image");
    setSelectedBackground("soft");
  }

  return (
    <main className={pageClassName} style={{ backgroundImage: currentBackground } as React.CSSProperties}>
      {selectedBackground === "video" && (
        <video
          className="memory-page__video"
          autoPlay
          muted
          loop
          playsInline
          aria-hidden="true"
        >
          <source
            src={`${import.meta.env.BASE_URL}videos/memory-bg-mobile.mp4`}
            type="video/mp4"
            media="(max-width: 700px)"
          />
          <source
            src={`${import.meta.env.BASE_URL}videos/memory-bg-desktop.mp4`}
            type="video/mp4"
          />
        </video>
      )}

    <section className="memory-frame">
        <header className="memory-frame__header">
          <div>
            <p className="memory-frame__eyebrow">Memory Game</p>
            <h1 className="memory-frame__title">Trouve toutes les paires</h1>
          </div>

          <div className="memory-frame__controls">
            <label className="memory-frame__label" htmlFor="background-select">
              Fond
            </label>

            <select
              id="background-select"
              className="memory-frame__select"
              value={selectedBackground}
              onChange={(event) =>
                setSelectedBackground(event.target.value as BackgroundId)
              }
            >
              {BACKGROUNDS.map((background) => (
                <option key={background.id} value={background.id}>
                  {background.label}
                </option>
              ))}
            </select>

            <label className="memory-frame__file">
              Image perso
              <input type="file" accept="image/*" onChange={handleCustomImage} />
            </label>

            {customImage && (
              <button
                type="button"
                className="memory-frame__reset-bg"
                onClick={removeCustomImage}
              >
                Retirer
              </button>
            )}
          </div>
        </header>

        <div className="memory-frame__game">
          <MemoryGame pairs={8} />
        </div>
      </section>
    </main>
  );
} 