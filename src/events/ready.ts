import { Events } from 'discord.js'
import Event from '../templates/Event.js'
import { scpstatsload } from '../database/updatescp.js'

export default new Event({
    name: Events.ClientReady,
    once: true,
    execute(): void {

        const ASCII = `
                ███╗   ███╗ ██████╗  ██████╗ ███╗   ██╗    ███████╗████████╗ █████╗ ████████╗
                ████╗ ████║██╔═══██╗██╔═══██╗████╗  ██║    ██╔════╝╚══██╔══╝██╔══██╗╚══██╔══╝
                ██╔████╔██║██║   ██║██║   ██║██╔██╗ ██║    ███████╗   ██║   ███████║   ██║
                ██║╚██╔╝██║██║   ██║██║   ██║██║╚██╗██║    ╚════██║   ██║   ██╔══██║   ██║
                ██║ ╚═╝ ██║╚██████╔╝╚██████╔╝██║ ╚████║    ███████║   ██║   ██║  ██║   ██║
                ╚═╝     ╚═╝ ╚═════╝  ╚═════╝ ╚═╝  ╚═══╝    ╚══════╝   ╚═╝   ╚═╝  ╚═╝   ╚═╝
                Made By Melio!
                `
        // Runs when the bot logs in

        console.log(ASCII)
        console.log('--------------------------------------')
        console.log('Bot is ready!')
        console.log(`Logged in as ${client.user?.tag as string}!`)
        console.log(`Date: ${new Date().toLocaleDateString()}`)
        console.log('--------------------------------------')
        
        scpstatsload();
        setInterval(scpstatsload, 1 * 60 * 1000);


        
    }
})
