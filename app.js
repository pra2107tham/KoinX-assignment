import express from "express"
import cors from "cors";

const app = express()
const port = process.env.PORT
console.log(process.env)
app.use(cors({
    origin: true,
    credentials: true,
}))

app.get('/', (req, res) => {
    res.send('Hello World!')
})
  
app.listen(port || 3000, () => {
console.log(`Example app listening on port ${port}`)
})

export {app}