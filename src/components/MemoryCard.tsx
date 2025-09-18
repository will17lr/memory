import React from "react";

type Props = React.PropsWithChildren<{
  visible: boolean;
  matched: boolean;
  disabled?: boolean;
  onClick?: () => void;
}>;

export default function MemoryCard({ visible, matched, disabled, onClick, children }: Props) {
  const stateClass = matched ? "mem-card--ok" : visible ? "mem-card--flip" : "mem-card--hide";
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={["mem-card", stateClass, disabled ? "is-disabled" : ""].join(" ")}
    >
      <span className="mem-card__content">{children}</span>
    </button>
  );
}
