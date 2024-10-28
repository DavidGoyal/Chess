import { Color, PieceSymbol, Square } from "chess.js";
import { useState } from "react";
import { MOVE } from "../constants/messages";

const ChessBoard = ({
	board,
	socket,
}: {
	board: ({
		square: Square;
		type: PieceSymbol;
		color: Color;
	} | null)[][];
	socket: WebSocket;
}) => {
	const [from, setFrom] = useState<Square | null>(null);

	return (
		<div className="md:h-full rounded-lg md:w-[50%]">
			{board?.map((row, i) => (
				<div key={i} className="flex rounded-lg h-full w-full">
					{row.map((square, j) => {
						const squareRepresentation = (String.fromCharCode(97 + j) +
							(8 - i)) as Square;
						return (
							<div
								onClick={() => {
									if (!from) {
										setFrom(squareRepresentation);
									} else {
										socket.send(
											JSON.stringify({
												type: MOVE,
												move: {
													from,
													to: squareRepresentation,
												},
											})
										);
										setFrom(null);
									}
								}}
								key={j}
								className={`w-16 h-16 flex justify-center items-center text-${
									square?.color === "b" ? "black" : "gray"
								} ${(i + j) % 2 ? "bg-[#81b64cd8]" : "bg-white"}`}
							>
								{square ? square.type : null}
							</div>
						);
					})}
				</div>
			))}
		</div>
	);
};

export default ChessBoard;
