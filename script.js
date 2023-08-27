/*
1. Zareagować na przycisk START,
2. Wyświetlić owoc,
3. Wyświetlić węża,
4. Stworzyć poruszanie się,
5. Funkcja licząca punkty,
6. Funkcja wykrywająca kolizję ze ścianą,
7. Restart gry. */
//Wzorowane na podstawie "Tworzymy grę Snake w Funkcyjnym JavaScript z Ramda.js" https://www.youtube.com/watch?v=RE1ie09-j5g//

import * as R from 'ramda';

const canvas = document.querySelector('#game_area');
const ctx = canvas.getContext('2d');

const point = (x, y) => ({x, y});
const DIRECTIONS = {
    ArrowLeft: point(-1, 0),
    ArrowRight: point(1, 0),
    ArrowUp: point(0, -1),
    ArrowDown: point(0, 1),
}

const initialState = {
    grid: {width:25, height: 15}, //stosuje taką siatkę ze względu na wymiar diva nadany w css (kwadracik powinien byc 50x50) Snake ma być "duży"
    snake: [point(0, 0)], //chce aby wąż znajdował się mniej wiecej na środku
    snakeColor: '#fff234',
    snakeLength: 20,
    fruit: point (10,5),
    fruitColor: '#ff00fa',
    move: DIRECTIONS.ArrowRight,
};

let state = R.clone(initialState);

const setColor = (ctx, color) => (ctx.fillStyle = color);

const drawPoint = (ctx, {x, y}, {width, height}) =>
ctx.fillRect (x * widht, y *height, width, height);

const setDirection = (direction) => (state) =>
({
    ...state,
    move: DIRECTIONS[direction]
});

const edge = (value, range) => (value < 0 ? range : value % range);

const random = (range) => Math.floor(Math.random() * range);

const setTail = ({snake, snakeLength}) =>
    R.drop(Math.abs(
        snake.length > snakeLength
        ? snake.length - snakeLength
        : 0
    ), snake);

const draw = (ctx, canvas, {fruitColor, snakeColor, fruit, snake, grid }) => {
    ctx.clearRect(0,0, canvas.width, canvas.height);

    setColor(ctx, fruitColor);
    drawPoint(ctx, fruit, grid);

    setColor(ctx, snakeColor);
    snake.forEach((point) => drawPoint(ctx, point, grid));
};

const nextStep = ({snake, move, grid}) =>
    point(
        edge(R.last(snake).x + move.x, grid.width),
        edge(R.last(snake).y + move.y, grid.height),
    );

const nextSnake = (state) =>  //TUTAJ DODAJ OPCJE ZJADANIA SERDUSZKA
    R.find(R.equals(nextStep(state)))(state.snake)
    ?{
        ...state,
        snake: [point(5,5)],
        snakeLength: 5
    }
    :{
        ...state,
        snake: [...setTail(state), nextStep(state)]
    };

const nextApple = (state) => 
    R.equals(nextStep(state), state.fruit) 
    ?{
        ...state,
        fruit: point(random(state.grid.width), random(state.grid.height)),
        snakeLength: state.snakeLength +1
    }
    :state;

const nextState = (state) => {
    return R.pipe(nexyApple, nextSnake)(state);
};

//Start gry

setInterval(()=>{
    draw(ctx, canvas, state);
    state = nextState(state);
},50);

document.addEventListener('keydown', ({key: direction})=>{
    state = setDirection(direction)(state);
});