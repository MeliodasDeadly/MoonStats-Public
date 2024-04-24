import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, Guild, PermissionFlagsBits, SlashCommandBuilder } from 'discord.js'
import ApplicationCommand from '../templates/ApplicationCommand.js'
import config from '../config.json' assert { type: "json" };
import OpenAI from 'openai';

export default new ApplicationCommand({
    data: new SlashCommandBuilder()
        .setName('chat')
        .setDescription('Commencer une conversation avec moi !')
        .addStringOption(option =>
            option
                .setName('message')
                .setDescription('Le message que vous souhaitez m\'envoyer !')
                .setRequired(true)
        ).addBooleanOption(option =>
            option
                .setName('private')
                .setDescription('Si vous souhaitez garder cette conversation privée, utilisez cette option !')
                .setRequired(false)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.ViewChannel),
    async execute(interaction): Promise<void> {

        interaction.reply({ content: 'Commande hors service', ephemeral: true })
        return
        /*const apiKey = config.ChatGPTApiKey
        const message = interaction.options.getString('message')
        const privateChat = interaction.options.getBoolean('private')

        if (config.ChatGPTApiKey == null) {
            await interaction.reply({ content: 'Cette commande est désactivée car la clé API n\'est pas définie !', ephemeral: true })
            return
        }


        const openai = new OpenAI({
            apiKey: apiKey,
            timeout: 20 * 1000,
        })

        const params: OpenAI.Chat.ChatCompletionCreateParams = {
            model: 'gpt-3.5-turbo-16k',
            messages: [
                { role: 'system', content: 'Vous êtes un assistant utile qui répond de manière concise' },
                { role: 'user', content: message }
            ],

        }
        const chatCompletion: OpenAI.Chat.ChatCompletion = await openai.chat.completions.create(params);

        const response = chatCompletion.choices[0].message;


        if (privateChat) {
            await interaction.reply({ content: `${response}`, ephemeral: true })
        }
        else {
            await interaction.reply({ content: `${response}` })
        }
        */

    },
})
