import { MapSchema, Schema, Context, type } from "@colyseus/schema";
import * as PlayerAttributes from '../types/PlayerAttributes';

export class Player extends Schema {
    @type("number") x: number;
    @type("number") y: number;
    @type("number") z: number;

    @type("string") character: string;
    @type("string") nickname: string = "Noname";
    @type("string") session_id: string;
    @type("boolean") ready: boolean = false;

    setAttributes (player_attributes: PlayerAttributes.PlayerAttributes) {
        this.character = player_attributes.character;
        this.x = player_attributes.position.x;
        this.y = player_attributes.position.y;
        this.z = player_attributes.position.z;
    }
}