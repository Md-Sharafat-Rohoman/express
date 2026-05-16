import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import config from "../../config";
import { pool } from "../../db";

const loginUserIntoDb = async (payLoad: { email: string, password: string }) => {
    const { email, password } = payLoad;
    console.log(email, password);
    const userData = await pool.query(`
        SELECT * FROM users WHERE email=$1
        `, [email])
    const user = userData.rows[0];
    if (!user) {
        throw new Error("User not found!");
    }
    const isPasswordMatched = await bcrypt.compare(password, user.password);
    if (!isPasswordMatched) {
        throw new Error("Password does not match!");
    }

    const jwtPayLoad = {
        id: user.id,
        name: user.name,
        is_active: user.is_active,
        email: user.email
    }
    const accessToken = jwt.sign(jwtPayLoad, config.secret as string, { expiresIn: '1d' })
    return { accessToken };
}

export const authService = {
    loginUserIntoDb
}