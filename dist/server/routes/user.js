"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const db_1 = require("../db/db");
const zod_1 = require("zod");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const router = express_1.default.Router();
router.get("/list", (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const list = yield db_1.User.find({});
    res.json(list);
}));
const signUpProps = zod_1.z.object({
    username: zod_1.z.string().min(1).max(254),
    password: zod_1.z.string().min(1).max(256)
});
router.post("/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const parsedInput = signUpProps.safeParse(req.body);
    if (!parsedInput.success) {
        return res.status(400).json({ msg: parsedInput.error });
    }
    const { username, password } = parsedInput.data;
    const user = yield db_1.User.findOne({ username });
    if (user) {
        res.status(409).send("user already exists, try another username !");
        return;
    }
    // new User({username: username, password: password})
    const newUser = new db_1.User({ username, password });
    yield newUser.save();
    const token = jsonwebtoken_1.default.sign({
        username
    }, "secret", { expiresIn: "1h" });
    res.json({ message: "User created successfully", token: token });
}));
const loginProps = zod_1.z.object({
    username: zod_1.z.string().min(1).max(254),
    password: zod_1.z.string().min(1).max(256)
});
router.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.headers;
    const parsedInput = loginProps.safeParse({ username, password });
    if (!parsedInput.success) {
        return res.status(400).json({ msg: parsedInput.error });
    }
    let found = yield db_1.User.findOne({ username, password });
    if (!found)
        return res.status(401).send({ message: "username or password not found" });
    const token = jsonwebtoken_1.default.sign({
        username
    }, "secret", { expiresIn: "1h" });
    res.json({ message: "Logged in successfully", token: token });
}));
exports.default = router;
