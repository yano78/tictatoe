import * as React from "react";
import Board from "./components/Board";
import './Game.css';

function calculateWinner(squares) {
	const lines = [
		[0, 1, 2],
		[3, 4, 5],
		[6, 7, 8],
		[0, 3, 6],
		[1, 4, 7],
		[2, 5, 8],
		[0, 4, 8],
		[2, 4, 6],
	];
	for (let i = 0; i < lines.length; i++) {
		const [a, b, c] = lines[i];
		if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
			return {
				winner: squares[a],
				winnerSquares: lines[i],
			};
		}
	}
	return {winner: null, winnerSquares: null};
}

function getLocation(i) {
	const locations = {
		0: '1, 1',
		1: '1, 2',
		2: '1, 3',
		3: '2, 1',
		4: '2, 2',
		5: '2, 3',
		6: '3, 1',
		7: '3, 2',
		8: '3, 3',
	}

	return locations[i];
}

class Game extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			history: [{
				squares: Array(9).fill(null)
			}],
			stepNumber: 0,
			xIsNext: true
		};
	}

	handleClick(i) {
		const history = this.state.history.slice(0, this.state.stepNumber + 1);
		const current = history[history.length - 1];
		const squares = current.squares.slice();

		if (calculateWinner(squares).winner || squares[i]) {
			return;
		}
		squares[i] = this.state.xIsNext ? 'X' : 'O';
		this.setState({
			history: history.concat([{
				squares: squares,
				location: getLocation(i)
			}]),
			stepNumber: history.length,
			xIsNext: !this.state.xIsNext,
		});
	}

	jumpTo(step) {
		this.setState({
			stepNumber: step,
			xIsNext: step % 2 === 0,
		});
	}

	render() {
		const history = this.state.history;
		const current = history[this.state.stepNumber];
		const {winner, winnerSquares} = calculateWinner(current.squares);

		const moves = history.map((step, move) => {
			const desc = move ?
				`Go to move #${move} (${step.location})`:
				'Go to game start';
			const buttonClass = move === this.state.stepNumber ? 'current-state' : '';

			return (
				<li key={move}>
					<button className={`${buttonClass} step-button`} onClick={() => this.jumpTo(move)}>{desc}</button>
				</li>
			);
		});

		let status;
		if (winner) {
			status = 'Winner: ' + winner;
		} else if (history.length === 10) {
			status = 'Draw. No winner.'
		} else {
			status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
		}

		return (
			<div className="game">
				<div className="game-board">
					<Board
						squares={current.squares}
						winnerSquares = {winnerSquares}
						onClick={(i) => this.handleClick(i)}
					/>
				</div>
				<div className="game-info">
					<div>{status}</div>
					<ol>{moves}</ol>
				</div>
			</div>
		);
	}
}

export default Game;
