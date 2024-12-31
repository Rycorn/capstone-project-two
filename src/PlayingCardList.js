import React, { useState } from "react";
import { useAxios } from "./hooks";
import PlayingCard from "./PlayingCard";
import { formatCard } from "./helpers";
import "./PlayingCardList.css";

/* Renders a list of playing cards.
 * Can also add a new card at random,
 * or remove all cards. */
function CardTable(props) {
  const [playerCards, dealerCards, bidPool, clearCards, newGame, setHandValues, SetPlayState, playerBid, dealerBid, playerwinnings, dealerwinnings, bidPrizeSize, setBPValue, winnerValue, setWinnerValue] = useAxios(
    "cards",
    "https://deckofcardsapi.com/api/deck/"
  );
  
  const [canClick, setCanClick] = useState(true);
  const [playerScore, setPlayerScore] = useState(0);
  const [dealerScore, setDealerScore] = useState(0);

  const PickedCard = async(pickIndex) => {
    if(canClick)
    {
      setCanClick(false);
      const newplayerCards = playerCards.filter((item, index) => index !== pickIndex);
      

      const pickedDealerCardIndex = Math.floor(Math.random() * (dealerCards.length));

      const newDealerCards = dealerCards.filter((item, index) => index !== pickedDealerCardIndex);

      const winner = GetWinner(playerCards[pickIndex].value, dealerCards[pickedDealerCardIndex].value)
      SetPlayState(playerBid => [...playerBid, playerCards[pickIndex]], 
        dealerBid => [...dealerBid, dealerCards[pickedDealerCardIndex]], 
        playerwinnings, dealerwinnings);
      await setHandValues(newplayerCards, newDealerCards, bidPool);
      
      await delay(2000);

      const newBidPool = bidPool.filter((item, index) => index >= bidPrizeSize);
      if(winner === "Player")
      {
        for(let i = 0; i < bidPrizeSize; i++)
        {
          SetPlayState([], [], 
            playerwinnings => [...playerwinnings, bidPool[i]], dealerwinnings);
        }
        setHandValues(newplayerCards, newDealerCards, newBidPool);
        setBPValue(1);
      }
      if(winner === "Dealer")
      {
        for(let i = 0; i < bidPrizeSize; i++)
        {
          SetPlayState([], [], 
            playerwinnings, dealerwinnings => [...dealerwinnings, bidPool[i]]);
        }
        setHandValues(newplayerCards, newDealerCards, newBidPool);
        setBPValue(1);
      }
      if(winner === "Tie")
      {
        if(bidPrizeSize + 1 < bidPool.length)
        {
          setBPValue(bidPrizeSize + 1);
        }
        else
        {
          setWinnerValue(GetGameWinner());
        }
      }
      if(newBidPool.length <= 0)
      {
        setWinnerValue(GetGameWinner());
      }
      setCanClick(true);
    }
  }

  const GetGameWinner = () =>{
    let playerValue = 0;
    let dealerValue = 0;

    playerwinnings.forEach(card => {
      playerValue += GetValue(card.value);
    });
    dealerwinnings.forEach(card => {
      dealerValue += GetValue(card.value);
    });

    setPlayerScore(playerValue);
    setDealerScore(dealerValue);

    if(playerValue > dealerValue)
    {
      return "You Win";
    }
    else if(playerValue < dealerValue)
    {
      return "You Lose";
    }
    else
    {
      return "Tie";
    }
  }

  const GetWinner = (playerCard , dealerCard) => {
    let playerValue = GetValue(playerCard);
    let dealerValue = GetValue(dealerCard);
    
    if(playerValue > dealerValue)
    {
      return "Player";
    }
    else if(playerValue < dealerValue)
    {
      return "Dealer";
    }
    else
    {
      return "Tie";
    }
  }

  const GetValue = (card) =>{
    let value = 0;
    switch(card)
    {
      case "KING":
        value = 13;
        break;
      case "QUEEN":
        value = 12;
        break;
      case "JACK":
        value = 11;
        break;
      case "ACE":
        value = 1;
        break;
      default:
        value = parseInt(card);
    }
    return value;
  }
  const delay = async(ms) =>{
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  const doNothing = () => {}
  return (
    <div className="CardTable"> 
      <header className="CardTable-heading">
        <h1 style={{margin: 0}}>GOPS</h1>
        {bidPool.length > 0 && <h2 style={{margin: 0}}>Place yout bid for the card</h2>}
        {bidPool.length < 1 && <h2 style={{margin: 0}}>Simple bidding/bluffing game with an ordinary pack of cards </h2>}
        <div>
          {bidPool.length > 0 && <button onClick={() => {clearCards(); newGame(formatCard); SetPlayState([], [], [], [])}}>New Game</button>}
        </div>
      </header>
      <div className="PlayingCardList">
        <div className="PlayingCardList-card-area">
          {dealerCards.map(card => (
            <PlayingCard key={card.id} front={card.image} defailtSide={false} picked={doNothing} size="100px"/>
          ))}
        </div>
        <div className="PlayingCardList-card-area-mid">
          <section className="PlayingCardList-card-area-win">
            {dealerwinnings.map((card, index) => (
                  <PlayingCard key={card.id} front={card.image} handIndex={index} picked={doNothing} size="60px"/>
                ))}
          </section>
          
          {dealerBid.map((card, index) => (
              <PlayingCard key={card.id} front={card.image} handIndex={index} picked={doNothing} size="80px"/>
            ))}   
          {bidPool.map((card, index) => (
            index < bidPrizeSize && <PlayingCard key={card.id} front={card.image} handIndex={index} picked={doNothing} size="100px"/>
          ))}
          {playerBid.map((card, index) => (
            <PlayingCard key={card.id} front={card.image} handIndex={index} picked={doNothing} size="80px"/>
          ))}

          <section className="PlayingCardList-card-area-win">
            {playerwinnings.map((card, index) => (
              <PlayingCard key={card.id} front={card.image} handIndex={index} picked={doNothing} size="60px"/>
            ))}
          </section>
        </div>

        <div className="PlayingCardList-card-area">
          {playerCards.map((card, index) => (
            <PlayingCard key={card.id} front={card.image} handIndex={index} picked={PickedCard} size="100px"/>
          ))}
        </div>
      </div>
      {winnerValue !== "" && <div style={{ backgroundColor: '#a3c9ab'}}>
        <h1>{winnerValue} </h1>
        <h2>{playerScore} to {dealerScore}</h2>
      </div>}

      {bidPool.length < 1 && <button onClick={() => {clearCards(); newGame(formatCard); SetPlayState([], [], [], [])}} className="Big-Button">New Game</button>}

    </div>
  );
}

CardTable.defaultProps = {};

export default CardTable;
