import mysql from 'mysql2';
import config from '../config.json'  assert { type: "json" };

import mysql2 from 'mysql2';

let connection: mysql2.Connection;

try {
    if (config.usedatabase.valueOf() === true) {
        connection = mysql2.createConnection({
            host: config.host,
            user: config.user,
            password: config.password,
            database: config.database
        });
    }
} catch (error) {
    console.log('Error With Database! Could not connect...')

}

export { connection };
export function connect() {
    connection.connect(function (err: any) {
        if (err) {
            console.error('Database connection failed : ' + err.stack);
            return;
        }
        console.log('Connected to Database!');
    })
}

