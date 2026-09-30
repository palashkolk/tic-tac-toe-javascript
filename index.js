// Gameboard
// Players
// Gameflow

// What we need
// - Two Players
// - A board with lines/box
// - Two symbols X and O
// - Player 1 markes and then player 2 and then again player 1
// - Display board after each player's turn
// - Winners if: three marks align horizontally, vertically or diagonally
// - Game draws if no Winners
// - Game stops if winner or no vacant place on board
// - Declare winner or draw after game ends.
// - store score of winner as +1 for each win and declare the status


// Player object==> name, mark, score, play_turn, 

const createPlayer = (name, marker)=> {
    return {name, marker};
}

const gameboard = (function(){
    let board =["","","","","","","","",""];

    const getBoard = ()=> board;

    const placeMarker =(index, marker)=>{
        if (board[index]===""){
            board[index]=marker;
            return true
        }
        return false;
    }

    const resetBoard=()=>{
        board = ["","","","","","","","",""];
    }
    return {getBoard, placeMarker, resetBoard}

})();
const gameController = (function(){
    const players = [createPlayer("Player 1", "X"), createPlayer("Player 2", "O")];

    let activePlayerIndex = 0;
    let isGameOver = false;

    const getActivePlayer = ()=> players[activePlayerIndex];
    const checkGameOverStatus = ()=> isGameOver;

    const switchTurn = ()=>{
        activePlayerIndex = activePlayerIndex===0?1:0;
    };

    const winConditions = [
        [0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]
    ];

    const checkWinOrTie = ()=>{
        const currentBoard = gameboard.getBoard();

        for (let condition of winConditions){
            const [a,b,c] = condition;
            if (currentBoard[a] && currentBoard[a] === currentBoard[b] && currentBoard[a] === currentBoard[c]) {
                isGameOver = true; 
                return "win";
            }
        }
        if (!currentBoard.includes("")){
            isGameOver=true;
            return "tie";
        }
        return "continue";
    };
    const playRound = (index)=>{
        if (isGameOver) return;

        const currentMarker = getActivePlayer().marker;
        const moveSuccessful = gameboard.placeMarker(index, currentMarker)

        if (moveSuccessful){
            const status = checkWinOrTie();
            if (status==="win"){
                displayController.updateMessage(`${getActivePlayer().name} wins!`);
            }else if (status==="tie"){
                displayController.updateMessage(`$It is a tie!`);
            }else{
                switchTurn();
                displayController.updateMessage(`${getActivePlayer().name}'s turn...`);
            }
        }

    }
    const restartGame = ()=>{
        gameboard.resetBoard();
        activePlayerIndex=0;
        isGameOver=false;
    };
    return {playRound, getActivePlayer, restartGame, checkGameOverStatus};

})();


const displayController = (function (){
    const boardDiv = document.querySelector("#gameboard");
    const messageDiv = document.querySelector("#message");
    const restartBtn = document.querySelector("#restart-btn");

    const renderBoard=()=>{
        boardDiv.innerHTML="";
        const currentBoard = gameboard.getBoard();

        currentBoard.forEach((cell, index)=>{
            const cellButton = document.createElement("button");
            cellButton.classList.add("cell");
            cellButton.dataset.index = index;
            cellButton.textContent = cell;

            cellButton.addEventListener("click", handleCellClick);
            boardDiv.appendChild(cellButton);

        })
    }
    const handleCellClick = (e)=> {
        const selectedIndex = e.target.dataset.index;
        if (gameController.checkGameOverStatus()||e.target.textContent !=="") return;
        gameController.playRound(selectedIndex);
        renderBoard();

    };
    const updateMessage = (text) => {
        messageDiv.textContent = text;
    };
    
    restartBtn.addEventListener("click", () => {
        gameController.restartGame();
        renderBoard();
        updateMessage(`${gameController.getActivePlayer().name}'s turn...`);
    });
    
    renderBoard();
    updateMessage(`${gameController.getActivePlayer().name}'s turn...`);
    return { updateMessage };
})();