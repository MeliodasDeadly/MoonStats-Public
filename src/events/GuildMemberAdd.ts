import { Colors, EmbedBuilder, Events, Guild, GuildMember, TextChannel } from 'discord.js'
import Event from '../templates/Event.js'
import { connection } from '../database/connect.js'
import config from '../config.json' assert { type: 'json' }
import { addGuild } from '../database/guild.js'

export default new Event({
    name: Events.GuildMemberAdd,
    async execute(interaction): Promise<void> {
        if (config.usedatabase.valueOf() === false) return

        const member = interaction as GuildMember
        const guild = member.guild
        const checker = await addGuild({
            guildid: guild.id,
            interaction: interaction
        })
        
        if (checker === false) return
        const [guilds] = await connection
            .promise()
            .query(
                `SELECT * FROM moon_guild WHERE guildid = '${interaction.guild?.id}'`
            )
        const guildData = guilds as any[]
        const welcome = guildData[0].welcomeid

        if (welcome === null) return

        const channel = guild.channels.cache.get(welcome) as TextChannel
        if (channel === undefined) return

        const embed = new EmbedBuilder()
            .setColor(Colors.Green)
            .setTitle('Bienvenue !')
            .setURL(channel.url)
            .setDescription(
                `Bienvenue sur ${guild.name} <@${member?.user.id}>! n'oublie pas de lire le règlement! \n Nous espèrons que tu te plairas ici! \n\n Tu es le ${guild.memberCount}ème membre!`
            ).setImage('https://media.discordapp.net/attachments/1097257145336078539/1098713530250821632/image_2.png?ex=65fc9eb6&is=65ea29b6&hm=edb813d17f5d77a5c09ccf817d8c155de89efc05df468fb9930790a4bed2833c&=&format=webp&quality=lossless&width=1193&height=671')
        
        channel.send({ embeds: [embed] })

    }
})
