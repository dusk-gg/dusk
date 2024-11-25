---
sidebar_position: 30
---

# AI

:::info
This is a preview API available for developers to test only.
:::

Using generative AI in your games can lead to fun and surprising outcomes. Rune provides an easy-to-use API for submitting prompts based on user actions, with responses fed back into game logic.

## Using Rune AI

To submit a prompt, call [`Rune.ai.promptRequest`](api-reference.md#runepromptrequest) with a list of messages the AI should process. The response is returned to the game logic through [`Rune.ai.promptResponse`](api-reference.md#ai--promptresponse).

Since the AI API is **stateless**, it allows multiple messages in a single request to maintain context. 

The input messages require a `role` field, which maps to the [OpenAI API](https://platform.openai.com/docs/guides/completions).

### Simple Text Prompts

Example of a single plain-text prompt:

```js
// logic.js
Rune.initLogic({
  actions: {
    myAction: (payload, { game }) => {
      Rune.ai.promptRequest({
        messages: [{ role: "user", content: "What is Rune.ai?" }],
      })
    },
  },
  ai: {
    promptResponse: ({ requestId, response }) => {
      console.log(response)
    },
  },
})
```

### Conversational Prompts

Maintain conversation context by storing state as prompts are processed:

```js
// logic.js
Rune.initLogic({
  setup: () => ({
    messages: [],
  }),
  actions: {
    myAction: (payload, { game }) => {
      const message = { role: "user", content: payload.userQuestion }
      game.messages.push(message)
      Rune.ai.promptRequest({ messages: game.messages })
    },
  },
  ai: {
    promptResponse: ({ requestId, response }, { game }) => {
      console.log(response)
      game.messages.push({ role: "assistant", content: response })
    },
  },
})
```

### Image-Based Prompts

The AI can analyze images provided as **data URIs** (external URLs are unsupported):

```js
// logic.js
Rune.initLogic({
  actions: {
    myAction: (payload, { game }) => {
      const dataUri = /* Generate data URI, e.g., from canvas */
      Rune.ai.promptRequest({
        messages: [
          { role: "user", content: { type: "text", text: "What is Rune.ai?" } },
          { role: "user", content: { type: "image_data", image_url: dataUri } },
        ],
      })
    },
  },
  ai: {
    promptResponse: ({ requestId, response }) => {
      console.log(response)
    },
  },
})
```

## What Makes a Good Prompt

AI prompt engineering requires experimentation and refinement. While there’s no single right way to structure prompts, here are a few tips:

### Be Explicit

Define clear boundaries for AI responses to avoid unexpected behavior:

```plaintext
You are a cow. You may only respond with the word "Moo" or slight variations. Do not answer in human language or about topics a cow wouldn’t know.
```

### Provide Examples

Include input-output examples and anti-examples to set expectations.

### Use Ratings

Avoid yes/no questions. Instead, ask for weighted responses:

```plaintext
Rate the player’s interest in the conversation on a scale of 1 to 10.
```

### Favor Unstructured Output

Avoid structured JSON responses for now. Instead, ask for specific formats and parse the result.

### Animate During Prompts

AI responses take time—add animations or visual feedback to keep players engaged.

### Account for Player Behavior

Players will test the limits of your AI. Anticipate challenges and ensure your prompts define acceptable behavior.

## Rate Limiting and Costs

:::info
This is a preview API available for developers to test only.
:::

The AI API is currently free for testing. Once in production, AI API usage will deduct Rune credits from the Creator Fund earnings.
