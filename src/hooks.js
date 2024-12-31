import { useState, useEffect } from "react";
import axios from "axios";

function useFlip(initialFlipState = true) {
  const [isFlipped, setFlipped] = useState(initialFlipState);

  const flip = (canFlip) => {
    if(canFlip)
    {
      setFlipped(isUp => !isUp);
    }
  };

  return [isFlipped, flip];
}

function useAxios(keyInLS, baseUrl) {

  const newGame = async (data) => {
    getPlayerHand(data);
    getDealerHand(data);
    getBidPool(data);
    setWinnerValue("");
  }

  const getPlayerHand = async (formatter = data => data) => 
  {  
    const response = await axios.get(`${baseUrl}new/shuffle/?cards=AS,2S,3S,4S,5S,6S,7S,8S,9S,10S,JS,QS,KS`);
    let remaining = response.data.remaining;
    while (remaining > 0)
    {
      const card = await axios.get(`${baseUrl}${response.data.deck_id}/draw/`);
      setPlayerResponses(data => [...data, formatter(card.data)]);
      remaining = card.data.remaining;
    }
  }

  const getDealerHand = async (formatter = data => data) => 
  {  
    const response = await axios.get(`${baseUrl}new/shuffle/?cards=AC,2C,3C,4C,5C,6C,7C,8C,9C,10C,JC,QC,KC`);
    let remaining = response.data.remaining;
    while (remaining > 0)
    {
      const card = await axios.get(`${baseUrl}${response.data.deck_id}/draw/`);
      setDealerResponses(data => [...data, formatter(card.data)]);
      remaining = card.data.remaining;
    }
  }

  const getBidPool = async (formatter = data => data) => 
    {  
      const response = await axios.get(`${baseUrl}new/shuffle/?cards=AD,2D,3D,4D,5D,6D,7D,8D,9D,10D,JD,QD,KD`);
      let remaining = response.data.remaining;
      while (remaining > 0)
      {
        const card = await axios.get(`${baseUrl}${response.data.deck_id}/draw/`);
        setBidResponses(data => [...data, formatter(card.data)]);
        remaining = card.data.remaining;
      }
    }

  const [playerResponses, setPlayerResponses, dealerResponses, setDealerResponses , bidResponses, setBidResponses, SetPlayState, pbValue, dbValue, pwValue, dwValue, bpValue, setBPValue, winnerValue, setWinnerValue] = useLocalStorage(keyInLS);


  const clearResponses = () => {setPlayerResponses([]); setDealerResponses([]); setBidResponses([])};
  
  const setValues = (playerHand, dealerHand, bidPool) => {
    setPlayerResponses(playerHand); 
    setDealerResponses(dealerHand); 
    setBidResponses(bidPool);
  };

  return [playerResponses, dealerResponses, bidResponses, clearResponses, newGame, setValues, SetPlayState, pbValue, dbValue, pwValue, dwValue, bpValue, setBPValue, winnerValue, setWinnerValue];
} 

function useLocalStorage(key, initialPValue = [], initialDValue = [], initialBValue = [], initialPBValue = [], initialDBValue = [], initialPWValue = [], initialDWValue = [], initialBPValue=1, initialWinner="") {
  /*
  if (localStorage.getItem("p"+key)) {
    initialPValue = JSON.parse(localStorage.getItem("p"+key));
  }
  if (localStorage.getItem("d"+key)) {
    initialDValue = JSON.parse(localStorage.getItem("d"+key));
  }
  if (localStorage.getItem("b"+key)) {
    initialBValue = JSON.parse(localStorage.getItem("b"+key));
  }

  if (localStorage.getItem("pb"+key)) {
    initialPBValue = JSON.parse(localStorage.getItem("pb"+key));
  }
  if (localStorage.getItem("db"+key)) {
    initialDBValue = JSON.parse(localStorage.getItem("db"+key));
  }

  if (localStorage.getItem("pw"+key)) {
    initialPWValue = JSON.parse(localStorage.getItem("pw"+key));
  }
  if (localStorage.getItem("dw"+key)) {
    initialDWValue = JSON.parse(localStorage.getItem("dw"+key));
  }

  if (localStorage.getItem("bp"+key)) {
    initialBPValue = JSON.parse(localStorage.getItem("bp"+key));
  }

  if (localStorage.getItem("win"+key)) {
    initialWinner = JSON.parse(localStorage.getItem("win"+key));
  }
  */
  const [pValue, setPValue] = useState(initialPValue);
  const [dValue, setDValue] = useState(initialDValue);
  const [bValue, setBValue] = useState(initialBValue);

  const [pbValue, setPBValue] = useState(initialPBValue);
  const [dbValue, setDBValue] = useState(initialDBValue);
  
  const [pwValue, setPWValue] = useState(initialPWValue);
  const [dwValue, setDWValue] = useState(initialDWValue);

  const [bpValue, setBPValue] = useState(initialBPValue);

  const [winnerValue, setWinnerValue] = useState(initialWinner);

  useEffect(() => {
    localStorage.setItem("p"+key, JSON.stringify(pValue));
    localStorage.setItem("d"+key, JSON.stringify(dValue));
    localStorage.setItem("b"+key, JSON.stringify(bValue));

    localStorage.setItem("pb"+key, JSON.stringify(pbValue));
    localStorage.setItem("db"+key, JSON.stringify(dbValue));

    localStorage.setItem("pw"+key, JSON.stringify(pwValue));
    localStorage.setItem("dw"+key, JSON.stringify(dwValue));

    localStorage.setItem("bp"+key, JSON.stringify(bpValue));

    localStorage.setItem("win"+key, JSON.stringify(winnerValue));

  }, [pValue, dValue, bValue, pbValue, dbValue, pwValue, dwValue, bpValue, winnerValue, key]);

  const SetPlayState = (playerbid, dealerbid, playerwinnings, dealerwinnings) => 
  {
    setPBValue(playerbid);
    setDBValue(dealerbid);

    setPWValue(playerwinnings);
    setDWValue(dealerwinnings);
  }

  return [pValue, setPValue, dValue, setDValue, bValue, setBValue, SetPlayState, pbValue, dbValue, pwValue, dwValue, bpValue, setBPValue, winnerValue, setWinnerValue];
}


export default useLocalStorage;

export { useFlip, useAxios, useLocalStorage };
