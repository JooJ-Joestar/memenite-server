import { MapSchema, Schema, Context, type } from "@colyseus/schema";

export class Player extends Schema {
    @type("number") x: number;
    @type("number") y: number;
    @type("number") z: number;
}

export class MyRoomState extends Schema {
    @type("string") mySynchronizedProperty: string = "Hello world";

    @type({ map: Player }) players = new MapSchema<Player>();

}