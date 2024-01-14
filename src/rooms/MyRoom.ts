import { Room, Client } from "@colyseus/core";
import { MyRoomState } from "./schema/MyRoomState";
import { Player } from "../models/Player";
import * as PlayerAttributes from "../types/PlayerAttributes";

export class MyRoom extends Room<MyRoomState> {
    maxClients = 12;
    public qty_connected: number = 0;

    onCreate(options: any) {
        this.setState(new MyRoomState());

        this.onMessage("type", (client, message) => {
            //
            // handle "type" message
            //
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
        client.send("player_ready", {
            character: player.character,
            position: {x: player.x, y: player.y, z: player.z}
        });
    }

    onLeave(client: Client, consented: boolean) {
        console.log(client.sessionId, "left!");

        this.state.players.delete(client.sessionId);
        this.qty_connected--;
    }

    onDispose() {
        console.log("room", this.roomId, "disposing...");
    }

}
