import * as tdl from 'tdl'
import { getTdjson } from 'prebuilt-tdlib'
import type * as Td from 'tdlib-types';
import { createInterface } from "readline/promises";
import { stdin, stdout } from 'process';
import { readFile } from 'fs/promises';
import spammer from './spammer';

// import TDLib types:
// import type * as Td from 'tdlib-types'
tdl.configure({ tdjson: getTdjson() })


const client = tdl.createClient({
    apiId: 21563988, // Your api_id
    apiHash: '005db574e0dbf6d7e87ed81bc234c742'
})

client.on('error', console.error)
client.on('update', (update) => {
    if(update._ === 'updateNewChat') {
        console.log(`New chat: ${update.chat.title} (${update.chat.id})`);

    }
})
async function main() {
    const rl = createInterface({
        output: stdout,
        input: stdin
    })
    await client.login()


    const publicSearchRes = await client.invoke({ _: "getChats",limit: 300 });
    console.log("total results:", publicSearchRes.total_count);
    const spamMessage = await readFile(__dirname + '/spam_template.txt', 'utf8');

    for (const chat of publicSearchRes.chat_ids) {
        try {

            const chatInfo = await client.invoke({ _: "getChat", chat_id: chat });
            console.log("Chat title:", chatInfo.title);
            console.log("Chat type:",chatInfo.type);
            console.log("Can write:",chatInfo.permissions.can_send_basic_messages);
            if(chatInfo.type._ == "chatTypeSupergroup") {
                
                if(!chatInfo.type.is_channel && chatInfo.permissions.can_send_basic_messages) {
                    console.log(`Spamming in supergroup: ${chatInfo.title}`);
                    await spammer(client, chatInfo.id, spamMessage);

                   
                    //wait 300 seconds after join
                   await new Promise(resolve => setTimeout(resolve, 1000)); // 5 minutes
                    
                }
            }
            if(chatInfo.type._ == "chatTypeBasicGroup") {
                console.log(chatInfo.permissions.can_send_basic_messages);
                console.log(`Spamming in basic group: ${chatInfo.title}`);
                await spammer(client, chatInfo.id, spamMessage);
                await new Promise(resolve => setTimeout(resolve, 1000)); // 5 minutes
                
            }
           
        
        } catch (error) {
            console.log(error);
            continue;
        }
    }
    await client.close();


}

main().catch(console.error)