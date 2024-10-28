import { WebSocket } from "ws";
import { INIT_GAME } from "../constants/messages";
import { Game } from "./Game";

export class GameManager {
	private game: Game[];
	private pendingUser: WebSocket | null;
	private users: WebSocket[];

	constructor() {
		this.game = [];
		this.pendingUser = null;
		this.users = [];
	}

	addUser(socket: WebSocket) {
		this.users.push(socket);
		this.initHandler(socket);
	}

	removeUser(socket: WebSocket) {
		this.users = this.users.filter((user) => user !== socket);
	}

	initHandler(socket: WebSocket) {
		socket.on("message", (data) => {
			const message = JSON.parse(data.toString());

			if (message.type === INIT_GAME) {
				if (this.pendingUser) {
					const game = new Game(socket, this.pendingUser);
					this.pendingUser = null;
					this.game.push(game);
				} else {
					this.pendingUser = socket;
				}
			} else if (message.type === "move") {
				const game = this.game.find(
					(game) => game.player1 === socket || game.player2 === socket
				);

				if (game) {
					game.addMove(socket, message.move);
				}
			}
		});
	}
}
