"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const stream_service_1 = require("./stream.service");
const stream = JSON.parse(process.argv[2]);
const streamService = new stream_service_1.StreamService();
streamService.create(stream)
    .then(() => {
    if (process.send) {
        process.send("Stream created");
    }
    process.exit(0);
})
    .catch(error => {
    if (process.send) {
        process.send(`Error: ${error.message}`);
    }
    process.exit(1);
});
