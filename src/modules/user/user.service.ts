import bcrypt from "bcrypt";
import { pool } from "../../db";
import type { IUser } from "./user.interface";


const createUserIntoDb = async (payLoad: IUser) => {
    const { name, gmail, password, age } = payLoad;
    const hasPassword = await bcrypt.hash(password, 10);
    console.log(hasPassword)
    const result = await pool.query(`
        INSERT INTO users(name,email,password,age) VALUES($1,$2,$3,$4)RETURNING *
    `, [name, gmail, hasPassword, age])
    // console.log(result);
    delete result.rows[0].password
    return result;
}

const getAllUserIntoDb = async () => {
    const result = await pool.query(`
      SELECT * FROM users
      `)
    return result;
}
const getSingleUserIntoDb = async (id: string) => {
    const result = await pool.query(`
          SELECT * FROM users WHERE id=$1 
      `, [id])
    return result;
}
const getSingleUserUpdatedIntoDb = async (payLoad: IUser, id: string) => {
    const { name, password, age, is_active, } = payLoad;

    const result = await pool.query(
        `
    UPDATE users SET 
    name=COALESCE($1,name),
    password=COALESCE($2,password),
    age=COALESCE($3,age),
    is_active=COALESCE($4,is_active)
    WHERE id=$5 RETURNING *
    `, [name, password, age, is_active, id]
    );
    return result;
}
const userDeletedIntoDb = async (id: string) => {
    const result = await pool.query(
        `
      DELETE FROM users WHERE id=$1
      `, [id]
    )
    return result;
}



export const userService = {
    createUserIntoDb,
    getAllUserIntoDb,
    getSingleUserIntoDb,
    getSingleUserUpdatedIntoDb,
    userDeletedIntoDb
}