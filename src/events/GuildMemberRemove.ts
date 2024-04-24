import {Colors, EmbedBuilder, Events } from 'discord.js'
import Event from '../templates/Event.js'
import { connection } from '../database/connect.js'
import config from '../config.json'  assert { type: "json" };


export default new Event({
    name: Events.GuildMemberRemove,
    async execute(interaction): Promise<void> {

        if (config.usedatabase.valueOf() === false) return

        if (interaction.user.id != interaction.client.user?.id) return

        try{
            connection.query(`DELETE FROM moon_channel WHERE guildid = '${interaction.guild.id}'`)
        }catch(err){
        }

        
        

    }

})