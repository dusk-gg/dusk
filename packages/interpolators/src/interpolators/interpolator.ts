import { validateUpdateParams } from "../validation"
import { getDimensions, getPosition } from "../dimensions"
import { Interpolator } from "../types"

const runValidation = true

export function interpolator<
  Dimensions extends number | number[],
>(): Interpolator<Dimensions> {
  let game: Dimensions | undefined = undefined
  let futureGame: Dimensions | undefined = undefined

  let size: number | null = null

  return {
    update(params: { game: Dimensions; futureGame: Dimensions }) {
      //@ts-expect-error
      if ((game || futureGame || size) && !Rune._isOnChangeCalledByUpdate) {
        return
      }

      if (runValidation) {
        validateUpdateParams(params, size)
      }

      size = getDimensions(params.game)

      game = params.game
      futureGame = params.futureGame
    },

    getPosition(): Dimensions {
      return getPosition(game, futureGame, size)
    },
  }
}
