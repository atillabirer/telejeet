import * as tdl from 'tdl'



export default async function(client: tdl.Client,chat_id: number,message: string): Promise<void>  {
    
    // Your code here to interact with Telegram API
    const response = await client.invoke({_: "sendMessage", chat_id,
        input_message_content: {
            _: 'inputMessageText',
            text: { _: 'formattedText', text: message },
            
        }
    })
    console.log(response);


}