import express from "express"
import { User } from "../db/db"
import { z } from "zod"
import jwt from "jsonwebtoken"

const router = express.Router();

router.get("/list", async (_req, res) => {
  const list = await User.find({});
  res.json(list);
})

const signUpProps = z.object({
  username: z.string().min(1).max(254),
  password: z.string().min(1).max(256)
});

type SignupParams = z.infer<typeof signUpProps>;

router.post("/signup", async (req, res) => {
  const parsedInput = signUpProps.safeParse(req.body);
  if (!parsedInput.success) {
    return res.status(411).json({msg: parsedInput.error })
  }
  const { username, password } = parsedInput.data;
  const user = await User.findOne({ username });

  if (user) {
    res.status(400).send("user already exists, try another username !");
    return;
  }

  // new User({username: username, password: password})
  const newUser = new User({ username, password });
  await newUser.save();

  const token = jwt.sign(
    {
      username
    },
    "secret",
    { expiresIn: "1h" }
  );

  res.json({ message: "User created successfully", token: token });
});

const loginProps = z.object({
  username: z.string().min(1).max(254),
  password: z.string().min(1).max(256)
})

router.post("/login", async (req, res) => {
  const { username, password } = req.headers;
  const parsedInput = loginProps.safeParse({username, password});
  if (!parsedInput.success) {
    return res.status(411).json({msg: parsedInput.error});
  }

  let found = await User.findOne({ username, password });

  if (!found)
    return res.status(400).send({ message: "username or password not found" });

    const token = jwt.sign(
      {
        username
      },
      "secret",
      { expiresIn: "1h" }
    );

  res.json({ message: "Logged in successfully", token: token });
});

export default router;