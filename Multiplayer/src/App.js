import { useState, useEffect } from 'react';
import {io } from 'socket.io-client';
import './App.css';
import { Square } from './Square/Square';
const socket = io('http://localhost:3000',{
  autoConnect:true,
});

const renderFrom =[
  [1,2,3],
  [4,5,6],
  [7,8,9]
]

function App() {
 
    const [gameState, setGameState]=useState(renderFrom);
    const[currentPlayer, setCurrentPlayer]= useState('circle');
    const [finishedState, setFinishedState] =useState(false);
    const [finishedArrayState, setFinishedArrayState]= useState([]);
    const[playOnline, setPlayOnline]=useState(false); 
    const [socket, setSocket] =useState(null);



    const checkWinner =()=>{
      // row dyanamic
      for (let row =0; row<gameState.length; row++){
        if(gameState[row][0] === gameState[row][1] && gameState[row][1] === gameState[row][2]){
          setFinishedArrayState([row * 3 + 0, row * 3 + 1 , row * 3 +2])
          return gameState[row][0];
        }
      }
     //column dynamic
      for (let col =0; col<gameState.length; col++){
        if(gameState[0][col] === gameState[1][col] && gameState[1][col] === gameState[2][col]){
          setFinishedArrayState([0 * 3 + col, 1 * 3 + col,2 * 3 + col]);
          return gameState[0][col];
        }
      }

      if (
        gameState[0][0] === gameState[1][1] &&
        gameState[1][1] === gameState[2][2]
      ) {
        return gameState[0][0];
      }
  
      if (
        gameState[0][2] === gameState[1][1] &&
        gameState[1][1] === gameState[2][0]
      ) {
        return gameState[0][2];
      }
  
      const isDrawMatch = gameState.flat().every((e) => {
        if (e === "circle" || e === "cross") return true;
      });
  
      if (isDrawMatch) return 'draw';
  
      return null; 

    }

    useEffect(() => {
      const winner = checkWinner();
      if (winner) {
        setFinishedState(winner);
      }
    }, [gameState]);
   
   socket?.on('connect',function(){
    setPlayOnline(true);
   })


function playOnlineCLick(){
  const newSocket =io("http://localhost:3000",{
    autoConnect:true,
  });
  setSocket(newSocket);
}


    if (!playOnline){
      return <div className='main-div'>
        <button onClick={playOnlineCLick} className='playOnline'>Play Online</button>
      </div>
    }


  return (
    <div className="App">
   <div className="main-div">
   <div>
        <div className="move-detection">
          <div className="left">Circle</div>
          <div className="right">Cross</div>
        </div>
      </div>
    <div >
      <h1 className="game-heading water-background">Tic Tac Toe</h1>
      <div className="square-wrapper">
      {
        gameState.map((arr, rowIndex) =>
          arr.map((e, colIndex)=>{
            return <Square
            finishedArrayState={finishedArrayState}
             finishedState={finishedState}
            currentPlayer={currentPlayer}
            setCurrentPlayer={setCurrentPlayer}
            setGameState={setGameState}
             id ={rowIndex * 3 + colIndex} 
             key={rowIndex * 3 + colIndex}/>;
          })
        )
      }
        </div> 
        { finishedState && finishedState !== 'draw' && (<h3 className='finished-state'>{finishedState} won the game</h3>) }
        { finishedState && finishedState === 'draw' && (<h3 className='finished-state'> Draw dude! </h3>) }
        
    </div>
   </div>
    </div>
  );
}

export default App;
