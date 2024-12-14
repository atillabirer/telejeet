import * as tdl from "tdl";

export default async function(client: tdl.Client, chat_id: number, chat_title: string) {

    // join the telegram chat by id
    const response = await client.invoke({
    _: "joinChat",
    chat_id: chat_id,
    });
    console.log(response);
    

}