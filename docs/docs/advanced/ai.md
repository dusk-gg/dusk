---
sidebar_position: 30
---

# AI

:::info
This is a preview API that is available for developers to test only.
:::

Using generative AI in your games can lead to fun and surprising outcomes. Rune provides an easy API for submitting prompts to AI based on your user's actions. The response
to the prompt is fed back into the game logic.

## Using Rune AI
 
To submit a prompt you should call [`Rune.ai.promptRequest`](api-reference.md#runepromptrequest) passing the list of messages that the AI should process. The response
to the request is returned to the game logic through [`Rune.ai.promptResponse`](api-reference.md#ai--promptresponse). 

Since the AI API is stateless it allows multiple messages to be passed into the prompt to maintain context. 

The AI API input messages also requires the `role` field which maps the [OpenAI API](https://platform.openai.com/docs/guides/completions).

### Simple text prompts

To submit a single plain text prompt you can use:

```js
// logic.js
Rune.initLogic({
  actions: {
    myAction: (payload, { game }) => {
      Rune.ai.promptRequest({ messages: [{ role: "user", content: "What is Rune.ai?" }]})
    },
  },
  ai: {
    promptResponse({requestId, response}) => {
      console.log(response)
    },
  }
})
```

### Conversational prompts

If you're using the AI to maintain a conversation you need to record the state as the prompts are responded to so the AI has the context of the conversation:

```js
// logic.js
Rune.initLogic({
  setup: () => {
    return {
        messages: []
    }
  },
  actions: {
    myAction: (payload, { game }) => {
      const message = { role: "user", content: payload.userQuestion };
      game.messages.push(message)
      Rune.ai.promptRequest({ game.messages })
    },
  },
  ai: {
    promptResponse({requestId, response}, { game }) => {
      console.log(response)
      game.messages.push({ role: "assistant", content: response })
    },
  }
})
```

### Image based prompts

The AI can also analyze images provided through the API. Images must be data URIs. External images are not supported.

```js
// logic.js
Rune.initLogic({
  actions: {
    myAction: (payload, { game }) => {
      const dataUri = // data URI from canvas or similar
      Rune.ai.promptRequest(
        { messages: [
            { role: "user", content: { type: "text", text: "What is Rune.ai?" } },
            { role: "user", content: { type: "image_data", image_url: dataUri } }
        ]}
    },
  },
  ai: {
    promptResponse({requestId, response}) => {
      console.log(response)
    },
  }
})
```

## What makes a good prompt

AI prompt engineering takes experimentation and refining over time. Theres no one right answer to how a prompt should be written. We've built a few AI games and
recommend the following tips:

### Be explicit

AI is very flexible and as such its easy for your AI use to be manipulated by players for other reasons. Be explicit with what you want to allow the AI to do and
respond with. 

`You are a cow. You may only respond with the word 'Moo' and slightly variations on it. Do not answer questions in human language. Do not answer questions that a cow wouldn't know`

### Give examples

The AI works well if you give it examples of what you're expecting to the input and response to look like. Anti-examples can also work indicating exactly what you 
don't want to happen.

### Use ratings

When asking the AI to evaluate something avoid asking for a yes/no response. Instead ask the AI to weight its response.

`How interested is the player in the conversation given the input I will provide. Return a rating between 1 and 10.`

### Use unstructured output

The AI APIs can provide JSON as a response and its very tempting as a developer to use it. However, the current AI APIs give worse responses if they're asked
to give structured out. Instead ask the AI to write its response in a particular format and parse the text.

### Animate something during the prompt

AI responses can take a couple of seconds so its important to have something going on for the player while this is happen. A simple animation can be enough
to hide the pause.

### Consider what players might do

Remember that player will recognize AI and immediately try to outsmart whatever you've configured. We've had players submit threats, maths problems and coding 
challenges to NPCs that are farm hands. Make sure your prompt defines what should be allowed.

## Rate Limiting and Costs

:::info
This is a preview API that is available for developers to test only.
:::

The AI API is currently free to use for developers. When this feature is available for production games the use of the AI API will subtract Rune credits from
the Creator fund earnings of the game. 