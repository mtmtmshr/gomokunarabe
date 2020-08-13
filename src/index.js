import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
    <button
      className="square"
      onClick = {props.onClick}>
      {props.value}
    </button>
  );
}

function calculateWinner(squares) {
  const row_size = 19;
  const col_size = 19;
  let k;
  for (let i = 0; i < row_size; i++) {
    for (let j = 0; j < col_size; j++) {
      if ( squares[i*col_size+j] ) {
        // 横列
        for ( k = 1; k < 5 && j+k <= col_size ; k++ ) {
          if ( squares[i*col_size+j] !== squares[i*col_size+j+k] ) {
            break;
          }
        }
        if ( k === 5 ) {
          return squares[i*col_size+j];
        }

        // 縦列
        for ( k = 1; k < 5 && i+k <= row_size; k++ ) {
          if ( squares[i*col_size+j] !== squares[(i+k)*col_size+j] ) {
            break;
          }
        }
        if ( k === 5 ) {
          return squares[i*col_size+j];
        }

        // 右下斜め
        for ( k = 1; k < 5 && i+k <= row_size && j+k <= col_size; k++ ) {
          if ( squares[i*col_size+j] !== squares[(i+k)*col_size+j+k] ) {
            break;
          }
        }
        if ( k === 5 ) {
          return squares[i*col_size+j];
        }

        // 左下斜め
        for ( k = 1; k < 5 && i+k <= row_size && j-k >= 0; k++ ) {
          if ( squares[i*col_size+j] !== squares[(i+k)*col_size+j-k] ) {
            break;
          }
        }
        if ( k === 5 ) {
          return squares[i*col_size+j];
        }
      }
    }
  }
  return null;
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    const items = [];
    const row_size = 19;
    const col_size = 19;
    for (let i = 0; i < row_size; i++) {
      const rows = [];
      for (let j = 0; j < col_size; j++) {
        let text = <span className="board-col">{this.renderSquare(i*col_size+j)}</span>
        rows.push(
          text
        )
      }
      items.push(<div className="board-row">{rows}</div>)
    }
    return (
      <div>
        {items}
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
      }],
      stepNumber: 0,
      xIsNext: true,
    }
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length-1]
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    if (this.state.xIsNext) {
      squares[i] = "⚫️";
    } else {
      squares[i] = "⚪️";
    }
    this.setState({
      history: history.concat([{
        squares: squares,
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    const moves = history.map((step, move) => {
      const desc = move ?
        'Go to move #' + move :
        'Go to game start';
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>
            {desc}
          </button>
        </li>
      );
    });
    let status;
    if (winner) {
      status = "Winner: " + winner;
    } else {
      if (this.state.xIsNext) {
        status = 'Next player: ⚫️';
      } else {
        status = 'Next player: ⚪️';
      }
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{ status }</div>
          <ol>{ moves }</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
