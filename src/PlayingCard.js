import React from "react";
import { useFlip } from "./hooks";
import backOfCard from "./back.png";
import "./PlayingCard.css";

/* Renders a single playing card. */
function PlayingCard({ front, back = backOfCard, defailtSide = true, handIndex, picked, size = '6%', leftPad = "0%", rightPad = "0%"}) {
  const [isFacingUp, flip] = useFlip(defailtSide);
  return (
    <img
      src={isFacingUp ? front : back}
      alt="playing card"
      onClick={() => picked(handIndex, defailtSide)}
      className="PlayingCard Card"
      style={{ height: size, paddingLeft: leftPad, paddingRight: rightPad}}
    />
  );

}

export default PlayingCard;
