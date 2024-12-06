import * as tdl from 'tdl'
import { getTdjson } from 'prebuilt-tdlib'
import type * as Td from 'tdlib-types';
import { createInterface } from "readline/promises";
import { stdin, stdout } from 'process';

// import TDLib types:
// import type * as Td from 'tdlib-types'
tdl.configure({ tdjson: getTdjson() })


const client = tdl.createClient({
    apiId: 21563988, // Your api_id
    apiHash: '005db574e0dbf6d7e87ed81bc234c742'
})

client.on('error', console.error)

async function main() {
    const rl = createInterface({
        output: stdout,
        input: stdin
    })
    const query = await rl.question("Insert query string:");
    await client.login()
    

    console.clear();
    const publicSearchRes = await client.invoke({ _: "searchPublicChats", query });
    console.log("total results:", publicSearchRes.total_count);

    for (const chat of publicSearchRes.chat_ids) {
        const chatInfo = await client.invoke({ _: "getChat", chat_id: chat });
        console.log("Chat:", chatInfo.title, "(", chatInfo.type, ")");
    }
    

    await client.close()
}

main().catch(console.error)