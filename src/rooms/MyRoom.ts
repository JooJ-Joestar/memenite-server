import { Room, Client } from "@colyseus/core";
import { MyRoomState } from "./schema/MyRoomState";
import { Player } from "../models/Player";
import * as PlayerAttributes from "../types/PlayerAttributes";

export class MyRoom extends Room<MyRoomState> {
    maxClients = 32;
    public qty_connected: number = 0;

    onCreate(options: any) {
        this.setState(new MyRoomState());

        this.onMessage("updatePosition", (client, data) => {
            const player = this.state.players.get(client.sessionId);
            player.x = data.x;
            player.y = data.y;
            player.z = data.z;
        });

        this.onMessage("update_nickname", (client, data) => {
            console.log("update_nickname");
            const player = this.state.players.get(client.sessionId);
            player.nickname = data.nickname;

            this.broadcast("nickname_updated", {
                    sessionId: client.sessionId,
                    nickname: player.nickname
                },
                {except: client}
            );
        });
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
        client.send("player_ready", {
            character: player.character,
            position: {x: player.x, y: player.y, z: player.z}
        });
    }

    onLeave(client: Client, consented: boolean) {
        console.log(client.sessionId, "left!");

        this.state.players.delete(client.sessionId);
        this.qty_connected--;

        this.broadcast("player_left", {sessionId: client.sessionId});
    }

    onDispose() {
        console.log("room", this.roomId, "disposing...");
    }

}
