/* eslint-disable no-var */
import { Client, Collection } from 'discord.js'
import ApplicationCommand from '../templates/ApplicationCommand'
import MessageCommand from '../templates/MessageCommand'
import config from './config.json'  assert { type: "json" };

interface DiscordClient extends Client {
    commands: Collection<string, ApplicationCommand>
    msgCommands: Collection<string, MessageCommand>
}

declare global {
    var client: DiscordClient
    var config: config

    type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>
}

export {}
