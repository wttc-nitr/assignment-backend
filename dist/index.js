"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
require("dotenv/config");
const user_1 = __importDefault(require("./server/routes/user"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use("/api/user", user_1.default);
mongoose_1.default.connect(`${process.env.MONGO_URL}`);
app.listen(3000, () => {
    console.log('Server is listening on port 3000');
});
