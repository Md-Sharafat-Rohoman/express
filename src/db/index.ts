import { Pool } from "pg";
import config from "../config";

export const pool = new Pool({
    connectionString: config.connection_string
})

export const initDB = async () => {
    try {
        // await pool.query(`DROP TABLE IF EXISTS users CASCADE`);
        await pool.query(`
          CREATE TABLE IF NOT EXISTS users(
          ID SERIAL PRIMARY KEY,
          NAME VARCHAR(50),
          EMAIL VARCHAR(100) UNIQUE NOT NULL,
          PASSWORD TEXT NOT NULL,
          is_active BOOLEAN DEFAULT true,
          age INT,

          create_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW()

        )
    `);
        await pool.query(`
        CREATE TABLE IF NOT EXISTS profiles(
        id SERIAL PRIMARY KEY,
        user_id INT UNIQUE REFERENCES users(id) ON DELETE CASCADE,
        bio TEXT,
        address TEXT,
        phone VARCHAR(15),
        gender VARCHAR(10),

        create_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
        )
        `)
        console.log("Database connected successfully");

    }
    catch (error) {
        console.log(error);
    }
}