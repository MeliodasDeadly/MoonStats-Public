import { connection } from "./connect.js";


interface getInfo {
    mrp: boolean,
    scp: boolean,
}
export async function getinfo(props: getInfo) {
    const mrp = props.mrp;
    const scp = props.scp;
    if(mrp && scp) {
       const [result] = await connection.promise().query("SELECT * FROM `moon_teams_mrp` UNION SELECT * FROM `moon_teams_scp`")
       return result
    }
    if(mrp) {
        const [result] = await connection.promise().query("SELECT * FROM `moon_teams_mrp`")
        return result

    }
    if(scp){
        const [result] =  await connection.promise().query("SELECT * FROM `moon_teams_scp`")
        return result
    }
    
    

}