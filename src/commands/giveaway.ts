import { SlashCommandBuilder, ModalBuilder, ActionRowBuilder, ModalActionRowComponentBuilder, TextInputBuilder, TextInputStyle, EmbedBuilder, ModalSubmitInteraction, Colors, Channel, BaseChannel, ChannelType, GuildTextBasedChannel, PermissionsBitField, PermissionFlagsBits } from 'discord.js'
import ApplicationCommand from '../templates/ApplicationCommand.js'
import config from '../config.json' assert { type: "json" };
import ms from 'ms';

export default new ApplicationCommand({
    data: new SlashCommandBuilder()
        .setName('giveaway')
        .setDescription('Afficher tous les cadeaux')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addSubcommand(subcommand =>
            subcommand
                .setName('list')
                .setDescription('Lister tous les cadeaux')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('delete')
                .setDescription('Supprimer un cadeau')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('create')
                .setDescription('Créer un cadeau')
                .addChannelOption(option =>
                    option
                        .setName('channel')
                        .setDescription('Le canal où le cadeau doit être créé')
                        .setRequired(true)
                )
                .addStringOption(option =>
                    option
                        .setName('name')
                        .setDescription('Le nom du cadeau')
                        .setRequired(true)
                )
                .addStringOption(option =>
                    option
                        .setName('description')
                        .setDescription('La description du cadeau')
                        .setRequired(true)
                )
                .addStringOption(option =>
                    option
                        .setName('time')
                        .setDescription('Le temps du cadeau (format : 1h, 1j, 1s, 1m, 1a)')
                        .setRequired(true)
                )
                .addIntegerOption(option =>
                    option
                        .setName('winnernumber')
                        .setDescription('Le nombre de gagnants (par défaut : 1)')
                        .setRequired(false)
                )

        ),
    async execute(interaction): Promise<void> {

        const subcommand = interaction.options.getSubcommand()
        if (subcommand === 'list') {
        }
        if (subcommand === 'delete') {
        }
        if (subcommand === 'create') {



            const name = interaction.options.getString('name')
            const description = interaction.options.getString('description')
            const time = interaction.options.getString('time')
            const winnerNumber = interaction.options.getInteger('winnernumber')
            const channel = interaction.options.getChannel('channel') as BaseChannel
            const winnerNumber2 = winnerNumber ?? 1

            if (!time) {
                await interaction.reply({ content: 'Vous devez spécifier une durée pour le cadeau', ephemeral: true })
                return
            }

            let t = `${time}`
            try {
                const currentDate = new Date()
                let date = new Date(currentDate.getTime() + ms(t))
                if (isNaN(date.getTime())) throw new Error('Durée invalide')
                const timestamp = Math.floor(date.getTime() / 1000)
                t = `<t:${timestamp}:R>`
            } catch {
                await interaction.reply({ content: 'Vous devez spécifier une durée valide pour le cadeau', ephemeral: true })
                return
            }




            if (channel?.type !== ChannelType.GuildText) {
                await interaction.reply({ content: 'Vous devez spécifier un canal de texte', ephemeral: true })
                return
            }



            const embed = new EmbedBuilder()
                .setTitle(name)
                .setDescription(description)
                .setColor(Colors.Green)
                .addFields(
                    { name: '🕰️ Durée', value: `${t}` },
                    { name: '👑 Nombre de gagnants', value: `${winnerNumber2}` },
                    { name: '🎉 Comment participer ?', value: "Réagissez avec '🎉' pour participer" },
                )
                .setTimestamp()
                .setFooter({
                    text: 'Propulsé par © Sulfuris Team',
                    iconURL: config.ImageURL ?? undefined,
                })

            const message = (channel as GuildTextBasedChannel)?.send({ embeds: [embed] });
            (await message).react('🎉')
            await interaction.reply({ content: 'Le cadeau a été créé', ephemeral: true })


            // TODO: Ajouter à la base de données

        }

    },
})
