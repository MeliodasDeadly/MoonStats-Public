import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, Guild, PermissionFlagsBits, SlashCommandBuilder } from 'discord.js'
import ApplicationCommand from '../templates/ApplicationCommand.js'
import config from '../config.json' assert { type: "json" };
export default new ApplicationCommand({
    data: new SlashCommandBuilder()
        .setName('kick')
        .setDescription('Expulser un utilisateur de tous les serveurs')
        .addUserOption(option =>
            option
                .setName('user')
                .setDescription('L\'utilisateur à expulser')
                .setRequired(true)
        ).addStringOption(option =>
            option
                .setName('reason')
                .setDescription('La raison de l\'expulsion')
                .setRequired(true)
        ).addBooleanOption(option =>
            option
                .setName('all')
                .setDescription('Expulser l\'utilisateur de tous les serveurs')
                .setRequired(false)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(interaction): Promise<void> {

        const user = interaction.options.getUser('user')
        const reason = interaction.options.getString('reason')

        const all = interaction.options.getBoolean('all')

        

        if (!user) {
            await interaction.reply({ content: 'Vous devez spécifier un utilisateur à expulser', ephemeral: true })
            return
        }
        if (!reason) {
            await interaction.reply({ content: 'Vous devez spécifier une raison pour expulser l\'utilisateur', ephemeral: true })
            return
        }
        const kickEmbed = new EmbedBuilder()
            .setDescription(`✅: Vous avez expulsé ${user} de ${interaction.guild?.name} pour ${reason}`)
        const kickedEmbed = new EmbedBuilder()
            .setDescription(`Vous avez été expulsé de ${interaction.guild?.name} pour ${reason}`)


        if (all) {
            if (config.usedatabase.valueOf() == true) {

                if(!config.AdminID.values.toString().includes(interaction.user.id)) return void interaction.reply({ content: 'Vous n\'êtes pas autorisé à utiliser cette commande', ephemeral: true }) 

                


                // #TODO: Ajouter la prise en charge de la base de données

                kickEmbed.setDescription(`Vous avez expulsé ${user} de tous les serveurs pour ${reason}`)
                kickedEmbed.setDescription(`Vous avez été expulsé de tous les serveurs pour ${reason}`)


                await interaction.reply({ embeds: [kickEmbed], ephemeral: true })
                interaction.guild?.members.kick(user, reason)
                try {
                    user?.send({ embeds: [kickedEmbed] })
                } catch (err) {
                }
            } else {
                interaction.reply({ content: 'Cette option est désactivée car la base de données est désactivée, veuillez utiliser `/kick` sans cette option', ephemeral: true })
            }
        } else {
            await interaction.reply({ embeds: [kickEmbed], ephemeral: true })
            try {
                await user?.send({ embeds: [kickedEmbed] })
            } catch (err) {
            }
            interaction.guild?.members.kick(user, reason)
        }





    },
})
