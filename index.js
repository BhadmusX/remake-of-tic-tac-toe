const resetBtn = document.querySelector(".reset");
const startbtn = document.querySelector(".start");
const result = document.querySelector(".results");
const dialog = document.querySelector("dialog");
const player1name = document.querySelector(".player1name");
const player2name = document.querySelector(".player2name");
const turn = document.querySelector(".result")

let player1;
let player2;

const gameBoard = (function () {
    let board = ["", "", "", "", "", "", "", "", ""];

    let reset = () => { 
       board =  ["", "", "", "", "", "", "", "", ""];
        console.log("The board has been resetted.")};

    const placeMark = (index, playermarker) => {
        if(board[index] === ""){
            board[index] = playermarker;
            return true;
        }
        return false;
    }

    return{
        getBoard: () => board, reset, placeMark
    };
})();

const player = (name, marker) => {
    return{name, marker};
};
startbtn.addEventListener("click", () => {

let p1name = document.querySelector(".player1name");
let p2name = document.querySelector(".player2name");

if(!p1name.value)
    p1name.value = "player1";
if(!p2name.value)
    p2name.value = "player2"


 player1 = player(p1name.value, "X");
 player2 = player(p2name.value, "O");

p1name.value = "";
p2name.value = "";

gameController.setplayers(player1, player2);
displayController.render();


});

const gameController = (function () {

    gameOver = false;

let activeplayer;

    const setplayers = (p1, p2) => {
        player1 = p1;
        player2 = p2;
        activeplayer = player1;
    }
     

    let isWinCondition = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];

    let switchPlayer = () => {
        activeplayer = activeplayer === player1 ? player2 : player1;
    }

    const playRound = (index) => {
        
    if(gameOver) {
        return;
    }
        if(gameBoard.getBoard()[index] === ""){
            const success = gameBoard.placeMark(index, gameController.getactiveplayer().marker)
            turn.textContent = `marking cell ${index} for ${gameController.getactiveplayer().name}..`;

            if(success){
               let currentBoard = gameBoard.getBoard();
              const isWin = isWinCondition.some(condition => {
                const [a, b, c] = condition;
               return(
                currentBoard[a] !== "" &&
                currentBoard[a] === currentBoard[b]&&
                currentBoard[a] === currentBoard[c]
               );
               });
            const isTie = currentBoard.every(cell => cell !== "" && !isWin
            )
            if(isWin){
                result.textContent = "";
                displayController.showmodal(activeplayer.name);
                 document.querySelector(".results").textContent = `Congratulations, ${activeplayer.name} Wins`;
                 gameOver = true;
                 return;
                
            } else if (isTie) {
                result.textContent = "";
                document.querySelector(".results").textContent = `It's a Tie!!`;
               gameOver = true;
               return;
            }
               };
               displayController.render();
            switchPlayer();
            return;
        }else{
            console.log("this cell is taken")
        }
        
    }

    const resetGame = () => {
        gameBoard.reset();
        gameOver = false;
        activeplayer = player1;
    };


    return{
        getactiveplayer: () => activeplayer, getGameOver: () => gameOver, switchPlayer, playRound, setplayers, resetGame
    }

})();
const displayController = (function () {
    const squares = document.querySelectorAll(".square");

    const render = () => {
        squares.forEach((square) => {
        const squareindex = square.dataset.index;
        const valueInArray = gameBoard.getBoard()[squareindex];
        square.textContent = valueInArray;

         square.classList.remove("x-player", "o-player");
        
        if(valueInArray === "X") {
            square.classList.add("x-player");
        } else if(valueInArray === "O") {
            square.classList.add("o-player");
        }  
        });
    };
    squares.forEach((square) => {
        square.addEventListener("click",() =>{
            const getindex = square.dataset.index;
            gameController.playRound(getindex);
            render();
        })

    })

    resetBtn.addEventListener("click", () => {
        result.textContent = "";
        gameBoard.reset();
        gameController.resetGame();
        displayController.render();
    });

    const showmodal = (string) => {
        dialog.showModal();
    }

    const hidemodal = () => {
        dialog.close();
        gameController.resetGame();
    }

    const playagain =  document.querySelector(".playagain");
    playagain.addEventListener("click", () => {
        hidemodal();
        gameBoard.reset();
        gameOver = false;
        render();
    })

    return{
        render, showmodal, hidemodal
    }
})();