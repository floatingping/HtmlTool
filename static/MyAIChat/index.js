


const vm = new Vue({
    el: "#app",
    data: {
        chatGPTData: {
            apiKey: localStorage.getItem("chatGPTData.apiKey") ?? "",
            model: "gpt-3.5-turbo-0301",
            temperature: 0.7,
            max_tokens: 512,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0
        },
        codeModelOptions: `data
  .filter(item => item.id.startsWith("gpt"))
  .map(item => ({
    ...item,
    createUtc: new Date(item.created * 1000).toISOString()
  }))
  .sort((a, b) => a.created - b.created);`,
        modelOptions: `[
    {
        "id": "gpt-3.5-turbo",
        "object": "model",
        "created": 1677610602,
        "owned_by": "openai",
        "createUtc": "2023-02-28T18:56:42.000Z"
    },
    {
        "id": "gpt-3.5-turbo-0301",
        "object": "model",
        "created": 1677649963,
        "owned_by": "openai",
        "createUtc": "2023-03-01T05:52:43.000Z"
    },
    {
        "id": "gpt-3.5-turbo-16k",
        "object": "model",
        "created": 1683758102,
        "owned_by": "openai-internal",
        "createUtc": "2023-05-10T22:35:02.000Z"
    },
    {
        "id": "gpt-3.5-turbo-16k-0613",
        "object": "model",
        "created": 1685474247,
        "owned_by": "openai",
        "createUtc": "2023-05-30T19:17:27.000Z"
    },
    {
        "id": "gpt-3.5-turbo-0613",
        "object": "model",
        "created": 1686587434,
        "owned_by": "openai",
        "createUtc": "2023-06-12T16:30:34.000Z"
    },
    {
        "id": "gpt-4-0613",
        "object": "model",
        "created": 1686588896,
        "owned_by": "openai",
        "createUtc": "2023-06-12T16:54:56.000Z"
    },
    {
        "id": "gpt-4",
        "object": "model",
        "created": 1687882411,
        "owned_by": "openai",
        "createUtc": "2023-06-27T16:13:31.000Z"
    },
    {
        "id": "gpt-3.5-turbo-instruct",
        "object": "model",
        "created": 1692901427,
        "owned_by": "system",
        "createUtc": "2023-08-24T18:23:47.000Z"
    },
    {
        "id": "gpt-3.5-turbo-instruct-0914",
        "object": "model",
        "created": 1694122472,
        "owned_by": "system",
        "createUtc": "2023-09-07T21:34:32.000Z"
    },
    {
        "id": "gpt-4-vision-preview",
        "object": "model",
        "created": 1698894917,
        "owned_by": "system",
        "createUtc": "2023-11-02T03:15:17.000Z"
    },
    {
        "id": "gpt-4-1106-preview",
        "object": "model",
        "created": 1698957206,
        "owned_by": "system",
        "createUtc": "2023-11-02T20:33:26.000Z"
    },
    {
        "id": "gpt-3.5-turbo-1106",
        "object": "model",
        "created": 1698959748,
        "owned_by": "system",
        "createUtc": "2023-11-02T21:15:48.000Z"
    },
    {
        "id": "gpt-4-0125-preview",
        "object": "model",
        "created": 1706037612,
        "owned_by": "system",
        "createUtc": "2024-01-23T19:20:12.000Z"
    },
    {
        "id": "gpt-4-turbo-preview",
        "object": "model",
        "created": 1706037777,
        "owned_by": "system",
        "createUtc": "2024-01-23T19:22:57.000Z"
    },
    {
        "id": "gpt-3.5-turbo-0125",
        "object": "model",
        "created": 1706048358,
        "owned_by": "system",
        "createUtc": "2024-01-23T22:19:18.000Z"
    },
    {
        "id": "gpt-4-1106-vision-preview",
        "object": "model",
        "created": 1711473033,
        "owned_by": "system",
        "createUtc": "2024-03-26T17:10:33.000Z"
    },
    {
        "id": "gpt-4-turbo",
        "object": "model",
        "created": 1712361441,
        "owned_by": "system",
        "createUtc": "2024-04-05T23:57:21.000Z"
    },
    {
        "id": "gpt-4-turbo-2024-04-09",
        "object": "model",
        "created": 1712601677,
        "owned_by": "system",
        "createUtc": "2024-04-08T18:41:17.000Z"
    },
    {
        "id": "gpt-4o",
        "object": "model",
        "created": 1715367049,
        "owned_by": "system",
        "createUtc": "2024-05-10T18:50:49.000Z"
    },
    {
        "id": "gpt-4o-2024-05-13",
        "object": "model",
        "created": 1715368132,
        "owned_by": "system",
        "createUtc": "2024-05-10T19:08:52.000Z"
    }
]`,
        introMessages: localStorage.getItem("introMessages") ?? `[
    {
        "role": "system",
        "content": "You will be provided with Python code."
    }
]`,
        message: "",
        resMessages: [""]
    },
    methods: {
        setChatApiKey(apiKey) {
            localStorage.setItem("chatGPTData.apiKey", apiKey);
            this.chatGPTData.apiKey = apiKey;
        },
        setIntroMessages(script) {
            localStorage.setItem("introMessages", script);
            this.introMessages = script;
        },
        saveApiKeyToLocal() {
            this.setChatApiKey(this.chatGPTData.apiKey);
        },
        saveIntroMessagesToLocal() {
            this.setIntroMessages(this.introMessages);
        },
        getAuthorization() {
            if (!this.chatGPTData.apiKey) throw new Error("no apiKey");
            return `Bearer ${this.chatGPTData.apiKey}`;
        },
        async sendAsync() {
            try {

                this.resMessages = ["..."];
                const reqData = {
                    model: this.chatGPTData.model,
                    messages: JSON.parse(this.introMessages).concat({
                        role: "user",
                        content: [
                            {
                                type: "text",
                                text: this.message
                            }
                        ]
                    }),
                    temperature: Number(this.chatGPTData.temperature),
                    max_tokens: Number(this.chatGPTData.max_tokens),
                    top_p: Number(this.chatGPTData.top_p),
                    frequency_penalty: Number(this.chatGPTData.frequency_penalty),
                    presence_penalty: Number(this.chatGPTData.presence_penalty),
                };

                const res = await axios({
                    method: "post",
                    url: "https://api.openai.com/v1/chat/completions",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": this.getAuthorization()
                    },
                    data: JSON.stringify(reqData)
                });

                console.log(res.data);
                this.resMessages = res.data.choices.map(c => c.message?.content);
            } catch (e) {
                console.error(e);
                alert(e.message);
            }
        }
    }
})