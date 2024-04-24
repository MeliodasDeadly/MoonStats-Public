import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    EmbedBuilder,
    Guild,
    PermissionFlagsBits,
    SlashCommandBuilder
} from 'discord.js'
import ApplicationCommand from '../templates/ApplicationCommand.js'
import config from '../config.json' assert { type: 'json' }
import { connection } from '../database/connect.js'
import { Linked } from '../server/linkedserver.js'
export default new ApplicationCommand({
    data: new SlashCommandBuilder()
        .setName('ban')
        .setDescription('Bannir un du serveur')
        .addUserOption((option) =>
            option
                .setName('user')
                .setDescription("L'utilisateur à bannir")
                .setRequired(true)
        )
        .addStringOption((option) =>
            option
                .setName('reason')
                .setDescription('La raison du bannissement')
                .setRequired(true)
        )
        .addBooleanOption((option) =>
            option
                .setName('all')
                .setDescription("Bannir l'utilisateur de tous les serveurs")
                .setRequired(false)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(interaction): Promise<void> {
        const user = interaction.options.getUser('user')
        const userreason = interaction.options.getString('reason')
        const reason = `${interaction.user.username} (@${interaction.user.tag}): ${userreason}`

        const all = interaction.options.getBoolean('all')

        if (!user) {
            await interaction.reply({
                content: 'Vous devez spécifier un utilisateur à bannir',
                ephemeral: true
            })
            return
        }
        if (!reason) {
            await interaction.reply({
                content: 'Vous devez spécifier une raison pour bannir',
                ephemeral: true
            })
            return
        }
        const banembed = new EmbedBuilder().setDescription(
            `✅: Vous avez banni ${user} du serveur ${interaction.guild?.name} pour ${reason}`
        )
        const bannedembed = new EmbedBuilder().setDescription(
            `Vous avez été banni du serveur ${interaction.guild?.name} pour ${reason}`
        )

        if (all) {
            if (config.usedatabase.valueOf() == true) {
                if (
                    config.AdminID.values
                        .toString()
                        .includes(interaction.user.id) ||
                    config.OwnerID.valueOf() == interaction.user.id
                ) {
                    banembed.setDescription(
                        `Vous avez banni ${user.globalName} de tous les serveurs pour ${reason}`
                    )
                    bannedembed.setDescription(
                        `Vous avez été banni de tous les serveurs pour ${reason}`
                    )

                    try {
                        await user?.send({ embeds: [bannedembed] })
                    } catch (err) { }
                    interaction.guild?.members.ban(user, { reason: reason })

                    for (const guildid of Linked) {
                        const guild = interaction.client.guilds.cache.get(
                            guildid
                        ) as Guild
                        if (!guild) continue
                        guild.members.ban(user.id, { reason: reason })
                    }



                    // #TODO: Ajouter le support de la base de données
                    await interaction.reply({
                        embeds: [banembed],
                        ephemeral: true
                    })
                }
            } else {
                interaction.reply({
                    content:
                        'Cette option est désactivée car la base de données est désactivée, veuillez utiliser `/ban` sans cette option',
                    ephemeral: true
                })
            }
        } else {
            await interaction.reply({ embeds: [banembed], ephemeral: true })
            try {
                await user?.send({ embeds: [bannedembed] })
            } catch (err) { }
            interaction.guild?.members.ban(user, { reason: reason })
        }
    }
})
