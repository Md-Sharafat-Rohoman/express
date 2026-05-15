import { Pool } from "pg";
import config from "../config";

export const pool = new Pool({
    connectionString: config.connection_string
})

export const initDB = async () => {
    try {
        await pool.query(`DROP TABLE IF EXISTS users`);
        await pool.query(`
          CREATE TABLE IF NOT EXISTS users(
          ID SERIAL PRIMARY KEY,
          NAME VARCHAR(50),
          EMAIL VARCHAR(100) UNIQUE NOT NULL,
          PASSWORD VARCHAR(20) NOT NULL,
          is_active BOOLEAN DEFAULT true,
          age INT,

          create_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW()

        )
    `);
        // console.log("Database connected successfully");

    }
    catch (error) {
        console.log(error);
    }
}