import * as React from "react";
import Board from "./components/Board";
import helperFunctions from "./components/helper-functions";
import './Game.css';

class Game extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			history: [{
				squares: Array(9).fill(null)
			}],
			currentStep: 0,
			xIsNext: true
		};
	}

	handleClick(i) {
		const history = this.state.history.slice(0, this.state.currentStep + 1);
		const current = history[history.length - 1];
		const squares = current.squares.slice();

		if (helperFunctions.calculateWinner(squares).winner || squares[i]) {
			return;
		}
		squares[i] = this.state.xIsNext ? 'X' : 'O';
		this.setState({
			history: history.concat([{
				squares: squares,
				location: helperFunctions.getLocation(i),
				stepNumber: history.length,
			}]),
			currentStep: history.length,
			xIsNext: !this.state.xIsNext,
		});
	}

	jumpTo(step) {
		this.setState({
			currentStep: step,
			xIsNext: step % 2 === 0,
		});
	}

	render() {
		const history = this.state.history;
		const current = history[this.state.currentStep];
		const {winner, winnerSquares} = helperFunctions.calculateWinner(current.squares);

		const moves = history.map((step, move) => {
			const desc = step.stepNumber ?
				`Go to move #${step.stepNumber} (${step.location})`:
				'Go to game start';
			const buttonClass = move === this.state.currentStep ? 'current-state' : '';

			return (
				<li key={step.stepNumber}>
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
					<button onClick={() => this.sortMoves()}>Sort moves</button>
					<ol>{moves}</ol>
				</div>
			</div>
		);
	}

	sortMoves() {
		this.setState({
			history: this.state.history.reverse(),
		});
	}
}

export default Game;
