---
sidebar_position: 30
---

# AI

:::info
This is a preview API available for developers to test only. We'll enable it for production use soon.
:::

Using generative AI in your games can lead to fun and surprising gameplay. Rune provides an easy-to-use API for submitting large language model (LLM) prompts based on user actions, with responses fed back into the game logic.

## Using AI in your Game

To submit a prompt, call [`Rune.ai.promptRequest`](api-reference.md#runepromptrequest) with a list of messages the AI should process. Under the hood, this is fed to the GPT-4o mini LLM model provided by OpenAI. The response is returned to the game logic through [`Rune.ai.promptResponse`](api-reference.md#ai--promptresponse).

### Simple Text Prompts

Example of a single plain-text prompt:

```js
// logic.js
Rune.initLogic({
  actions: {
    myAction: (payload, { game }) => {
      game.requestId = Rune.ai.promptRequest({
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

The input messages use the `role` key, which maps to the [OpenAI API](https://platform.openai.com/docs/guides/completions), so you can provide both `user` and `system` roles. 

### Conversational Prompts

Since the AI API is **stateless**, you pass multiple messages in a single request to maintain conversation context. You can store the prompts and responses in the Rune game state to maintain context like this:

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
      game.requestId = Rune.ai.promptRequest({ messages: game.messages })
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
      game.requestId = Rune.ai.promptRequest({
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

### 1) Be Explicit

Define clear boundaries for AI responses to avoid unexpected behavior:

```plaintext
You are a cow. You may only respond with the word "Moo" or slight variations. Do not answer in human language or about topics a cow wouldn’t know.
```

### 2) Provide Examples

Include input-output examples and anti-examples to set expectations.

### 3) Use Ratings

Avoid yes/no questions. Instead, ask for weighted responses:

```plaintext
Rate the player’s interest in the conversation on a scale of 1 to 10.
```

### 4) Favor Unstructured Output

Avoid structured JSON responses for now. Instead, ask for specific formats and parse the result.

### 5) Animate During Prompts

AI responses take time—add animations or visual feedback to keep players engaged.

### 6) Account for Player Behavior

Players will test the limits of your AI. Anticipate challenges and ensure your prompts define acceptable behavior.

## Rate Limiting and Costs

:::info
This is a preview API available for developers to test only. We'll enable it for production use soon.
:::

The AI API is currently free for testing. Once in production, AI API usage will deduct Rune credits from the Creator Fund earnings.
