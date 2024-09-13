let id; // id of the deck
let deck = [] // array with html elements
let cards = []; // array with cards info
let iio = [0, 0, 0, 0]; // array with cards stauts. 0 - hidden, 1 - shown

(async function(){ // request for a deck
  await fetch('https://deckofcardsapi.com/api/deck/new/shuffle/?cards=AS,AD,AC,AH') // SHUFFLE
  .then(function(response){
    return response.json()
  }) 
  .then(function(data) {
    console.log(data);
    id = data.deck_id // saving the id
    return id
  })
  .then(async function(id) {
    fetch(`https://deckofcardsapi.com/api/deck/${id}/draw/?count=4`) // DRAW
      .then(response => response.json()) 
      .then(data => (()=>{ cards = data.cards; deck = [...document.getElementsByClassName('card')]; console.log(data); return id })())
      .catch(error => console.error('Ошибка:', error))
  })
  .catch(error => console.error('Ошибка:', error))
})(); 

  function turnaround(i) { // card on click function
    deck[i].style.animationDirection = 'normal'
    deck[i].style.animationName = 'turnaround'
    deck[i].style.cursor = 'default'
    deck[i].attributes.onclick = undefined
    setTimeout(() => {
      deck[i].style.backgroundImage = `url(${cards[i].image})`
    }, 1300);
    iio[i] = 1
    if (iio[0] == 1 && iio[1] == 1 && iio[2] == 1 && iio[3] == 1) {
      setTimeout(() => {
        document.getElementById('reset-btn').style.display = 'block';
        document.getElementById('reset-btn').style.animationName = 'btn-appearing'
      }, 1300);
    }
  }

async function reshuffle() { // reshuffle the deck
  document.getElementById('reset-btn').style.display = 'none';
  let index = 0;
  iio = [0,0,0,0]
    await fetch(`https://deckofcardsapi.com/api/deck/${id}/shuffle/`) // RESHUFFLE
      .then(response => response.json()) 
      .then(data => (()=>{ console.log(data); return id })())
      .then(async function(id) {
        await fetch(`https://deckofcardsapi.com/api/deck/${id}/draw/?count=4`) // DRAW
          .then(response => response.json()) 
          .then(data => (()=>{ cards = data.cards; deck = [...document.getElementsByClassName('card')]; console.log(data); return id })())
          .catch(error => console.error('Ошибка:', error))})
      .catch(error => console.error('Ошибка:', error))

  function shuffleNextCard() {
      if (index < deck.length) {
          let card = deck[index];
          card.style.animationName = 'none';
          card.offsetHeight;
          card.style.animationDirection = 'reverse';
          card.style.animationFillMode = 'forwards';
          card.style.animationName = 'turnaround';

          setTimeout(() => {
              card.style.animationName = '';
              card.style.cursor = 'pointer'
              card.attributes.onclick = `turnaround(${index})`
          }, 1500); // Задержка в миллисекундах между итерациями

          setTimeout(() => {
            card.style.backgroundImage = "url('https://deckofcardsapi.com/static/img/back.png')";
            index++;
            shuffleNextCard(); // Вызов следующей итерации с задержкой
          }, 300); // Задержка для смены на задник
      }
  }

  shuffleNextCard(); // Начало цикла
}
