import { Colors, EmbedBuilder, PermissionFlagsBits, SlashCommandBuilder } from 'discord.js'

import ApplicationCommand from '../templates/ApplicationCommand.js'
import { getinfo } from '../database/getinfo.js'
import { OkPacket, ProcedureCallPacket, ResultSetHeader, RowDataPacket } from 'mysql2'

export default new ApplicationCommand({
    data: new SlashCommandBuilder()
        .addBooleanOption(option =>
            option
                .setName('mrp')
                .setDescription('Show MRP Stats')
                .setRequired(true)
        )
        .addBooleanOption(option =>
            option
                .setName('scp')
                .setDescription('Show SCP Stats')
                .setRequired(true)
        )
        .setDescription('Show Garrys Mod Server Stats')
        .setName('stats')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(interaction): Promise<void> {
        const mrp = await interaction.options.getBoolean('mrp')
        const scp = await interaction.options.getBoolean('scp')

        type GetInfoReturnType = RowDataPacket[] | OkPacket | ResultSetHeader[] | RowDataPacket[][] | OkPacket[] | ProcedureCallPacket | undefined;

        const info: GetInfoReturnType = await getinfo({ mrp: mrp ?? false, scp: scp ?? false })
        const embed = new EmbedBuilder()
            .setTitle('Moon Stats')
            .setDescription('This is the config panel, here you can configure all the settings of the bot.')
            .setColor(Colors.Green)
            .setTimestamp()
            .setFooter({
                text: 'Powered by © Sulfuris Team',
                iconURL: config.ImageURL ?? undefined,
            })


        const team: any[] = []
        interface Team extends RowDataPacket {
            category: string | null;
            name: string | null;
            number: string | null;
        }

        if (Array.isArray(info)) {
            for (const team of info as Team[]) {

                team.category = team.category ?? 'None';
                team.name = team.name ?? 'None';
                team.number = team.number ?? '0';

                embed.addFields({ name: `${team.category} - ${team.name}`, value: `Members: ${team.number}` })

            }



        }
        return void interaction.reply({ embeds: [embed] })



    }



},
)
