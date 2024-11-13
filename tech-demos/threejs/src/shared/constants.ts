// how many character models we've got - 10 from KenneyNL
export const CHARACTER_MODEL_COUNT = 10
// The rate of update of the game logic - 10 FPS is enough for the data
// model to stay consistent
export const LOGIC_FPS = 10
// The speed players move at in ThreeJS units per second
export const MOVE_SPEED = 2
// The amount players can more per frame
export const MOVE_SPEED_PER_FRAME = MOVE_SPEED / LOGIC_FPS
// The speed that players turn - very quick so that changes in the direction
// are fast but smooth
export const TURN_SPEED = 10
// The amount that players are allowed to simple step up rather than jumping
// - for stairs
export const MAX_STEP_UP = 0.2
// The amount of gravity to apply - so how fast players fall and how fast
// jumping is decreased
export const GRAVITY = 0.2
// The amount of velocity to apply to players when they jump
export const JUMP_POWER = 0.4
// The rate at which the rendering is run - 30 FPS for low end mobile devices
export const RENDER_FPS = 30
