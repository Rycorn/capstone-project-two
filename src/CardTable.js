import React from "react";
import PlayingCardList from "./PlayingCardList";
import "./CardTable.css";

/* Main component. Renders card lists for
 * playing cards . */
function CardTable() {
  return (
    <div className="CardTable">
      <PlayingCardList />

    </div>
  );
}

export default CardTable;
