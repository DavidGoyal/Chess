import { WebSocket } from "ws";
import { Chess } from "chess.js";
import { GAME_OVER, INIT_GAME, MOVE } from "../constants/messages";

export class Game {
	public player1: WebSocket;
	public player2: WebSocket;
	public board: Chess;
	private startTime: Date;
	private moveCount: number;

	constructor(player1: WebSocket, player2: WebSocket) {
		this.player1 = player1;
		this.player2 = player2;
		this.board = new Chess();
		this.startTime = new Date();
		this.moveCount = 0;

		this.player1.send(
			JSON.stringify({
				type: INIT_GAME,
				payload: {
					color: "white",
				},
			})
		);
		this.player2.send(
			JSON.stringify({
				type: INIT_GAME,
				payload: {
					color: "black",
				},
			})
		);
	}

	addMove(socket: WebSocket, move: { from: string; to: string }) {
		if (this.moveCount % 2 === 0 && socket !== this.player1) {
			return;
		} else if (this.moveCount % 2 === 1 && socket !== this.player2) {
			return;
		}

		try {
			this.board.move(move);
			this.moveCount++;
		} catch (e) {
			console.log(e);
		}

		if (this.board.isGameOver()) {
			this.player1.emit(
				JSON.stringify({
					type: GAME_OVER,
					payload: {
						winner: this.board.turn() === "w" ? "black" : "white",
					},
				})
			);

			this.player2.emit(
				JSON.stringify({
					type: GAME_OVER,
					payload: {
						winner: this.board.turn() === "w" ? "black" : "white",
					},
				})
			);
		}

		this.player2.send(
			JSON.stringify({
				type: MOVE,
				move,
			})
		);
		this.player1.send(
			JSON.stringify({
				type: MOVE,
				move,
			})
		);
	}
}
