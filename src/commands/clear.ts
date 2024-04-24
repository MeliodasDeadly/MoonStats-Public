import { BaseGuildTextChannel, EmbedBuilder, PermissionFlagsBits, SlashCommandBuilder } from 'discord.js'
import ApplicationCommand from '../templates/ApplicationCommand.js'

export default new ApplicationCommand({
    data: new SlashCommandBuilder()
        .setName('clear')
        .setDescription('Effacer le chat')
        .addIntegerOption(option =>
            option
                .setName('amount')
                .setDescription('Le nombre de messages à effacer')
                .setRequired(true)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
    async execute(interaction): Promise<void> {
        const amount = interaction.options.getInteger('amount')
        if(!amount) {
            await interaction.reply({ content: 'Vous devez spécifier un nombre de messages à effacer', ephemeral: true })
            return
        }
        if(amount?.valueOf() > 100){
            await interaction.reply({ content: 'Vous ne pouvez pas supprimer plus de 100 messages', ephemeral: true })
            return
        }
        if(amount?.valueOf() < 1){
            await interaction.reply({ content: 'Vous devez spécifier un nombre de messages à effacer', ephemeral: true })
            return
        }
        const channel = interaction.channel as BaseGuildTextChannel
        try {
            await channel.bulkDelete(amount)
        }catch (err){
            const embed = new EmbedBuilder()
            .setTitle('Une erreur est survenue')
            .setDescription(`Erreur : \`\`\`ts\n${err}\`\`\``)
            await interaction.reply({ embeds:[embed], ephemeral: true })
            return
        }
    },
})
