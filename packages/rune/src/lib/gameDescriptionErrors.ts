import { ApolloError } from "@apollo/client/errors/index.js"

import { formatApolloError } from "./formatApolloError.js"

export function gameDescriptionErrors(error: ApolloError) {
  return formatApolloError(error, {
    "[tango][CREATE_GAME_FAILED_TITLE_TAKEN]":
      "This game title is already taken, try something else",
    "[tango][CREATE_GAME_FAILED_TITLE_INVALID]":
      "This game title is invalid, it has to be between 5 and 25 characters, and only letters, numbers, and spaces are allowed",
    "[tango][IMAGE_WRONG_FORMAT]": "Not an image file",
    "[tango][UNEXPECTED_TRANSPARENCY]": "Image should not contain transparency",
  })
}
