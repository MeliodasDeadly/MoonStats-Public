import { ActionRow, ActionRowBuilder, ButtonBuilder, ButtonStyle, Colors, ComponentType, EmbedBuilder, PermissionFlagsBits, SlashCommandBuilder } from 'discord.js'
import ApplicationCommand from '../templates/ApplicationCommand.js'
import config from '../config.json'  assert { type: "json" };
import { getAllGuild } from '../database/guild.js';



export default new ApplicationCommand({
    data: new SlashCommandBuilder()
        .setName('config')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .setDescription('Affiche toutes les configurations'),
    async execute(interaction): Promise<void> {
        const embed = new EmbedBuilder()
            .setTitle('Configuration de Moon')
            .setDescription('Ceci est le panneau de configuration, ici vous pouvez configurer tous les paramètres du bot.')
            .setColor(Colors.Green)
            .setTimestamp()
            .setFooter({
                text: 'Propulsé par © Sulfuris Team',
                iconURL: config.ImageURL ?? undefined,
            })
        const guildButton = new ButtonBuilder()
            .setCustomId('guild')
            .setLabel('Serveur')
            .setStyle(ButtonStyle.Primary)
        const returnButton = new ButtonBuilder()
            .setCustomId('return')
            .setEmoji('🔙')
            .setDisabled(true)
            .setStyle(ButtonStyle.Secondary)

        const guildembed = new EmbedBuilder()
            .setTitle('Configuration de Moon')
            .setDescription('Ceci est le panneau de configuration, ici vous pouvez configurer tous les paramètres du bot.')
            .setColor(Colors.Green)
            .setTimestamp()
            .setFooter({
                text: 'Propulsé par © Sulfuris Team',
                iconURL: config.ImageURL ?? undefined,
            })

        const row = new ActionRowBuilder()
        row.addComponents(guildButton, returnButton)



        if (config.usedatabase.valueOf() === true) {
            embed.addFields({ name: 'Base de données', value: 'Activée: ✅' })

            const allGuild = await getAllGuild()
            if (allGuild.length === 0) {
                guildembed.addFields({ name: 'Serveur', value: '❌: Aucun serveur trouvé.' })
                guildButton.setDisabled(true)
            }

            for (const guild of allGuild) {
                // obtenir le serveur à partir de l'identifiant
                const guildid = guild.guildid
                const guilds = interaction.client.guilds.cache.get(guildid)
                if (guilds === undefined) continue
                if (guilds.id === interaction.guild?.id) {
                    guildembed.addFields({ name: `${guilds?.name} (**Celui-ci**)`, value: `Propriétaire du serveur: <@!${guilds.ownerId}>\n Synchronisation: ✅` })
                } else {
                    guildembed.addFields({ name: `${guilds?.name}`, value: `Propriétaire du serveur: <@!${guilds.ownerId}> \n Synchronisation: ✅` })
                }
            }

        } else {
            embed.addFields({ name: 'Base de données', value: 'Activée: ❌' })
            guildButton.setDisabled(true)
        }
        embed.addFields({ name: 'Préfixe', value: `Préfixe: ${config.prefix}` })
        embed.addFields({ name: 'Synchronisation', value: `Activée: ✅` })








        // @ts-ignore
        const message = await interaction.reply({ embeds: [embed], ephemeral: true, components: [row], fetchReply: true })

        const CollectorFilter = (interaction: { user: { id: any; }; }) => interaction.user.id === interaction.user.id


        try {
            const Collector = await message.createMessageComponentCollector({ componentType: ComponentType.Button, filter: CollectorFilter, time: 60000 })
            Collector.on('collect', async (interaction) => {
                await interaction.deferUpdate()
                if (interaction.customId === 'guild') {
                    returnButton.setDisabled(false)
                    guildButton.setDisabled(true)
                    // @ts-ignore
                    await interaction.editReply({ embeds: [guildembed], components: [row] })
                } else if (interaction.customId === 'return') {
                    returnButton.setDisabled(true)
                    guildButton.setDisabled(false)

                    // @ts-ignore
                    await interaction.editReply({ embeds: [embed], components: [row] })
                }


            })



        } catch (error) {
            await interaction.deleteReply()
        }
    },

})
