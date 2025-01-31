import * as tdl from 'tdl'
import { getTdjson } from 'prebuilt-tdlib'
import type * as Td from 'tdlib-types';
import { createInterface } from "readline/promises";
import { stdin, stdout } from 'process';
import { readFile, appendFile } from 'fs/promises';
import spammer from './spammer';
import groups from "./groups.json";
import spam_template from "./spam_template";
import joiner from './joiner';
import { scraper } from './scraper';

// import TDLib types:
// import type * as Td from 'tdlib-types'
tdl.configure({ tdjson: getTdjson() })


const client = tdl.createClient({
    apiId: 20022432, // Your api_id
    apiHash: 'c970a1f7ae44429f7c7e8dc2ed96b32c' // your api hash
})

client.on('error', console.error)
//client.on("update", (update) => console.log(update));

async function main() {
    const rl = createInterface({
        output: stdout,
        input: stdin
    })
    await client.login()

    const command = "1 for joining groups from file, 2 for spamming all chats";

    const chatSearchChoice = await rl.question(command);

    if (chatSearchChoice === "1") {
        //joining all the groups in the file...
        const scrapedGroups = await scraper();
        for (const scrapeGroup of scrapedGroups) {
            try {
                if (scrapeGroup) {
                    const resp = await client.invoke({ _: "searchPublicChats", query: scrapeGroup });
                    await new Promise(resolve => setTimeout(resolve, 3000));
                    if (resp) {
                        for (const chat_id of resp.chat_ids) {

                            const chat = await client.invoke({ _: "getChat", chat_id });
                            await new Promise(resolve => setTimeout(resolve, 3000));


                            console.log(chat);
                            if ((chat.type._ == "chatTypeSupergroup" || chat.type._ == "chatTypeBasicGroup")
                                && chat.permissions.can_send_basic_messages) {

                                await client.invoke({ _: "joinChat", chat_id });

                                await new Promise(resolve => setTimeout(resolve, 3000)); // 3 secs

                            }
                        }

                    }


                } else {
                    console.log("cant get scaped groups");
                }
            }
            catch (error) {
                console.log(error);
                continue;
            }

        }


    } else if (chatSearchChoice === "2") {
        const publicSearchRes = await client.invoke({ _: "getChats", limit: 500 });

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

                        //spam

                        await new Promise(resolve => setTimeout(resolve, 10000)); // 1 minute
                        spammer(client, chatInfo.id, spamMessage);
                        console.log(`Spamming in supergroup: ${chatInfo.title}`);

                    await appendFile(__dirname + "/dump.csv", `${chatInfo.title},${Date.now()}\n`);




                        //wait 300 seconds after join

                    }
                }
                if (chatInfo.type._ == "chatTypeBasicGroup") {
                    console.log(chatInfo.permissions.can_send_basic_messages);

                    //spam

                    await new Promise(resolve => setTimeout(resolve, 3000)); // 1 minute
                    spammer(client, chatInfo.id, spamMessage);
                    console.log(`Spamming in supergroup: ${chatInfo.title}`);

                    await appendFile(__dirname + "/dump.csv", `${chatInfo.title},${Date.now()}\n`);




                }


            } catch (error) {
                console.log(error);
                continue;
            }
        }
    }





    await client.close();


}

main().then((value) => console.log(value)).catch((error) => console.log(error));
