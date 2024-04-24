import { Colors, EmbedBuilder, Events } from 'discord.js'
import Event from '../templates/Event.js'
import { connection } from '../database/connect.js'
import config from '../config.json' assert { type: "json" };

export default new Event({
    name: Events.ChannelDelete,
    async execute(channel): Promise<void> {
        if (config.usedatabase.valueOf() === true) {
            const [result] = await connection.promise().query(`SELECT * FROM moon_guild WHERE channelid = '${channel.id}'`)
            if (result instanceof Array && result.length === 0) return
            if (channel.id !== (result as any)[0].channelid) return
            connection.query(`DELETE FROM moon_guild WHERE channelid = '${channel.id}'`)
            const owner = await channel.guild.fetchOwner()
            const embed = new EmbedBuilder()
                .setTitle('Informations sur Moon Stats')
                .setDescription('Le canal d\'origine a été supprimé !')
                .setColor(Colors.Red)
                .addFields(
                    { name: 'Pour recréer un canal, veuillez exécuter', value: `/setup` },
                )
                .setTimestamp()
                .setFooter({
                    text: 'Propulsé par © Sulfuris Team',
                    iconURL: config.ImageURL ?? undefined,
                })


            await owner?.send({ embeds: [embed] }).catch(() => null)
        }
    }

})
