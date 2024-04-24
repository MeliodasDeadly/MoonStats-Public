import { Colors, EmbedBuilder, Message, TextChannel } from "discord.js";
import { scpdb } from "./scp.js";
import { RowDataPacket } from "mysql2/promise";
import axios from 'axios';

export function updatescp() {
    scpdb.query('CREATE TABLE IF NOT EXISTS ticketstats (id BIGINT NOT NULL AUTO_INCREMENT, guildid TEXT, channelid TEXT, messageid TEXT, PRIMARY KEY (id))')
}

export async function scpstatsload(){
    const [rows] = await scpdb.promise().query<RowDataPacket[]>('SELECT * FROM ticketstats')
    const [row2] = await scpdb.promise().query<RowDataPacket[]>('SELECT * FROM ticketcount')
    if (rows instanceof Array && rows.length > 0) {
        for (const row of rows) {
            const guild = client.guilds.cache.get(row.guildid)
            if (!guild) continue

            const channel = guild.channels.cache.get(row.channelid)
            if (!channel) continue
            if(channel instanceof TextChannel){
                const message = await channel.messages.fetch(row.messageid).catch(() => {})
                if (!message) continue
                const embed = new EmbedBuilder()
                    .setColor(Colors.Blue)
                    .setTitle('Stats Des Tickets du serveur SCP');

                // https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=5C5FB36AEB7BAB833834B9FC3A472B2A &steamids=${id}
                
                if (row2 instanceof Array && row2.length > 0) {
                    for (const row3 of row2) {
                        const steamid = row3.steamid
                        if (!steamid) continue
                        const ticketcount = row3.ticketcount
                        if (!ticketcount) continue
                        // make a request to the steam api to get the user's name
                        const response = await axios.get(`https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=5C5FB36AEB7BAB833834B9FC3A472B2A&steamids=${steamid}`);
                        const username = response.data.response.players[0].personaname;

                        embed.addFields({
                            name: username,
                            value: `Nombre de Ticket: ${ticketcount}`,
                        })
                    }
                }
                message.edit({ embeds: [embed] })                  
            }

        }
    }

}