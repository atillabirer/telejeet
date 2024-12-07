"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const tdl = __importStar(require("tdl"));
const prebuilt_tdlib_1 = require("prebuilt-tdlib");
const promises_1 = require("readline/promises");
const process_1 = require("process");
// import TDLib types:
// import type * as Td from 'tdlib-types'
tdl.configure({ tdjson: (0, prebuilt_tdlib_1.getTdjson)() });
const client = tdl.createClient({
    apiId: 21563988, // Your api_id
    apiHash: '005db574e0dbf6d7e87ed81bc234c742'
});
client.on('error', console.error);
client.on('update', (update) => {
    if (update._ === 'updateNewChat') {
        console.log(`New chat: ${update.chat.title} (${update.chat.id})`);
    }
});
async function main() {
    const rl = (0, promises_1.createInterface)({
        output: process_1.stdout,
        input: process_1.stdin
    });
    const query = await rl.question("Insert query string:");
    await client.login();
    const publicSearchRes = await client.invoke({ _: "searchPublicChats", query });
    console.log("total results:", publicSearchRes.total_count);
    for (const chat of publicSearchRes.chat_ids) {
        try {
            const chatInfo = await client.invoke({ _: "getChat", chat_id: chat });
            console.log("Chat title:", chatInfo.title);
            console.log("Chat type:", chatInfo.type);
            console.log("Can write:", chatInfo.permissions.can_send_basic_messages);
            if (chatInfo.type._ == "chatTypeSupergroup") {
                if (!chatInfo.type.is_channel && chatInfo.permissions.can_send_basic_messages) {
                    console.log("Chat is a group, let's join");
                    await client.invoke({ _: "joinChat", chat_id: chat });
                    //wait 300 seconds after join
                    await new Promise(resolve => setTimeout(resolve, 1000)); // 5 minutes
                }
            }
            if (chatInfo.type._ == "chatTypeBasicGroup") {
                console.log(chatInfo.permissions.can_send_basic_messages);
                console.log("Chat is a supergroup, let's join");
                await client.invoke({ _: "joinChat", chat_id: chat });
                await new Promise(resolve => setTimeout(resolve, 1000)); // 5 minutes
            }
        }
        catch (error) {
            console.log(error);
            continue;
        }
    }
    await client.close();
}
main().catch(console.error);
