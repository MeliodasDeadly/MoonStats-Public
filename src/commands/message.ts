import {
    ActionRowBuilder,
    EmbedBuilder,
    Events,
    ModalBuilder,
    PermissionsBitField,
    SlashCommandBuilder,
    TextInputBuilder,
    TextInputStyle
} from 'discord.js'
import ApplicationCommand from '../templates/ApplicationCommand.js'

export default new ApplicationCommand({
    data: new SlashCommandBuilder()
        .setName('message')
        .setDescription('Commande de message pour les administrateurs')
        .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator)
        .addSubcommand((subcommand) =>
            subcommand
                .setName('texte')
                .setDescription('Envoyer un message texte')
                .addStringOption((option) =>
                    option
                        .setName('texte')
                        .setDescription('Entrez un texte')
                        .setRequired(true)
                )
        )
        .addSubcommand((subcommand) =>
            subcommand.setName('embed').setDescription('Envoyer un message intégré')
        ),
    async execute(interaction): Promise<void> {
        const subcommand = interaction.options.getSubcommand()
        if (subcommand === 'texte') {
            const texte = interaction.options.getString('texte', true)
            await interaction.reply(texte)
        } else if (subcommand === 'embed') {
            const modal = new ModalBuilder()
                .setCustomId('embedmodal')
                .setTitle('Créer un message intégré')

            const titreInput = new TextInputBuilder()
                .setCustomId('titreinput')
                .setPlaceholder('Entrez un titre')
                .setLabel('Quel est le titre de l\'intégration?')
                .setRequired(true)
                .setStyle(TextInputStyle.Short)

            const descriptionInput = new TextInputBuilder()
                .setCustomId('descriptioninput')
                .setPlaceholder('Entrez une description')
                .setLabel('Quelle est la description de l\'intégration?')
                .setRequired(true)
                .setStyle(TextInputStyle.Paragraph)

            const premiereLigneAction =
                new ActionRowBuilder<TextInputBuilder>().addComponents(
                    titreInput
                )
            const deuxiemeLigneAction =
                new ActionRowBuilder<TextInputBuilder>().addComponents(
                    descriptionInput
                )

            modal.addComponents(premiereLigneAction, deuxiemeLigneAction)

            await interaction.showModal(modal)
        }
    }
})
