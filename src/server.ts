import express, { type Application, type Request, type Response } from "express"
import { Pool } from "pg"
import config from "./config";
const app: Application = express()
const port = config.port;

app.use(express.json())
app.use(express.text())
app.use(express.urlencoded({ extended: true }))

const pool = new Pool({
  connectionString: config.connection_string
})

const initDB = async () => {
  try {
    await pool.query(`DROP TABLE IF EXISTS users`);
    await pool.query(`
          CREATE TABLE IF NOT EXISTS users(
          ID SERIAL PRIMARY KEY,
          NAME VARCHAR(20),
          EMAIL VARCHAR(20) UNIQUE NOT NULL,
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
// initDB();

app.get('/', (req: Request, res: Response) => {
  // res.send('Express Server')
  res.status(200).json({
    message: "Express Server",
    "author": "Next Level"
  })
})
app.post('/api/users', async (req: Request, res: Response) => {
  // console.log(req.body);
  const { name, gmail, password, age } = req.body;
  try {
    const result = await pool.query(`
        INSERT INTO users(name,email,password,age) VALUES($1,$2,$3,$4)RETURNING *
    `, [name, gmail, password, age])
    console.log(result);


    res.status(201).json({
      success: true,
      message: "User Created Successfully",
      data: result.rows[0]
    })
  }
  catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
      error: error
    })
  }
})
app.get('/api/users', async (req: Request, res: Response) => {
  try {
    const result = await pool.query(`
      SELECT * FROM users
      `)
    res.status(200).json({
      success: true,
      message: 'Users retrived Successfully',
      data: result.rows
    })
  }
  catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
      error: error
    })
  }
})

app.get('/api/users/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  // console.log(id)
  try {
    const result = await pool.query(`
          SELECT * FROM users WHERE id=$1 
      `, [id])
    // console.log(result)
    if (result.rows.length === 0) {
      res.status(404).json({
        success: false,
        message: 'User Not Found',
        data: {}
      })
    }
    res.status(200).json({
      success: true,
      message: 'User retrived Successfully',
      data: result.rows[0]
    })
  }
  catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
      error: error
    })
  }
})

app.put('/api/users/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, password, age, is_active } = req.body;
    // console.log(id)
    // console.log({ name, password, age, is_active });
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

    if (result.rows.length === 0) {
      res.status(404).json({
        success: false,
        message: 'User Not Found',
        data: {}
      })
    }

    res.status(200).json({
      success: true,
      message: 'User Updated Successfully',
      data: result.rows[0]
    })
  }
  catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
      error: error
    })
  }
})

app.delete('/api/users/:id', async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `
      DELETE FROM users WHERE id=$1
      `, [id]
    )
    if (result.rowCount === 0) {
      res.status(404).json({
        success: false,
        message: 'User Not Found'
      })
    }
    res.status(200).json({
      success: true,
      message: 'User Deleted Successfully',
      data: {}
    })
  }
  catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
      error: error
    })
  }
})





app.listen(port, () => {
  console.log(`Database connected successfully port ${port}`)
})
