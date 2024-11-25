"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const api_route_1 = __importDefault(require("./routes/api.route"));
const express_list_routes_1 = __importDefault(require("express-list-routes"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use('/api/', api_route_1.default);
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`--------------------------------------`);
    console.log(`|   Animaccord RTMP Live Stream    |`);
    console.log(`--------------------------------------`);
    console.log(`Log file is located at: ./logs/app.log`);
    console.log(`Routes:`);
    (0, express_list_routes_1.default)(app, { prefix: `localhost:${PORT}` });
});
