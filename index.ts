import express from "express"
import mongoose from "mongoose"
import 'dotenv/config'
import userRouter from "./server/routes/user"

const app = express();

app.use(express.json());
app.use("/api/user", userRouter);

mongoose.connect(`${process.env.MONGO_URL}`);


app.listen(3000, () => {
  console.log('Server is listening on port 3000');
})