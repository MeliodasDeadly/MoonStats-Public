import {
    ActionRowBuilder,
    BaseInteraction,
    ButtonBuilder,
    ButtonStyle,
    ChannelType,
    EmbedBuilder,
    Events,
    PermissionsBitField,
    TextChannel
} from 'discord.js'
import type ApplicationCommand from '../templates/ApplicationCommand.js'
import Event from '../templates/Event.js'
import { connection } from '../database/connect.js'

export default new Event({
    name: Events.InteractionCreate,
    async execute(interaction: BaseInteraction): Promise<void> {
        if (interaction.isChatInputCommand()) {
            if (!client.commands.has(interaction.commandName)) return
            try {
                const command: ApplicationCommand = (await client.commands.get(
                    interaction.commandName
                )) as ApplicationCommand
    
                if (!command.execute) {
                    console.error(
                        `Impossible de trouver le gestionnaire d'exécution pour ${command.data.name}`
                    )
                    await interaction.reply({
                        content:
                            'Une erreur s\'est produite lors de l\'exécution de cette commande !',
                        ephemeral: true
                    })
                    return
                }
    
                await command.execute(interaction)
            } catch (error) {
                console.error(error)
                await interaction.reply({
                    content: 'Une erreur s\'est produite lors de l\'exécution de cette commande !',
                    ephemeral: true
                })
            }
        } else if (interaction.isAutocomplete()) {
            if (!client.commands.has(interaction.commandName)) return
    
            try {
                const command: ApplicationCommand = (await client.commands.get(
                    interaction.commandName
                )) as ApplicationCommand
    
                if (!command.autocomplete) {
                    console.error(
                        `Impossible de trouver le gestionnaire d'autocomplétion pour ${command.data.name}`
                    )
                    await interaction.respond([
                        {
                            name: 'Échec de l\'autocomplétion',
                            value: 'erreur'
                        }
                    ])
                    return
                }
    
                await command.autocomplete(interaction)
            } catch (error) {
                console.error(error)
            }
        } else if (interaction.isStringSelectMenu()) {
            if (interaction.customId === 'ticket') {
                if (config.usedatabase.valueOf() === false)
                    return void interaction.reply({
                        ephemeral: true,
                        content: 'Cette commande est désactivée par le propriétaire'
                    })
                const [category] = await connection
                    .promise()
                    .query(
                        `SELECT * FROM moon_ticket WHERE guildid = '${interaction.guild?.id}'`
                    )
    
                if (category instanceof Array && category.length > 0) {
                    let name = interaction.values[0]
    
                    // Supprimer les symboles sauf les chiffres
                    name = name.replace(/[^0-9a-z]/gi, '')
    
                    name = name.toLowerCase()
                    // Supprimer les emojis
                    name = name.replace(/<a?:.*?:.*?>/g, '')
                    name = name.replace(/<@&.*?>/g, '')
                    name = name.replace(/<@.*?>/g, '')
                    name = name.replace(/<#.*?>/g, '')
                    name = name.replace(/<:.*?:.*?>/g, '')
                    name = name.replace(/<a.*?:.*?>/g, '')
                    name = name.replace(/<p.*?:.*?>/g, '')
                    name = name.replace(/<@!.*?>/g, '')
    
                    // @ts-ignore
                    let categoryid = category[0].categoryid
                    // @ts-ignore
                    if (category[0].categoryid === null)
                        return void interaction.reply(
                            'Il y a un problème avec la base de données, veuillez contacter le propriétaire'
                        )
    
                    const channel = await interaction.guild?.channels.create({
                        name: `🔓-${name}-${interaction.user.username}`,
                        type: ChannelType.GuildText,
                        parent: categoryid
                    })
    
                    if (channel instanceof TextChannel) {
                        // @ts-ignore
                        channel.permissionOverwrites.edit(interaction.user.id, {
                            ViewChannel: true
                        })
                        channel.setPosition(0)
                    }
                    const embed = new EmbedBuilder()
                        .setTitle('Nouveau ticket')
                        .setDescription(
                            'Un nouveau ticket a été créé \n Channel : <#' +
                                channel?.id +
                                '> '
                        )
                        .setColor('Green')
                        .setFooter({
                            text: 'Propulsé par © Sulfuris Team',
                            iconURL: config.ImageURL ?? undefined
                        })
    
                    const ticketEmbed = new EmbedBuilder()
                        .setTitle(`Ticket de ${interaction.user.username}`)
                        .setDescription(
                            'Bienvenue dans votre ticket, veuillez décrire votre problème le plus précisément possible'
                        )
                        .setColor('Green')
                        .setFooter({
                            text: 'Propulsé par © Sulfuris Team',
                            iconURL: config.ImageURL ?? undefined
                        })
                    const closeButton = new ButtonBuilder()
                        .setCustomId('ticketclose')
                        .setLabel('Fermer')
                        .setStyle(ButtonStyle.Danger)
                        .setEmoji('🔒')
                    const claimButton = new ButtonBuilder()
                        .setCustomId('ticketclaim')
                        .setLabel('Réclamer')
                        .setStyle(ButtonStyle.Primary)
                    const row =
                        new ActionRowBuilder<ButtonBuilder>().addComponents(
                            closeButton,
                            claimButton
                        )
                    await channel?.send({
                        embeds: [ticketEmbed],
                        components: [row]
                    })
                    const mention = await channel?.send({
                        content: `<@${interaction.user.id}>`,
                        embeds: [embed]
                    })
                    setTimeout(() => {
                        mention?.delete()
                    }, 500)
                    await interaction.reply({
                        ephemeral: true,
                        embeds: [embed]
                    })
                }
            }
        } else if (interaction.isButton()) {
            if (interaction.customId === 'ticketclose') {
                if (config.usedatabase.valueOf() === false)
                    return void interaction.reply({
                        ephemeral: true,
                        content: 'Cette commande est désactivée par le propriétaire'
                    })
                const [category] = await connection
                    .promise()
                    .query(
                        `SELECT * FROM moon_ticket WHERE guildid = '${interaction.guild?.id}'`
                    )
                if (category instanceof Array && category.length > 0) {
                    // @ts-ignore
                    let categoryid = category[0].categoryid
                    // @ts-ignore
                    if (category[0].categoryid === null)
                        return void interaction.reply(
                            'Il y a un problème avec la base de données, veuillez contacter le propriétaire'
                        )
                    const channel = interaction.channel
                    // @ts-ignore
                    if (category[0].categoryid !== channel?.parentId)
                        return void interaction.reply(
                            'Ce canal n\'est pas un ticket'
                        )
                    await interaction.reply({
                        content: `Le ticket sera fermé dans 5 secondes`,
                        ephemeral: true
                    })
                    setTimeout(() => {
                        channel?.delete()
                    }, 5000)
                }
            }
            if (interaction.customId === 'ticketclaim') {
                if (config.usedatabase.valueOf() === false)
                    return void interaction.reply({
                        ephemeral: true,
                        content: 'Cette commande est désactivée par le propriétaire'
                    })
                const [category] = await connection
                    .promise()
                    .query(
                        `SELECT * FROM moon_ticket WHERE guildid = '${interaction.guild?.id}'`
                    )
                if (
                    !interaction.memberPermissions?.has(
                        PermissionsBitField.Flags.ManageMessages
                    )
                )
                    return void interaction.reply({
                        ephemeral: true,
                        content:
                            'Vous n\'avez pas la permission de réclamer ce ticket'
                    })
    
                if (category instanceof Array && category.length > 0) {
                    // @ts-ignore
                    // @ts-ignore
    
                    if (category[0].categoryid === null)
                        return void interaction.reply(
                            'Il y a un problème avec la base de données, veuillez contacter le propriétaire'
                        )
                    const channel = interaction.channel
    
                    if (
                        channel instanceof TextChannel &&
                        channel.topic !== null
                    ) {
                        return void interaction.reply({
                            content: `Ce ticket a déjà été réclamé`,
                            ephemeral: true
                        })
                    }
    
                    // @ts-ignore
                    if (category[0].categoryid !== channel?.parentId)
                        return void interaction.reply(
                            'Ce canal n\'est pas un ticket'
                        )
    
                    const messageStarter = 'Ce ticket a été réclamé par '
                    const messageEnder =
                        'Veuillez attendre une réponse de l\'équipe'
    
                    const embed = new EmbedBuilder()
                        .setTitle('Ticket réclamé')
                        .setDescription(
                            messageStarter +
                                `<@${interaction.user.id}>` +
                                '\n' +
                                messageEnder
                        )
                        .setColor('Green')
                        .setFooter({
                            text: 'Propulsé par © Sulfuris Team',
                            iconURL: config.ImageURL ?? undefined
                        })
    
                    channel?.send({
                        embeds: [embed]
                    })
    
                    await interaction.reply({
                        content: `Le ticket a été réclamé`,
                        ephemeral: true
                    })
    
                    if (channel instanceof TextChannel) {
                        const name = channel.name.replace('🔓', '🔒')
                        await channel.setName(name)
                        await channel.setPosition(100)
    
                        await channel.setTopic(
                            messageStarter + `<@${interaction.user.id}>`
                        )
                    }
                }
            }
        } else if (interaction.isModalSubmit()) {
            if (interaction.customId === 'embedmodal') {
                await interaction.reply({
                    content: 'Message intégré créé',
                    components: [],
                    ephemeral: true
                })
    
                const title = interaction.fields.getTextInputValue('titleinput')
                const description = interaction.fields.getTextInputValue('descriptioninput')
                const embed = new EmbedBuilder()
                    .setTitle(title)
                    .setDescription(description)
                    .setColor('Green')
                    .setFooter({
                        text: 'Propulsé par © Sulfuris Team',
                        iconURL: config.ImageURL ?? undefined
                    })
    
                await interaction.channel?.send({ embeds: [embed] })
            }
        }
    }
    })
    