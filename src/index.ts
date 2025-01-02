import * as tdl from 'tdl'
import { getTdjson } from 'prebuilt-tdlib'
import type * as Td from 'tdlib-types';
import { createInterface } from "readline/promises";
import { stdin, stdout } from 'process';
import { readFile } from 'fs/promises';
import spammer from './spammer';
import spam_template from "./spam_template";
import joiner from './joiner';

// import TDLib types:
// import type * as Td from 'tdlib-types'
tdl.configure({ tdjson: getTdjson() })


const client = tdl.createClient({
    apiId: 20022432, // Your api_id
    apiHash: 'c970a1f7ae44429f7c7e8dc2ed96b32c' // your api hash
})

client.on('error', console.error)

async function main() {
    const rl = createInterface({
        output: stdout,
        input: stdin
    })
    await client.login()

    const command = "1 for searching for public chats, 2 for spamming all chats";

    const chatSearchChoice = await rl.question(command);
    let queryString: string;

    if (chatSearchChoice === "1") {
        queryString = await rl.question("Enter the chat title to search for:");
    } else {
        queryString = "";
    }




    const publicSearchRes = chatSearchChoice === "2" ? await client.invoke({ _: "getChats", limit: 500 }) :
        await client.invoke({ _: "searchPublicChats", query: queryString });

    console.log("total results:", publicSearchRes.total_count);
    const spamMessage = spam_template;

    for (const chat of publicSearchRes.chat_ids) {
        try {

            const chatInfo = await client.invoke({ _: "getChat", chat_id: chat });
            console.log("Chat title:", chatInfo.title);
            console.log("Chat type:", chatInfo.type);
            console.log("Can write:", chatInfo.permissions.can_send_basic_messages);
            if (chatInfo.type._ == "chatTypeSupergroup") {

                if (!chatInfo.type.is_channel && chatInfo.permissions.can_send_basic_messages) {
                    if (chatSearchChoice === "2") {
                        //spam

                        await new Promise(resolve => setTimeout(resolve, 10000)); // 1 minute
                        spammer(client, chatInfo.id, spamMessage);
                        console.log(`Spamming in supergroup: ${chatInfo.title}`);

                    } else {
                        await joiner(client, chatInfo.id, spamMessage);
                    }


                    //wait 300 seconds after join

                }
            }
            if (chatInfo.type._ == "chatTypeBasicGroup") {
                console.log(chatInfo.permissions.can_send_basic_messages);
                if (chatSearchChoice === "2") {
                    //spam

                    await new Promise(resolve => setTimeout(resolve, 10000)); // 1 minute
                    spammer(client, chatInfo.id, spamMessage);
                    console.log(`Spamming in supergroup: ${chatInfo.title}`);

                } else {
                    await joiner(client, chatInfo.id, spamMessage);
                }

            }


        } catch (error) {
            console.log(error);
            continue;
        }
    }
    await client.close();


}

main().then((console.log)).catch(console.error)
