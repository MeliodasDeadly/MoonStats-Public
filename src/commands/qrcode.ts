import { PermissionFlagsBits, SlashCommandBuilder } from 'discord.js'
import ApplicationCommand from '../templates/ApplicationCommand.js'
import QRCode from 'qrcode'
export default new ApplicationCommand({
    data: new SlashCommandBuilder()
        .setName('qrcode')
        .setDescription('créer un code QR')
        .addStringOption(option =>
            option
                .setName('url')
                .setDescription('L\'URL à convertir en code QR')
                .setRequired(true)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(interaction): Promise<void> {

        const url = interaction.options.getString('url')
        QRCode.toFile('discord_qr.png', url ?? '', (err) => {
            if (err) {
                console.error(err);
            } else {
                console.log('Code QR généré ! Vérifiez discord_qr.png');
            }
        });
        await interaction.reply({
            files: ['discord_qr.png']
        })
    },
})
