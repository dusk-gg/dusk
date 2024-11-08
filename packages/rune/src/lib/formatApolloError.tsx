import { ApolloError } from "@apollo/client/index.js"

export function formatApolloError(
  error: ApolloError,
  messages: { [key: string]: string } & { default?: string }
) {
  for (const key of Object.keys(messages)) {
    if (error.message.includes(key)) return messages[key] as string
  }

  const pleaseMessage =
    "please contact us on our Discord server: https://discord.gg/rune-devs"

  const isNetworkError = !!error.networkError

  if (isNetworkError) {
    return `Network error detected. Please check your network connection and try again. In case the issue persists ${pleaseMessage}`
  }

  const defaultMessage =
    messages.default ||
    `Something went wrong. We'd love to help you, so ${pleaseMessage}`

  const isProduction = (process.env.STAGE ?? "production") === "production"

  return `${defaultMessage}. ${
    !isProduction && `Error details: ${JSON.stringify(error)}`
  }`
}
