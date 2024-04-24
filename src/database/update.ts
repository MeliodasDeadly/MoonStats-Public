
import { connection } from './connect.js';
import { getinfo } from './getinfo.js';
export function update() {
    connection.query("CREATE TABLE IF NOT EXISTS moon_guild (id BIGINT NOT NULL AUTO_INCREMENT, guildid TEXT, guildname TEXT, PRIMARY KEY (id))")
    connection.query("ALTER TABLE moon_guild ADD COLUMN IF NOT EXISTS guildid TEXT")
    connection.query("ALTER TABLE moon_guild ADD COLUMN IF NOT EXISTS guildname TEXT")
    connection.query("ALTER TABLE moon_guild ADD COLUMN IF NOT EXISTS guildicon TEXT")
    connection.query("ALTER TABLE moon_guild ADD COLUMN IF NOT EXISTS guildowner TEXT")
    connection.query("ALTER TABLE moon_guild ADD COLUMN IF NOT EXISTS channelid TEXT")
    connection.query("ALTER TABLE moon_guild ADD COLUMN IF NOT EXISTS specialcode TEXT")
    connection.query("ALTER TABLE moon_guild ADD COLUMN IF NOT EXISTS linkedguilds TEXT")
    connection.query("ALTER TABLE moon_guild ADD COLUMN IF NOT EXISTS welcomeid TEXT")
    
    connection.query("CREATE TABLE IF NOT EXISTS moon_ticket (id BIGINT NOT NULL AUTO_INCREMENT, guildid TEXT, channelid TEXT, PRIMARY KEY (id))")
    connection.query("ALTER TABLE moon_ticket ADD COLUMN IF NOT EXISTS guildid TEXT")
    connection.query("ALTER TABLE moon_ticket ADD COLUMN IF NOT EXISTS channelid TEXT")
    connection.query("ALTER TABLE moon_ticket ADD COLUMN IF NOT EXISTS categoryid TEXT")
    connection.query("ALTER TABLE moon_ticket ADD COLUMN IF NOT EXISTS ticketcount TEXT")
    connection.query("ALTER TABLE moon_ticket ADD COLUMN IF NOT EXISTS option1 TEXT")
    connection.query("ALTER TABLE moon_ticket ADD COLUMN IF NOT EXISTS option2 TEXT")
    connection.query("ALTER TABLE moon_ticket ADD COLUMN IF NOT EXISTS option3 TEXT")
    connection.query("ALTER TABLE moon_ticket ADD COLUMN IF NOT EXISTS option4 TEXT")
    connection.query("ALTER TABLE moon_ticket ADD COLUMN IF NOT EXISTS option5 TEXT")

    console.log('Updated Database!')
    // create if not exist moon config table
    //connection.query("CREATE TABLE IF NOT EXISTS moon_config (id BIGINT NOT NULL AUTO_INCREMENT, name TEXT, most_players BOOLEAN, PRIMARY KEY (id))")
    // connection.query("ALTER TABLE moon_config ADD COLUMN IF NOT EXISTS guildid TEXT")
    // add boolean column
}

export function autoupdate() {
    setInterval(() => {
        update()
    }, 1000 * 60 * 60 * 24)
}

