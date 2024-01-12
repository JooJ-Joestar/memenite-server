import { Room, Client } from "@colyseus/core";
import { MyRoomState, Player } from "./schema/MyRoomState";
import * as PlayerAttributes from '../../../src/types/PlayerAttributes';

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

        // place Player at a random position
        // const FLOOR_SIZE = 500;
        // player.x = -(FLOOR_SIZE / 2) + (Math.random() * FLOOR_SIZE);
        // player.y = -1;
        // player.z = -(FLOOR_SIZE / 2) + (Math.random() * FLOOR_SIZE);

        if (this.qty_connected % 2 == 1) {
            client.send("character_selected", "kek");
            player.x = PlayerAttributes.kek_options.position.x;
            player.y = PlayerAttributes.kek_options.position.y;
            player.z =  PlayerAttributes.kek_options.position.z;
        } else {
            client.send("character_selected", "husband");
            player.x = PlayerAttributes.husband_options.position.x;
            player.y = PlayerAttributes.husband_options.position.y;
            player.z =  PlayerAttributes.husband_options.position.z;
        }

        player.x = 6.5,
        player.y = 0.5,
        player.z = -7.5

        // place player in the map of players by its sessionId
        // (client.sessionId is unique per connection!)
        this.state.players.set(client.sessionId, player);

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
