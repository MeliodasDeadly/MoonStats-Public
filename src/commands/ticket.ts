import {
    ActionRowBuilder,
    AuditLogEvent,
    AuditLogOptionsType,
    BaseSelectMenuBuilder,
    ButtonBuilder,
    ChannelType,
    Colors,
    EmbedBuilder,
    GuildChannel,
    Message,
    MessageComponentInteraction,
    PermissionFlagsBits,
    PermissionsBitField,
    SlashCommandBuilder,
    StringSelectMenuBuilder,
    StringSelectMenuOptionBuilder,
    TextChannel
} from 'discord.js'
import ApplicationCommand from '../templates/ApplicationCommand.js'
import { connection } from '../database/connect.js'
export default new ApplicationCommand({
    data: new SlashCommandBuilder()
        .setName('ticket')
        .setDescription('All Ticket Command')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
        .addSubcommand((subcommand) =>
            subcommand
                .setName('create')
                .setDescription('Create Ticket')
                .addStringOption((option) =>
                    option
                        .setName('reason')
                        .setDescription('Reason for creating ticket')
                        .setRequired(true)
                )
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName('close')
                .setDescription('Close Ticket')
                .addStringOption((option) =>
                    option
                        .setName('reason')
                        .setDescription('Reason for closing ticket')
                        .setRequired(true)
                )
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName('setup')
                .setDescription('Setup Ticket System')
                .addIntegerOption((option) =>
                    option
                        .setName('categorynumber')
                        .setDescription('Category number (Max 5) (Min 1)')
                        .setRequired(true)
                )
                .addChannelOption((option) =>
                    option
                        .setName('category')
                        .setDescription('Category for Ticket System')
                        .setRequired(true)
                )
                .addChannelOption((option) =>
                    option
                        .setName('channel')
                        .setDescription(
                            'Channel where the ticket creation message is sent'
                        )
                        .setRequired(true)
                )
        ),
    async execute(interaction): Promise<void> {
        const subcommand = interaction.options.getSubcommand()
        if (config.usedatabase.valueOf() === true) {
            if (subcommand === 'setup') {
                let chatchannel = interaction.guild?.channels.cache.find(
                    (channel) =>
                        channel.name ===
                        interaction.client.user?.username.toLocaleLowerCase()
                ) as TextChannel

                if (!chatchannel) {
                    const name = interaction.client.user?.username
                        .toLocaleLowerCase()
                        .replace(/ /g, '-')

                    const guild = interaction.guild
                    chatchannel = (await guild?.channels
                        .create({
                            name: name,
                            type: ChannelType.GuildText,
                            permissionOverwrites: [
                                {
                                    id: guild.id,
                                    deny: [
                                        PermissionFlagsBits.SendMessages,
                                        PermissionFlagsBits.CreatePrivateThreads,
                                        PermissionFlagsBits.CreatePublicThreads,
                                        PermissionFlagsBits.ViewChannel
                                    ]
                                }
                            ]
                        })
                        .catch(
                            async () =>
                                await interaction.reply({
                                    content: `Une erreur s'est produite : Permission manquante probablement :( `,
                                    ephemeral: true
                                })
                        )) as TextChannel
                }

                const guildid = interaction.guildId
                const [info] = await connection
                    .promise()
                    .query(
                        `SELECT * FROM moon_ticket WHERE guildid = '${guildid}'`
                    )

                if (info instanceof Array && info.length > 0) {
                    await interaction.reply({
                        content: 'Le système de ticket est déjà configuré',
                        ephemeral: true
                    })
                    return
                }

                if (interaction.channel?.id !== chatchannel.id) {
                    await interaction.reply({
                        content: `Veuillez utiliser cette commande dans ${chatchannel}`,
                        ephemeral: true
                    })
                    return
                }

                const categorynumber =
                    interaction.options.getInteger('categorynumber')
                const category = interaction.options.getChannel('category')
                const channel = interaction.options.getChannel(
                    'channel'
                ) as TextChannel

                if (
                    !interaction.memberPermissions?.has(
                        PermissionsBitField.Flags.Administrator
                    )
                ) {
                    await interaction.reply({
                        content:
                            "Vous n'avez pas la permission d'utiliser cette commande",
                        ephemeral: true
                    })
                    return
                }

                if (channel === null) {
                    await interaction.reply({
                        content: 'Le canal est nul',
                        ephemeral: true
                    })
                    return
                }

                if (channel?.type !== ChannelType.GuildText) {
                    await interaction.reply({
                        content: "Le canal n'est pas un canal de texte",
                        ephemeral: true
                    })
                    return
                }
                if (categorynumber === null || category === null) {
                    await interaction.reply({
                        content:
                            'La catégorie ou le numéro de catégorie est nul',
                        ephemeral: true
                    })
                    return
                }
                if (categorynumber > 5 || categorynumber < 1) {
                    await interaction.reply({
                        content:
                            "Le numéro de catégorie n'est pas compris entre 1 et 5",
                        ephemeral: true
                    })
                    return
                }
                if (category?.type !== ChannelType.GuildCategory) {
                    await interaction.reply({
                        content: "La catégorie n'est pas une catégorie",
                        ephemeral: true
                    })
                    return
                }

                await interaction.deferReply({ ephemeral: true })

                const string = new StringSelectMenuBuilder()
                    .setCustomId('ticket')
                    .setPlaceholder('Veuillez sélectionner une option')

                const embed = new EmbedBuilder()
                    .setTitle('🔧 Créer un ticket')
                    .setDescription('Veuillez sélectionner une option')
                    .setColor(Colors.Green)

                const guilid = interaction.guildId
                const channelid = channel.id
                let option1 = ''
                let option2 = ''
                let option3 = ''
                let option4 = ''
                let option5 = ''

                try {
                    const filter = (i: Message) =>
                        i.author.id === interaction.user.id
                    const collector = chatchannel.createMessageCollector({
                        filter,
                        time: 1000 * 60 * 5
                    })

                    let int = categorynumber.valueOf()

                    await chatchannel.send({
                        content: `entrez l'option ${int}`
                    })

                    collector.on('collect', async (collected) => {
                        if (int === 5) {
                            option5 = collected.content
                            string.addOptions(
                                new StringSelectMenuOptionBuilder()
                                    .setLabel(option5)
                                    .setValue(option5)
                            )
                        }
                        if (int === 4) {
                            option4 = collected.content
                            string.addOptions(
                                new StringSelectMenuOptionBuilder()
                                    .setLabel(option4)
                                    .setValue(option4)
                            )
                        }
                        if (int === 3) {
                            option3 = collected.content
                            string.addOptions(
                                new StringSelectMenuOptionBuilder()
                                    .setLabel(option3)
                                    .setValue(option3)
                            )
                        }
                        if (int === 2) {
                            option2 = collected.content
                            string.addOptions(
                                new StringSelectMenuOptionBuilder()
                                    .setLabel(option2)
                                    .setValue(option2)
                            )
                        }
                        if (int === 1) {
                            option1 = collected.content
                            string.addOptions(
                                new StringSelectMenuOptionBuilder()
                                    .setLabel(option1)
                                    .setValue(option1)
                            )
                        }
                        int--
                        if (int != 0) {
                            await chatchannel.send({
                                content: `entrez l'option ${int}`
                            })
                        } else {
                            chatchannel.send({
                                content:
                                    'Message envoyé, veuillez attendre que le système de ticket soit configuré'
                            })
                            connection.query(
                                'INSERT INTO moon_ticket (guildid, channelid, categoryid, ticketcount, option1, option2, option3, option4, option5) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
                                [
                                    guilid,
                                    channelid,
                                    category.id,
                                    categorynumber,
                                    option1,
                                    option2,
                                    option3,
                                    option4,
                                    option5
                                ]
                            )

                            const row =
                                new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
                                    string
                                )
                            channel.send({
                                embeds: [embed],
                                components: [row]
                            })
                            interaction.editReply({
                                content: `Système de ticket configuré avec la catégorie **${category}**`
                            })
                            collector.stop()
                        }
                    })
                } catch (error) {
                    await interaction.deleteReply()
                }
            }
            if (subcommand === 'create') {
                const reason = interaction.options.getString('reason')

                await interaction.reply({
                    content: `Ticket créé avec la raison ${reason}`,
                    ephemeral: true
                })
            }
        } else {
            await interaction.reply({
                content:
                    "La base de données n'est pas activée, vous ne pouvez pas utiliser cette commande",
                ephemeral: true
            })
        }
    }
})
