import { SlashCommandBuilder } from 'discord.js'
import ApplicationCommand from '../templates/ApplicationCommand.js'

export default new ApplicationCommand({
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Répond pong !'),
    async execute(interaction): Promise<void> {
        await interaction.reply({ content: 'Pong !', ephemeral: true})
    }
})
