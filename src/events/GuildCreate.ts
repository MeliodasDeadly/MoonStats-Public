import { ActionRowBuilder, BaseInteraction, ButtonBuilder, ButtonStyle, ChannelType, Colors, Embed, EmbedBuilder, Events, Guild, PermissionFlagsBits } from 'discord.js'
import Event from '../templates/Event.js'
import config from '../config.json'  assert { type: "json" };

export default new Event({

    name: Events.GuildCreate,	
    async execute(guild: Guild): Promise<void> {
            const Embed = new EmbedBuilder()
            .setAuthor({
                name: client.user?.username ?? 'MoonStats',
                iconURL: await client.user?.avatarURL({forceStatic: true}) ?? undefined,
            })
            .setDescription(`Merci de m'avoir ajouté à votre serveur !`)
            .setColor(Colors.Blue)
            .addFields(
                { name: '🔧 Configuration', value: `Si vous voulez commencer à utiliser ${client.user?.username ?? 'MoonStats'}, vous devez faire </setup:1155283327645917196> !`  },
                { name: '❤ Créateur', value: `Ce bot a été créé par <@!${config.OwnerID}>`},
            )
            .setTimestamp()
            .setFooter({
                text: 'Propulsé par © Sulfuris Team',
                iconURL: config.ImageURL ?? undefined,
            })

            const link = new ButtonBuilder()
            .setEmoji('🔗')
            .setLabel('Rejoignez notre Discord')
            .setStyle(ButtonStyle.Link)
            .setURL(config.BaseURL ?? 'https://discord.gg/8QJ2QyJ')

            const row = await new ActionRowBuilder()
            .addComponents(link)

            const channel = await guild?.channels.create(
                {
                    name: client.user?.username ?? 'moon-stats',
                    type: ChannelType.GuildText,
                    permissionOverwrites: [
                         {
                            id: guild.id,
                            deny: [PermissionFlagsBits.SendMessages, PermissionFlagsBits.ViewChannel],
                         },
                         {
                            id: client.user?.id ?? '',
                            allow: [PermissionFlagsBits.SendMessages, PermissionFlagsBits.ViewChannel],
                         }
                    ]
                }
            ).catch(() => null)

            // @ts-ignore
            await channel?.send({ embeds: [Embed], components: [row] })
        
    }
    
})
