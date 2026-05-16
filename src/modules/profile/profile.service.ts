import { pool } from "../../db";


const createProfileIntoDb = async (payLoad: any) => {
    // console.log(payLoad);
    const { user_id, bio, address, phone, gender } = payLoad;
    const user = await pool.query(`
        SELECT * FROM users WHERE id=$1   
        `, [user_id]);
    console.log(user)
    if (user.rows.length === 0) {
        throw new Error("User not exists");
    }
    const result = await pool.query(`
        INSERT INTO profiles(user_id, bio, address, phone, gender) VALUES($1,$2,$3,$4,$5)  RETURNING *
        `, [user_id, bio, address, phone, gender])
    return result.rows[0];
}

export const profileService = {
    createProfileIntoDb
}