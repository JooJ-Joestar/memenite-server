import { MapSchema, Schema, Context, type } from "@colyseus/schema";
import * as PlayerAttributes from '../types/PlayerAttributes';

export class Player extends Schema {
    @type("number") x: number;
    @type("number") y: number;
    @type("number") z: number;
    
    @type("number") x_movement: number;
    @type("number") z_movement: number;
    
    @type("number") kills: number;
    @type("number") deaths: number;

    @type("string") character: string;
    @type("string") nickname: string = "Noname";
    @type("string") session_id: string;
    @type("boolean") ready: boolean = false;

    setAttributes (player_attributes: PlayerAttributes.PlayerAttributes) {
        this.character = player_attributes.character;
        this.x = player_attributes.position.x;
        this.y = player_attributes.position.y;
        this.z = player_attributes.position.z;
        this.x_movement = 0;
        this.z_movement = 0;
    }

    respawn () {
        this.x = 1 - Math.round(Math.random() * 3);
        this.z = 1 - Math.round(Math.random() * 3);
    }
}