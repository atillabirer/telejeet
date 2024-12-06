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
async function main() {
    const rl = (0, promises_1.createInterface)({
        output: process_1.stdout,
        input: process_1.stdin
    });
    const query = await rl.question("Insert query string:");
    await client.login();
    console.clear();
    const publicSearchRes = await client.invoke({ _: "searchPublicChats", query });
    console.log("total results:", publicSearchRes.total_count);
    for (const chat of publicSearchRes.chat_ids) {
        const chatInfo = await client.invoke({ _: "getChat", chat_id: chat });
        console.log("Chat:", chatInfo.title, "(", chatInfo.type, ")");
    }
    await client.close();
}
main().catch(console.error);
