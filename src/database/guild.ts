import { ChatInputCommandInteraction } from "discord.js";
import { connection } from "./connect.js";

interface Guild {
    guildid: string;
    interaction: ChatInputCommandInteraction;
}

export async function addGuild(props: Guild ) {
    const guildid = props.guildid;
    const interaction = props.interaction;

    const [result] = await connection.promise().query(`SELECT * FROM moon_guild WHERE guildid = '${guildid}'`)

    if (result instanceof Array && result.length > 0) {
        true;
    } else {
        return false;
    }
}

export async function getAllGuild() {
    const [result] = await connection.promise().query(`SELECT * FROM moon_guild`)
   // put the result in a array
    const allGuild = result as any[];
    return allGuild;
}

export async function getAllLinkedGuild(guildid:string){
    const [result] = await connection.promise().query(`SELECT * FROM moon_guild WHERE guildid = '${guildid}'`)
    const allGuild = result as any[];
    let linkedGuild = allGuild[0].linkedguilds;
    linkedGuild = linkedGuild.split(",");
    return linkedGuild;
}