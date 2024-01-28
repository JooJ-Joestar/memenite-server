import { Room, Client } from "@colyseus/core";
import { MyRoomState } from "./schema/MyRoomState";
import { Player } from "../models/Player";
import * as PlayerAttributes from "../types/PlayerAttributes";
import { type } from "@colyseus/schema";

export class MyRoom extends Room<MyRoomState> {
    static MAX_CLIENTS = 32;
    static PHASE_TIMES = {
        // 1: 10,
        // 2: 60,
        // 3: 15
        1: 1,
        2: 999,
        3: 3
    }

    public qty_connected: number = 0;
    public room_ready: boolean = false;

    @type("number") timer: number = 0;
    // 1: Load
    // 2: Play
    // 3: Results
    @type("number") phase: number = 1;

    onCreate(options: any) {
        this.setState(new MyRoomState());

        if (this.room_ready === false) {
            this.room_ready = true;
            this.phase = 1;
            this.timer = MyRoom.PHASE_TIMES[this.phase];
            this.executeTimer();
        }

        this.onMessage("updatePosition", (client, data) => {
            const player = this.state.players.get(client.sessionId);
            player.x = data.x;
            player.y = data.y;
            player.z = data.z;
            player.x_movement = data.x_movement;
            player.z_movement = data.z_movement;
        });

        this.onMessage("update_nickname", (client, data) => {
            console.log(client.sessionId + " updated nickname to " + data.nickname);
            const player = this.state.players.get(client.sessionId);
            player.nickname = data.nickname;
            player.character = data.character;

            this.broadcast("nickname_updated", {
                    sessionId: client.sessionId,
                    nickname: player.nickname,
                    character: player.character
                },
                {except: client}
            );
        });

        this.onMessage("player_fired", (client, data) => {
            this.broadcast("player_fired", {
                    sessionId: client.sessionId,
                    data: data
                },
                {except: client}
            );
        });

        this.onMessage("player_scored_hit", (client, data) => {
            this.broadcast("player_scored_hit", {
                    sessionId: client.sessionId,
                    data: data
                },
                {except: client}
            );
        });

        this.onMessage("player_died", (client, data) => {
            const victim = this.state.players.get(client.sessionId);
            victim.deaths++;
            const killer = this.state.players.get(data.killer);
            killer.kills++;
            this.broadcast("player_died", {
                    sessionId: client.sessionId,
                    data: data
                },
                {except: client}
            );
        });
    }

    executeTimer (): any {
        if (this.room_ready === false) return;
        setTimeout(() => {
            this.timer--;
            if (this.timer == 0) {
                this.phase = (this.phase % 3) + 1;
                this.timer = MyRoom.PHASE_TIMES[this.phase];

                // If first phase was activated again, respawn everyone.
                if (this.phase === 1) {
                    this.state.players.forEach(player => {
                        player.respawn();
                    });
                }
                console.log("Phase: " + this.phase);
            }
            // console.log(this.timer);
            this.executeTimer();
        }, 1000);
        this.broadcast("timer", {timer: this.timer, phase: this.phase});
    }

    onJoin(client: Client, options: any) {
        this.qty_connected++;

        // console.log(client);
        console.log(client.sessionId, "joined!");

        // create Player instance
        const player = new Player();

        if (this.qty_connected % 2 == 1) {
            player.setAttributes(PlayerAttributes.kek_options);
        } else {
            player.setAttributes(PlayerAttributes.husband_options);
        }

        // place player in the map of players by its sessionId
        // (client.sessionId is unique per connection!)
        this.state.players.set(client.sessionId, player);
        player.ready = true;
    }

    onLeave(client: Client, consented: boolean) {
        console.log(client.sessionId, "left!");

        this.state.players.delete(client.sessionId);
        this.qty_connected--;

        this.broadcast("player_left", {sessionId: client.sessionId});
    }

    onDispose() {
        console.log("room", this.roomId, "disposing...");
        this.room_ready = false;
    }

}
