import express, { type Application, type Request, type Response } from "express";
import { profileRoute } from "./modules/profile/profile.route";
import { userRoute } from "./modules/user/user.route";
import { authRouter } from "./modules/auth/auth.route";
const app: Application = express()
// const port = config.port

app.use(express.json())
app.use(express.text())
app.use(express.urlencoded({ extended: true }))


app.get('/', (req: Request, res: Response) => {
  // res.send('Express Server')
  res.status(200).json({
    message: "Express Server",
    "author": "Next Level"
  })
})

app.use('/api/users', userRoute);
app.use('/api/profile', profileRoute);
app.use('/api/auth',authRouter)


export default app;