"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
async function default_1(client, chat_id, chat_title) {
    // join the telegram chat by id
    const response = await client.invoke({
        _: "joinChat",
        chat_id: chat_id,
    });
    console.log(response);
}
