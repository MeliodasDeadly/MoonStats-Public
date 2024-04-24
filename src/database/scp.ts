import config from '../config.json'  assert { type: "json" };

import mysql2 from 'mysql2';

let scpdb: mysql2.Connection;

try {
    if (config.usedatabase.valueOf() === true) {
        scpdb = mysql2.createConnection({
            host: config.scphost,
            user: config.scpuser,
            password: config.scppassword,
            database: config.scpdatabase
        });
    }
} catch (error) {
    console.log('Error With SCP Database! Could not connect...')

}

export { scpdb };
export function connectscp() {
    scpdb.connect(function (err: any) {
        if (err) {
            console.error('SCP Database connection failed : ' + err.stack);
            return;
        }
        console.log('Connected to SCP Database!');
    })
}

