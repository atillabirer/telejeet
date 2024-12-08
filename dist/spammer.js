"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
async function default_1(client, chat_id, message) {
    // Your code here to interact with Telegram API
    const response = await client.invoke({ _: "sendMessage", chat_id,
        input_message_content: {
            _: 'inputMessageText',
            text: { _: 'formattedText', text: message },
        }
    });
    console.log(response);
}
