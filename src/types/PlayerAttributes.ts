export type PlayerAttributes = {
    character: string,
    position: {
        x: number,
        y: number,
        z: number
    }
};

export const kek_options: PlayerAttributes = {
    character: "kek",
    position: {
        x: -6.5,
        y: 0.5,
        z: 6.5
    }
};

export const husband_options: PlayerAttributes = {
    character: "husband",
    position: {
        x: 7.5,
        y: 0.5,
        z: -6.5
    }
};

// export const wife_options: PlayerAttributes = {
//     position: {
//         x: 6.5,
//         y: 0.5,
//         z: -7.5
//     }
// };