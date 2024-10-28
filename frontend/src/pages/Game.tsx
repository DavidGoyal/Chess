import { useEffect, useState } from "react";
import ChessBoard from "../components/ChessBoard";
import { GAME_OVER, INIT_GAME, MOVE } from "../constants/messages";
import { useSocket } from "../hooks/useSocket";
import { Chess } from "chess.js";

const Game = () => {
	const socket: WebSocket | null = useSocket();
	const [chess, setChess] = useState<Chess | null>(new Chess());
	const [board, setBoard] = useState(chess?.board());
	const [started, setStarted] = useState(false);

	useEffect(() => {
		if (!socket) return;

		socket.onmessage = (event) => {
			const message = JSON.parse(event.data);

			switch (message.type) {
				case INIT_GAME:
					setBoard(chess?.board());
					setStarted(true);
					break;
				case MOVE: {
					const move = message.move;
					console.log(message);

					chess?.move(move);
					setBoard(chess?.board());
					break;
				}
				case GAME_OVER:
					console.log(message.winner);
					break;
			}
		};
	}, [socket]);

	if (!socket) return <div>Connecting...</div>;

	const onPlay = () => {
		socket.send(
			JSON.stringify({
				type: INIT_GAME,
			})
		);
	};

	return (
		<div className="min-h-screen w-screen flex justify-center items-center bg-[#312E2B] p-8">
			<div className="flex w-[70%] justify-between items-center h-[70%] flex-col md:flex-row gap-8">
				<ChessBoard board={board!} socket={socket} />
				<div className="h-full flex flex-col md:w-[40%] items-center gap-8">
					{!started && (
						<button
							className="w-full p-8 bg-[#81B64C] text-white rounded-lg flex justify-center items-center"
							onClick={onPlay}
						>
							Play
						</button>
					)}
				</div>
			</div>
		</div>
	);
};

export default Game;
