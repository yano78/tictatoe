import React from "react";

function Square(props) {
	return (
		<button className={`${props.squareClass} square`} onClick={props.onClick}>
			{props.value}
		</button>
	);
}

export default Square;
