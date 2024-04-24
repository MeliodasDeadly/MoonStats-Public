import {
    ChannelType,
    Colors,
    EmbedBuilder,
    Guild,
    InteractionResponse,
    PermissionFlagsBits,
    SlashCommandBuilder,
    TextChannel
} from 'discord.js'
import ApplicationCommand from '../templates/ApplicationCommand.js'
import { connection } from '../database/connect.js'
import config from '../config.json' assert { type: 'json' }
import { update } from '../database/update.js'
import { addGuild } from '../database/guild.js'
import { codeGenerator } from '../tool/tool.js'
import SubCommand from '../templates/SubCommand.js'
import { scpdb } from '../database/scp.js'
import { scpstatsload, updatescp } from '../database/updatescp.js'

export default new ApplicationCommand({
    data: new SlashCommandBuilder()
        .setName('setup')
        .setDescription('Configurer le bot')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addSubcommand((subcommand) =>
            subcommand
                .setName('stats')
                .setDescription('Set-Up le canal de statistiques')
                .addStringOption((option) =>
                    option
                        .setName('nom-du-canal')
                        .setDescription('Le nom du canal')
                        .setRequired(true)
                )
        )
        .addSubcommand((subcommad) =>
            subcommad
                .setName('welcome')
                .setDescription('Configurer le message de bienvenue')
                .addChannelOption((option) =>
                    option
                        .setName('channel')
                        .setDescription('Le canal de bienvenue')
                        .setRequired(true)
                )
        ).addSubcommand((subcommand) =>
            subcommand
                .setName('ticketstats')
                .setDescription('Configurer les statistiques de tickets')
                .addChannelOption((option) =>
                    option
                        .setName('channel')
                        .setDescription('Le canal de statistiques de tickets')
                        .setRequired(true)
                )
        ),

    async execute(interaction): Promise<void> {
        if (config.usedatabase.valueOf() === false) {
            return void interaction.reply({
                content:
                    "La base de données est désactivée, veuillez l'activer dans le fichier config.json",
                ephemeral: true
            })
        }
        const guild = interaction.guild as Guild

        const subcommand = interaction.options.getSubcommand()

        if (subcommand === 'welcome') {
            // get channel
            const channel = interaction.options.getChannel('channel')
            if (!channel || channel.type !== ChannelType.GuildText)
                return void interaction.reply({
                    content: 'Veuillez fournir un canal valide',
                    ephemeral: true
                })

            const checker = await addGuild({
                guildid: guild?.id ?? '',
                interaction
            })

            if (checker === false)
                return void interaction.reply({
                    content: `Vous devez d'abord configurer le bot avec la commande /setup stats`,
                    ephemeral: true
                })
            connection.query(
                `UPDATE moon_guild SET welcomeid = '${channel.id}' WHERE guildid = '${guild?.id}'`
            )
            return void interaction.reply({
                content: `Le canal de bienvenue a été configuré avec succès !`,
                ephemeral: true
            })
        }

        if (subcommand === 'stats') {
            const checker = await addGuild({
                guildid: guild?.id ?? '',
                interaction
            })

            if (checker === false) {
                const option = interaction.options.getString('nom-du-canal')

                const name = await option?.toLowerCase().replace(/ /g, '-')

                const channel = await guild?.channels
                    .create({
                        name: name ?? 'stats',
                        type: ChannelType.GuildText,
                        permissionOverwrites: [
                            {
                                id: guild.id,
                                deny: [
                                    PermissionFlagsBits.SendMessages,
                                    PermissionFlagsBits.CreatePrivateThreads,
                                    PermissionFlagsBits.CreatePublicThreads
                                ],
                                allow: [PermissionFlagsBits.ViewChannel]
                            }
                        ]
                    })
                    .catch(
                        async () =>
                            await interaction.reply({
                                content: `Une erreur s'est produite : Permission manquante :( `,
                                ephemeral: true
                            })
                    )

                const code = guild?.id

                connection.query(
                    `INSERT INTO moon_guild (guildid, guildname, guildicon, guildowner, channelid, specialcode) VALUES ('${guild?.id}', '${guild?.name}', '${guild?.iconURL()}', '${guild?.ownerId}', '${channel?.id}', '${code}')`
                )
                const embed = new EmbedBuilder()
                    .setTitle('Configuration')
                    .setDescription('La configuration a été terminée !')
                    .setColor(Colors.Green)
                    .addFields(
                        { name: 'Canal', value: `<#${channel?.id}>` },
                        { name: 'Code de lien personnalisé', value: `${code}` }
                    )
                    .setTimestamp()
                    .setFooter({
                        text: 'Propulsé par © Sulfuris Team',
                        iconURL: config.ImageURL ?? undefined
                    })

                interaction.reply({ embeds: [embed], ephemeral: true })
            }
        }
        if (subcommand === 'ticketstats') {
            const channel = interaction.options.getChannel('channel') as TextChannel
            if (channel.type !== ChannelType.GuildText) {
                return void interaction.reply({
                    content: 'Le canal doit être un salon texte',
                    ephemeral: true
                })
            }

            const [rows] = await scpdb.promise().query(
                'SELECT * FROM ticketstats WHERE guildid = ?',
                [guild.id]
            )


            const embed = new EmbedBuilder()
                .setColor(Colors.Blue)
                .setTitle('Stats Des Tickets du serveur SCP')

            const message = await channel.send({ embeds: [embed] })
            if (rows instanceof Array && rows.length > 0) {
                scpdb.query('UPDATE ticketstats SET channelid = ?, messageid = ? WHERE guildid = ?', [
                    channel.id,
                    message.id,
                    guild.id
                ])
            } else {
                scpdb.query('INSERT INTO ticketstats (guildid, channelid, messageid) VALUES (?, ?, ?)', [
                    guild.id,
                    channel.id,
                    message.id
                ])
            }

            scpstatsload()

            await interaction.reply({
                content: 'Canal de statistiques de tickets configuré avec succès',
                ephemeral: true
            })
        }
    }
})
