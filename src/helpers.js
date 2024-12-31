import { v4 as uuidv4 } from 'uuid';

/* Select a random element from values array. */
function choice(values) {
  const randIdx = Math.floor(Math.random() * values.length);
  return values[randIdx];
}

/* Format response data from the Deck of Cards API,
 * extracting just the image url. */
function formatCard(data) {
  return {
    image: data.cards[0].image,
    value: data.cards[0].value,
    id: uuidv4()
  };
}


export { choice, formatCard };
