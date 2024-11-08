import {
  FieldPolicy,
  FieldReadFunction,
  TypePolicies,
  TypePolicy,
} from "@apollo/client/cache"
import { TypedDocumentNode as DocumentNode } from "@graphql-typed-document-node/core"
export type Maybe<T> = T | null
export type InputMaybe<T> = Maybe<T>
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K]
}
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>
}
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>
}
/** All built-in and custom scalars, mapped to their actual values */
export interface Scalars {
  ID: string
  String: string
  Boolean: boolean
  Int: number
  Float: number
  Cursor: any
  Datetime: string
  Upload: { content: Buffer; name: string; type: string }
}

export interface CheckVerificationInput {
  clientMutationId?: InputMaybe<Scalars["String"]>
  verificationToken: Scalars["String"]
}

export interface CheckVerificationPayload {
  __typename: "CheckVerificationPayload"
  authToken: Maybe<Scalars["String"]>
  clientMutationId: Maybe<Scalars["String"]>
}

export interface CreateGameInput {
  clientMutationId?: InputMaybe<Scalars["String"]>
  description?: InputMaybe<Scalars["String"]>
  /** @deprecated: Use previewImg */
  logo?: InputMaybe<Scalars["Upload"]>
  previewImg?: InputMaybe<Scalars["Upload"]>
  title: Scalars["String"]
  type: GameType
}

export interface CreateGamePayload {
  __typename: "CreateGamePayload"
  clientMutationId: Maybe<Scalars["String"]>
  game: Game
}

export interface CreateGameVersionInput {
  clientMutationId?: InputMaybe<Scalars["String"]>
  content: Scalars["Upload"]
  gameId: Scalars["Int"]
  isDraft?: InputMaybe<Scalars["Boolean"]>
  postToDiscord?: InputMaybe<Scalars["Boolean"]>
}

export interface CreateGameVersionPayload {
  __typename: "CreateGameVersionPayload"
  clientMutationId: Maybe<Scalars["String"]>
  congratulationMsg: Maybe<Scalars["String"]>
  gameVersion: GameVersion
  previewLink: Scalars["String"]
}

export interface DashboardMagicLinkInput {
  clientMutationId?: InputMaybe<Scalars["String"]>
}

export interface DashboardMagicLinkPayload {
  __typename: "DashboardMagicLinkPayload"
  clientMutationId: Maybe<Scalars["String"]>
  dashboardMagicLink: Scalars["String"]
}

export interface Game {
  __typename: "Game"
  appId: Maybe<Scalars["Int"]>
  /** @deprecated true */
  blurredImgDataUrl: Maybe<Scalars["String"]>
  /** (Denormalized) Total number of comments . */
  commentCount: Scalars["Int"]
  createdAt: Scalars["Datetime"]
  description: Maybe<Scalars["String"]>
  /** Reads and enables pagination through a set of `GameDev`. */
  gameDevs: GameDevsConnection
  /** Reads and enables pagination through a set of `GameVersion`. */
  gameVersions: GameVersionsConnection
  id: Scalars["Int"]
  /** @deprecated true */
  isAllowedInsideRoom: Scalars["Boolean"]
  logoUrl: Scalars["String"]
  playTime: Scalars["Float"]
  players: Scalars["Int"]
  plays: Scalars["Int"]
  previewImgUrl: Maybe<Scalars["String"]>
  title: Scalars["String"]
  type: GameType
  updatedAt: Scalars["Datetime"]
}

export interface GameGameDevsArgs {
  after?: InputMaybe<Scalars["Cursor"]>
  before?: InputMaybe<Scalars["Cursor"]>
  first?: InputMaybe<Scalars["Int"]>
  last?: InputMaybe<Scalars["Int"]>
  offset?: InputMaybe<Scalars["Int"]>
}

export interface GameGameVersionsArgs {
  after?: InputMaybe<Scalars["Cursor"]>
  before?: InputMaybe<Scalars["Cursor"]>
  condition?: InputMaybe<GameVersionCondition>
  first?: InputMaybe<Scalars["Int"]>
  last?: InputMaybe<Scalars["Int"]>
  offset?: InputMaybe<Scalars["Int"]>
  orderBy?: InputMaybe<Array<GameVersionsOrderBy>>
}

/** A condition to be used against `Game` object types. All fields are tested for equality and combined with a logical ‘and.’ */
export interface GameCondition {
  /** Checks for equality with the object’s `appId` field. */
  appId?: InputMaybe<Scalars["Int"]>
  /** Checks for equality with the object’s `id` field. */
  id?: InputMaybe<Scalars["Int"]>
}

export interface GameDev {
  __typename: "GameDev"
  /** @deprecated: use GameDev.userProfileEditable */
  displayName: Maybe<Scalars["String"]>
  /** Reads a single `Game` that is related to this `GameDev`. */
  game: Maybe<Game>
  gameId: Scalars["Int"]
  status: GameDevStatus
  type: GameDevType
  userId: Scalars["Int"]
  userProfileEditable: Maybe<UserProfileEditable>
}

export enum GameDevStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  INVITED = "INVITED",
}

export enum GameDevType {
  ADMIN = "ADMIN",
  DEV = "DEV",
  TESTER = "TESTER",
}

/** A connection to a list of `GameDev` values. */
export interface GameDevsConnection {
  __typename: "GameDevsConnection"
  /** A list of edges which contains the `GameDev` and cursor to aid in pagination. */
  edges: Array<GameDevsEdge>
  /** A list of `GameDev` objects. */
  nodes: Array<GameDev>
  /** Information to aid in pagination. */
  pageInfo: PageInfo
  /** The count of *all* `GameDev` you could get from the connection. */
  totalCount: Scalars["Int"]
}

/** A `GameDev` edge in the connection. */
export interface GameDevsEdge {
  __typename: "GameDevsEdge"
  /** A cursor for use in pagination. */
  cursor: Maybe<Scalars["Cursor"]>
  /** The `GameDev` at the end of the edge. */
  node: GameDev
}

export enum GameType {
  EXTERNAL = "EXTERNAL",
  MULTIPLAYER = "MULTIPLAYER",
}

export interface GameVersion {
  __typename: "GameVersion"
  createdByDevId: Scalars["Int"]
  /** Reads a single `Game` that is related to this `GameVersion`. */
  game: Maybe<Game>
  gameId: Scalars["Int"]
  gameVersionId: Scalars["Int"]
  key: Scalars["String"]
  landscape: Scalars["Boolean"]
  multiplayerMaxPlayers: Scalars["Int"]
  multiplayerMinPlayers: Scalars["Int"]
  multiplayerSupportsPlayerJoining: Scalars["Boolean"]
  multiplayerSupportsPlayerLeaving: Scalars["Boolean"]
  persistPlayerData: Scalars["Boolean"]
  sdkVersion: Scalars["String"]
  status: GameVersionStatus
  updatesPerSecond: Scalars["Int"]
  usesUpdates: Scalars["Boolean"]
}

/**
 * A condition to be used against `GameVersion` object types. All fields are tested
 * for equality and combined with a logical ‘and.’
 */
export interface GameVersionCondition {
  /** Checks for equality with the object’s `gameId` field. */
  gameId?: InputMaybe<Scalars["Int"]>
  /** Checks for equality with the object’s `key` field. */
  key?: InputMaybe<Scalars["String"]>
}

export enum GameVersionStatus {
  ACTIVE = "ACTIVE",
  DRAFT = "DRAFT",
  INACTIVE = "INACTIVE",
  IN_REVIEW = "IN_REVIEW",
  UPLOADING = "UPLOADING",
}

/** A connection to a list of `GameVersion` values. */
export interface GameVersionsConnection {
  __typename: "GameVersionsConnection"
  /** A list of edges which contains the `GameVersion` and cursor to aid in pagination. */
  edges: Array<GameVersionsEdge>
  /** A list of `GameVersion` objects. */
  nodes: Array<GameVersion>
  /** Information to aid in pagination. */
  pageInfo: PageInfo
  /** The count of *all* `GameVersion` you could get from the connection. */
  totalCount: Scalars["Int"]
}

/** A `GameVersion` edge in the connection. */
export interface GameVersionsEdge {
  __typename: "GameVersionsEdge"
  /** A cursor for use in pagination. */
  cursor: Maybe<Scalars["Cursor"]>
  /** The `GameVersion` at the end of the edge. */
  node: GameVersion
}

/** Methods to use when ordering `GameVersion`. */
export enum GameVersionsOrderBy {
  GAME_ID_ASC = "GAME_ID_ASC",
  GAME_ID_DESC = "GAME_ID_DESC",
  KEY_ASC = "KEY_ASC",
  KEY_DESC = "KEY_DESC",
  NATURAL = "NATURAL",
  PRIMARY_KEY_ASC = "PRIMARY_KEY_ASC",
  PRIMARY_KEY_DESC = "PRIMARY_KEY_DESC",
}

/** A connection to a list of `Game` values. */
export interface GamesConnection {
  __typename: "GamesConnection"
  /** A list of edges which contains the `Game` and cursor to aid in pagination. */
  edges: Array<GamesEdge>
  /** A list of `Game` objects. */
  nodes: Array<Game>
  /** Information to aid in pagination. */
  pageInfo: PageInfo
  /** The count of *all* `Game` you could get from the connection. */
  totalCount: Scalars["Int"]
}

/** A `Game` edge in the connection. */
export interface GamesEdge {
  __typename: "GamesEdge"
  /** A cursor for use in pagination. */
  cursor: Maybe<Scalars["Cursor"]>
  /** The `Game` at the end of the edge. */
  node: Game
}

/** Methods to use when ordering `Game`. */
export enum GamesOrderBy {
  APP_ID_ASC = "APP_ID_ASC",
  APP_ID_DESC = "APP_ID_DESC",
  ID_ASC = "ID_ASC",
  ID_DESC = "ID_DESC",
  NATURAL = "NATURAL",
  PRIMARY_KEY_ASC = "PRIMARY_KEY_ASC",
  PRIMARY_KEY_DESC = "PRIMARY_KEY_DESC",
}

export interface InviteGameDevInput {
  clientMutationId?: InputMaybe<Scalars["String"]>
  gameId: Scalars["Int"]
  type: GameDevType
  userTag: Scalars["String"]
}

export interface InviteGameDevPayload {
  __typename: "InviteGameDevPayload"
  clientMutationId: Maybe<Scalars["String"]>
}

export interface Me {
  __typename: "Me"
  admin: Scalars["Boolean"]
  devId: Scalars["Int"]
  displayName: Scalars["String"]
  email: Maybe<Scalars["String"]>
}

/** The root mutation type which contains root level fields which mutate data. */
export interface Mutation {
  __typename: "Mutation"
  checkVerification: CheckVerificationPayload
  createDashboardMagicLink: DashboardMagicLinkPayload
  createGame: CreateGamePayload
  createGameVersion: CreateGameVersionPayload
  inviteGameDev: InviteGameDevPayload
  requestPayout: RequestPayoutPayload
  startVerification: StartVerificationPayload
  updateGame: UpdateGamePayload
  updateGameDev: UpdateGameDevPayload
  updateGameSdk: UpdateGameSdkPayload
}

/** The root mutation type which contains root level fields which mutate data. */
export interface MutationCheckVerificationArgs {
  input: CheckVerificationInput
}

/** The root mutation type which contains root level fields which mutate data. */
export interface MutationCreateDashboardMagicLinkArgs {
  input: DashboardMagicLinkInput
}

/** The root mutation type which contains root level fields which mutate data. */
export interface MutationCreateGameArgs {
  input: CreateGameInput
}

/** The root mutation type which contains root level fields which mutate data. */
export interface MutationCreateGameVersionArgs {
  input: CreateGameVersionInput
}

/** The root mutation type which contains root level fields which mutate data. */
export interface MutationInviteGameDevArgs {
  input: InviteGameDevInput
}

/** The root mutation type which contains root level fields which mutate data. */
export interface MutationRequestPayoutArgs {
  input: RequestPayoutInput
}

/** The root mutation type which contains root level fields which mutate data. */
export interface MutationStartVerificationArgs {
  input: StartVerificationInput
}

/** The root mutation type which contains root level fields which mutate data. */
export interface MutationUpdateGameArgs {
  input: UpdateGameInput
}

/** The root mutation type which contains root level fields which mutate data. */
export interface MutationUpdateGameDevArgs {
  input: UpdateGameDevInput
}

/** The root mutation type which contains root level fields which mutate data. */
export interface MutationUpdateGameSdkArgs {
  input: UpdateGameSdkInput
}

/** Information about pagination in a connection. */
export interface PageInfo {
  __typename: "PageInfo"
  /** When paginating forwards, the cursor to continue. */
  endCursor: Maybe<Scalars["Cursor"]>
  /** When paginating forwards, are there more items? */
  hasNextPage: Scalars["Boolean"]
  /** When paginating backwards, are there more items? */
  hasPreviousPage: Scalars["Boolean"]
  /** When paginating backwards, the cursor to continue. */
  startCursor: Maybe<Scalars["Cursor"]>
}

/** The root query type which gives access points into the data universe. */
export interface Query {
  __typename: "Query"
  gameByAppId: Maybe<Game>
  gameById: Maybe<Game>
  gameVersionByGameIdAndGameVersionId: Maybe<GameVersion>
  gameVersionByKey: Maybe<GameVersion>
  /** Reads and enables pagination through a set of `GameVersion`. */
  gameVersions: Maybe<GameVersionsConnection>
  /** Reads and enables pagination through a set of `Game`. */
  games: Maybe<GamesConnection>
  me: Me
  /**
   * Exposes the root query type nested one level down. This is helpful for Relay 1
   * which can only query top level fields if they are in a particular form.
   */
  query: Query
  userDevByUserId: Maybe<UserDev>
  /** Reads and enables pagination through a set of `UserDev`. */
  userDevs: Maybe<UserDevsConnection>
  /** Reads and enables pagination through a set of `UserPrivateReadonly`. */
  userPrivateReadonlies: Maybe<UserPrivateReadonliesConnection>
  userPrivateReadonlyByEmail: Maybe<UserPrivateReadonly>
  userPrivateReadonlyByUserId: Maybe<UserPrivateReadonly>
  userProfileEditableByUserId: Maybe<UserProfileEditable>
  /** Reads and enables pagination through a set of `UserProfileEditable`. */
  userProfileEditables: Maybe<UserProfileEditablesConnection>
}

/** The root query type which gives access points into the data universe. */
export interface QueryGameByAppIdArgs {
  appId: Scalars["Int"]
}

/** The root query type which gives access points into the data universe. */
export interface QueryGameByIdArgs {
  id: Scalars["Int"]
}

/** The root query type which gives access points into the data universe. */
export interface QueryGameVersionByGameIdAndGameVersionIdArgs {
  gameId: Scalars["Int"]
  gameVersionId: Scalars["Int"]
}

/** The root query type which gives access points into the data universe. */
export interface QueryGameVersionByKeyArgs {
  key: Scalars["String"]
}

/** The root query type which gives access points into the data universe. */
export interface QueryGameVersionsArgs {
  after?: InputMaybe<Scalars["Cursor"]>
  before?: InputMaybe<Scalars["Cursor"]>
  condition?: InputMaybe<GameVersionCondition>
  first?: InputMaybe<Scalars["Int"]>
  last?: InputMaybe<Scalars["Int"]>
  offset?: InputMaybe<Scalars["Int"]>
  orderBy?: InputMaybe<Array<GameVersionsOrderBy>>
}

/** The root query type which gives access points into the data universe. */
export interface QueryGamesArgs {
  after?: InputMaybe<Scalars["Cursor"]>
  before?: InputMaybe<Scalars["Cursor"]>
  condition?: InputMaybe<GameCondition>
  first?: InputMaybe<Scalars["Int"]>
  last?: InputMaybe<Scalars["Int"]>
  offset?: InputMaybe<Scalars["Int"]>
  orderBy?: InputMaybe<Array<GamesOrderBy>>
}

/** The root query type which gives access points into the data universe. */
export interface QueryUserDevByUserIdArgs {
  userId: Scalars["Int"]
}

/** The root query type which gives access points into the data universe. */
export interface QueryUserDevsArgs {
  after?: InputMaybe<Scalars["Cursor"]>
  before?: InputMaybe<Scalars["Cursor"]>
  condition?: InputMaybe<UserDevCondition>
  first?: InputMaybe<Scalars["Int"]>
  last?: InputMaybe<Scalars["Int"]>
  offset?: InputMaybe<Scalars["Int"]>
  orderBy?: InputMaybe<Array<UserDevsOrderBy>>
}

/** The root query type which gives access points into the data universe. */
export interface QueryUserPrivateReadonliesArgs {
  after?: InputMaybe<Scalars["Cursor"]>
  before?: InputMaybe<Scalars["Cursor"]>
  condition?: InputMaybe<UserPrivateReadonlyCondition>
  first?: InputMaybe<Scalars["Int"]>
  last?: InputMaybe<Scalars["Int"]>
  offset?: InputMaybe<Scalars["Int"]>
  orderBy?: InputMaybe<Array<UserPrivateReadonliesOrderBy>>
}

/** The root query type which gives access points into the data universe. */
export interface QueryUserPrivateReadonlyByEmailArgs {
  email: Scalars["String"]
}

/** The root query type which gives access points into the data universe. */
export interface QueryUserPrivateReadonlyByUserIdArgs {
  userId: Scalars["Int"]
}

/** The root query type which gives access points into the data universe. */
export interface QueryUserProfileEditableByUserIdArgs {
  userId: Scalars["Int"]
}

/** The root query type which gives access points into the data universe. */
export interface QueryUserProfileEditablesArgs {
  after?: InputMaybe<Scalars["Cursor"]>
  before?: InputMaybe<Scalars["Cursor"]>
  condition?: InputMaybe<UserProfileEditableCondition>
  first?: InputMaybe<Scalars["Int"]>
  last?: InputMaybe<Scalars["Int"]>
  offset?: InputMaybe<Scalars["Int"]>
  orderBy?: InputMaybe<Array<UserProfileEditablesOrderBy>>
}

export interface RequestPayoutInput {
  amount: Scalars["Int"]
  clientMutationId?: InputMaybe<Scalars["String"]>
}

export interface RequestPayoutPayload {
  __typename: "RequestPayoutPayload"
  clientMutationId: Maybe<Scalars["String"]>
}

export interface StartVerificationInput {
  clientMutationId?: InputMaybe<Scalars["String"]>
  email: Scalars["String"]
}

export interface StartVerificationPayload {
  __typename: "StartVerificationPayload"
  clientMutationId: Maybe<Scalars["String"]>
  verificationToken: Scalars["String"]
}

export interface UpdateGameDevInput {
  clientMutationId?: InputMaybe<Scalars["String"]>
  gameId: Scalars["Int"]
  /** Use null to remove game dev from the team */
  type?: InputMaybe<GameDevType>
  userId: Scalars["Int"]
}

export interface UpdateGameDevPayload {
  __typename: "UpdateGameDevPayload"
  clientMutationId: Maybe<Scalars["String"]>
}

export interface UpdateGameInput {
  clientMutationId?: InputMaybe<Scalars["String"]>
  description?: InputMaybe<Scalars["String"]>
  gameId: Scalars["Int"]
  logo?: InputMaybe<Scalars["Upload"]>
  previewImg?: InputMaybe<Scalars["Upload"]>
  title?: InputMaybe<Scalars["String"]>
}

export interface UpdateGamePayload {
  __typename: "UpdateGamePayload"
  clientMutationId: Maybe<Scalars["String"]>
  game: Game
}

export interface UpdateGameSdkInput {
  clientMutationId?: InputMaybe<Scalars["String"]>
  gameId: Scalars["Int"]
}

export interface UpdateGameSdkPayload {
  __typename: "UpdateGameSdkPayload"
  clientMutationId: Maybe<Scalars["String"]>
  error: Maybe<Scalars["String"]>
  success: Scalars["Boolean"]
}

export interface UserDev {
  __typename: "UserDev"
  badge: Maybe<UserDevBadge>
  createdAt: Scalars["Datetime"]
  updatedAt: Scalars["Datetime"]
  userId: Scalars["Int"]
}

export enum UserDevBadge {
  TOP_DEVELOPER = "TOP_DEVELOPER",
}

/** A condition to be used against `UserDev` object types. All fields are tested for equality and combined with a logical ‘and.’ */
export interface UserDevCondition {
  /** Checks for equality with the object’s `userId` field. */
  userId?: InputMaybe<Scalars["Int"]>
}

/** A connection to a list of `UserDev` values. */
export interface UserDevsConnection {
  __typename: "UserDevsConnection"
  /** A list of edges which contains the `UserDev` and cursor to aid in pagination. */
  edges: Array<UserDevsEdge>
  /** A list of `UserDev` objects. */
  nodes: Array<UserDev>
  /** Information to aid in pagination. */
  pageInfo: PageInfo
  /** The count of *all* `UserDev` you could get from the connection. */
  totalCount: Scalars["Int"]
}

/** A `UserDev` edge in the connection. */
export interface UserDevsEdge {
  __typename: "UserDevsEdge"
  /** A cursor for use in pagination. */
  cursor: Maybe<Scalars["Cursor"]>
  /** The `UserDev` at the end of the edge. */
  node: UserDev
}

/** Methods to use when ordering `UserDev`. */
export enum UserDevsOrderBy {
  NATURAL = "NATURAL",
  PRIMARY_KEY_ASC = "PRIMARY_KEY_ASC",
  PRIMARY_KEY_DESC = "PRIMARY_KEY_DESC",
  USER_ID_ASC = "USER_ID_ASC",
  USER_ID_DESC = "USER_ID_DESC",
}

/** A connection to a list of `UserPrivateReadonly` values. */
export interface UserPrivateReadonliesConnection {
  __typename: "UserPrivateReadonliesConnection"
  /** A list of edges which contains the `UserPrivateReadonly` and cursor to aid in pagination. */
  edges: Array<UserPrivateReadonliesEdge>
  /** A list of `UserPrivateReadonly` objects. */
  nodes: Array<UserPrivateReadonly>
  /** Information to aid in pagination. */
  pageInfo: PageInfo
  /** The count of *all* `UserPrivateReadonly` you could get from the connection. */
  totalCount: Scalars["Int"]
}

/** A `UserPrivateReadonly` edge in the connection. */
export interface UserPrivateReadonliesEdge {
  __typename: "UserPrivateReadonliesEdge"
  /** A cursor for use in pagination. */
  cursor: Maybe<Scalars["Cursor"]>
  /** The `UserPrivateReadonly` at the end of the edge. */
  node: UserPrivateReadonly
}

/** Methods to use when ordering `UserPrivateReadonly`. */
export enum UserPrivateReadonliesOrderBy {
  EMAIL_ASC = "EMAIL_ASC",
  EMAIL_DESC = "EMAIL_DESC",
  NATURAL = "NATURAL",
  USER_ID_ASC = "USER_ID_ASC",
  USER_ID_DESC = "USER_ID_DESC",
}

/** Contains sensitive information that can only be read by the user themself. They cannot update this table directly as that could cause issues with data integrity (e.g. phone verification, current room, etc.). */
export interface UserPrivateReadonly {
  __typename: "UserPrivateReadonly"
  email: Maybe<Scalars["String"]>
  userId: Scalars["Int"]
}

/**
 * A condition to be used against `UserPrivateReadonly` object types. All fields
 * are tested for equality and combined with a logical ‘and.’
 */
export interface UserPrivateReadonlyCondition {
  /** Checks for equality with the object’s `email` field. */
  email?: InputMaybe<Scalars["String"]>
  /** Checks for equality with the object’s `userId` field. */
  userId?: InputMaybe<Scalars["Int"]>
}

export interface UserProfileEditable {
  __typename: "UserProfileEditable"
  displayName: Scalars["String"]
  userId: Scalars["Int"]
}

/**
 * A condition to be used against `UserProfileEditable` object types. All fields
 * are tested for equality and combined with a logical ‘and.’
 */
export interface UserProfileEditableCondition {
  /** Checks for equality with the object’s `userId` field. */
  userId?: InputMaybe<Scalars["Int"]>
}

/** A connection to a list of `UserProfileEditable` values. */
export interface UserProfileEditablesConnection {
  __typename: "UserProfileEditablesConnection"
  /** A list of edges which contains the `UserProfileEditable` and cursor to aid in pagination. */
  edges: Array<UserProfileEditablesEdge>
  /** A list of `UserProfileEditable` objects. */
  nodes: Array<UserProfileEditable>
  /** Information to aid in pagination. */
  pageInfo: PageInfo
  /** The count of *all* `UserProfileEditable` you could get from the connection. */
  totalCount: Scalars["Int"]
}

/** A `UserProfileEditable` edge in the connection. */
export interface UserProfileEditablesEdge {
  __typename: "UserProfileEditablesEdge"
  /** A cursor for use in pagination. */
  cursor: Maybe<Scalars["Cursor"]>
  /** The `UserProfileEditable` at the end of the edge. */
  node: UserProfileEditable
}

/** Methods to use when ordering `UserProfileEditable`. */
export enum UserProfileEditablesOrderBy {
  NATURAL = "NATURAL",
  USER_ID_ASC = "USER_ID_ASC",
  USER_ID_DESC = "USER_ID_DESC",
}

export type CheckVerificationMutationVariables = Exact<{
  verificationToken: Scalars["String"]
}>

export type CheckVerificationMutation = {
  __typename: "Mutation"
  checkVerification: {
    __typename: "CheckVerificationPayload"
    authToken: string | null
  }
}

export type CreateGameMutationVariables = Exact<{
  game: CreateGameInput
}>

export type CreateGameMutation = {
  __typename: "Mutation"
  createGame: {
    __typename: "CreateGamePayload"
    game: { __typename: "Game"; id: number }
  }
}

export type CreateGameVersionMutationVariables = Exact<{
  gameId: Scalars["Int"]
  content: Scalars["Upload"]
  isDraft: Scalars["Boolean"]
  postToDiscord: Scalars["Boolean"]
}>

export type CreateGameVersionMutation = {
  __typename: "Mutation"
  createGameVersion: {
    __typename: "CreateGameVersionPayload"
    previewLink: string
    congratulationMsg: string | null
    gameVersion: {
      __typename: "GameVersion"
      gameId: number
      gameVersionId: number
    }
  }
}

export type GameQueryVariables = Exact<{
  id: Scalars["Int"]
}>

export type GameQuery = {
  __typename: "Query"
  gameById: {
    __typename: "Game"
    id: number
    title: string
    description: string | null
    createdAt: string
    gameDevs: {
      __typename: "GameDevsConnection"
      nodes: Array<{
        __typename: "GameDev"
        userId: number
        displayName: string | null
        type: GameDevType
      }>
    }
    gameVersions: {
      __typename: "GameVersionsConnection"
      nodes: Array<{
        __typename: "GameVersion"
        gameId: number
        gameVersionId: number
        status: GameVersionStatus
      }>
    }
  } | null
}

export type GamesQueryVariables = Exact<{ [key: string]: never }>

export type GamesQuery = {
  __typename: "Query"
  games: {
    __typename: "GamesConnection"
    nodes: Array<{
      __typename: "Game"
      id: number
      title: string
      description: string | null
      gameDevs: {
        __typename: "GameDevsConnection"
        nodes: Array<{
          __typename: "GameDev"
          userId: number
          displayName: string | null
          type: GameDevType
        }>
      }
      gameVersions: {
        __typename: "GameVersionsConnection"
        nodes: Array<{
          __typename: "GameVersion"
          gameId: number
          gameVersionId: number
          status: GameVersionStatus
        }>
      }
    }>
  } | null
}

export type InviteGameDevMutationVariables = Exact<{
  input: InviteGameDevInput
}>

export type InviteGameDevMutation = {
  __typename: "Mutation"
  inviteGameDev: {
    __typename: "InviteGameDevPayload"
    clientMutationId: string | null
  }
}

export type CreateDashboardMagicLinkMutationVariables = Exact<{
  input: DashboardMagicLinkInput
}>

export type CreateDashboardMagicLinkMutation = {
  __typename: "Mutation"
  createDashboardMagicLink: {
    __typename: "DashboardMagicLinkPayload"
    clientMutationId: string | null
    dashboardMagicLink: string
  }
}

export type MeQueryVariables = Exact<{ [key: string]: never }>

export type MeQuery = {
  __typename: "Query"
  me: {
    __typename: "Me"
    devId: number
    displayName: string
    email: string | null
    admin: boolean
  }
}

export type StartVerificationMutationVariables = Exact<{
  email: Scalars["String"]
}>

export type StartVerificationMutation = {
  __typename: "Mutation"
  startVerification: {
    __typename: "StartVerificationPayload"
    verificationToken: string
  }
}

export type UpdateGameMutationVariables = Exact<{
  input: UpdateGameInput
}>

export type UpdateGameMutation = {
  __typename: "Mutation"
  updateGame: {
    __typename: "UpdateGamePayload"
    game: { __typename: "Game"; id: number; title: string }
  }
}

export type UpdateGameDevMutationVariables = Exact<{
  input: UpdateGameDevInput
}>

export type UpdateGameDevMutation = {
  __typename: "Mutation"
  updateGameDev: {
    __typename: "UpdateGameDevPayload"
    clientMutationId: string | null
  }
}

export type UpdateGameSdkMutationVariables = Exact<{
  input: UpdateGameSdkInput
}>

export type UpdateGameSdkMutation = {
  __typename: "Mutation"
  updateGameSdk: {
    __typename: "UpdateGameSdkPayload"
    success: boolean
    error: string | null
  }
}

export type CheckVerificationPayloadKeySpecifier = (
  | "authToken"
  | "clientMutationId"
  | CheckVerificationPayloadKeySpecifier
)[]
export type CheckVerificationPayloadFieldPolicy = {
  authToken?: FieldPolicy<any> | FieldReadFunction<any>
  clientMutationId?: FieldPolicy<any> | FieldReadFunction<any>
}
export type CreateGamePayloadKeySpecifier = (
  | "clientMutationId"
  | "game"
  | CreateGamePayloadKeySpecifier
)[]
export type CreateGamePayloadFieldPolicy = {
  clientMutationId?: FieldPolicy<any> | FieldReadFunction<any>
  game?: FieldPolicy<any> | FieldReadFunction<any>
}
export type CreateGameVersionPayloadKeySpecifier = (
  | "clientMutationId"
  | "congratulationMsg"
  | "gameVersion"
  | "previewLink"
  | CreateGameVersionPayloadKeySpecifier
)[]
export type CreateGameVersionPayloadFieldPolicy = {
  clientMutationId?: FieldPolicy<any> | FieldReadFunction<any>
  congratulationMsg?: FieldPolicy<any> | FieldReadFunction<any>
  gameVersion?: FieldPolicy<any> | FieldReadFunction<any>
  previewLink?: FieldPolicy<any> | FieldReadFunction<any>
}
export type DashboardMagicLinkPayloadKeySpecifier = (
  | "clientMutationId"
  | "dashboardMagicLink"
  | DashboardMagicLinkPayloadKeySpecifier
)[]
export type DashboardMagicLinkPayloadFieldPolicy = {
  clientMutationId?: FieldPolicy<any> | FieldReadFunction<any>
  dashboardMagicLink?: FieldPolicy<any> | FieldReadFunction<any>
}
export type GameKeySpecifier = (
  | "appId"
  | "blurredImgDataUrl"
  | "commentCount"
  | "createdAt"
  | "description"
  | "gameDevs"
  | "gameVersions"
  | "id"
  | "isAllowedInsideRoom"
  | "logoUrl"
  | "playTime"
  | "players"
  | "plays"
  | "previewImgUrl"
  | "title"
  | "type"
  | "updatedAt"
  | GameKeySpecifier
)[]
export type GameFieldPolicy = {
  appId?: FieldPolicy<any> | FieldReadFunction<any>
  blurredImgDataUrl?: FieldPolicy<any> | FieldReadFunction<any>
  commentCount?: FieldPolicy<any> | FieldReadFunction<any>
  createdAt?: FieldPolicy<any> | FieldReadFunction<any>
  description?: FieldPolicy<any> | FieldReadFunction<any>
  gameDevs?: FieldPolicy<any> | FieldReadFunction<any>
  gameVersions?: FieldPolicy<any> | FieldReadFunction<any>
  id?: FieldPolicy<any> | FieldReadFunction<any>
  isAllowedInsideRoom?: FieldPolicy<any> | FieldReadFunction<any>
  logoUrl?: FieldPolicy<any> | FieldReadFunction<any>
  playTime?: FieldPolicy<any> | FieldReadFunction<any>
  players?: FieldPolicy<any> | FieldReadFunction<any>
  plays?: FieldPolicy<any> | FieldReadFunction<any>
  previewImgUrl?: FieldPolicy<any> | FieldReadFunction<any>
  title?: FieldPolicy<any> | FieldReadFunction<any>
  type?: FieldPolicy<any> | FieldReadFunction<any>
  updatedAt?: FieldPolicy<any> | FieldReadFunction<any>
}
export type GameDevKeySpecifier = (
  | "displayName"
  | "game"
  | "gameId"
  | "status"
  | "type"
  | "userId"
  | "userProfileEditable"
  | GameDevKeySpecifier
)[]
export type GameDevFieldPolicy = {
  displayName?: FieldPolicy<any> | FieldReadFunction<any>
  game?: FieldPolicy<any> | FieldReadFunction<any>
  gameId?: FieldPolicy<any> | FieldReadFunction<any>
  status?: FieldPolicy<any> | FieldReadFunction<any>
  type?: FieldPolicy<any> | FieldReadFunction<any>
  userId?: FieldPolicy<any> | FieldReadFunction<any>
  userProfileEditable?: FieldPolicy<any> | FieldReadFunction<any>
}
export type GameDevsConnectionKeySpecifier = (
  | "edges"
  | "nodes"
  | "pageInfo"
  | "totalCount"
  | GameDevsConnectionKeySpecifier
)[]
export type GameDevsConnectionFieldPolicy = {
  edges?: FieldPolicy<any> | FieldReadFunction<any>
  nodes?: FieldPolicy<any> | FieldReadFunction<any>
  pageInfo?: FieldPolicy<any> | FieldReadFunction<any>
  totalCount?: FieldPolicy<any> | FieldReadFunction<any>
}
export type GameDevsEdgeKeySpecifier = (
  | "cursor"
  | "node"
  | GameDevsEdgeKeySpecifier
)[]
export type GameDevsEdgeFieldPolicy = {
  cursor?: FieldPolicy<any> | FieldReadFunction<any>
  node?: FieldPolicy<any> | FieldReadFunction<any>
}
export type GameVersionKeySpecifier = (
  | "createdByDevId"
  | "game"
  | "gameId"
  | "gameVersionId"
  | "key"
  | "landscape"
  | "multiplayerMaxPlayers"
  | "multiplayerMinPlayers"
  | "multiplayerSupportsPlayerJoining"
  | "multiplayerSupportsPlayerLeaving"
  | "persistPlayerData"
  | "sdkVersion"
  | "status"
  | "updatesPerSecond"
  | "usesUpdates"
  | GameVersionKeySpecifier
)[]
export type GameVersionFieldPolicy = {
  createdByDevId?: FieldPolicy<any> | FieldReadFunction<any>
  game?: FieldPolicy<any> | FieldReadFunction<any>
  gameId?: FieldPolicy<any> | FieldReadFunction<any>
  gameVersionId?: FieldPolicy<any> | FieldReadFunction<any>
  key?: FieldPolicy<any> | FieldReadFunction<any>
  landscape?: FieldPolicy<any> | FieldReadFunction<any>
  multiplayerMaxPlayers?: FieldPolicy<any> | FieldReadFunction<any>
  multiplayerMinPlayers?: FieldPolicy<any> | FieldReadFunction<any>
  multiplayerSupportsPlayerJoining?: FieldPolicy<any> | FieldReadFunction<any>
  multiplayerSupportsPlayerLeaving?: FieldPolicy<any> | FieldReadFunction<any>
  persistPlayerData?: FieldPolicy<any> | FieldReadFunction<any>
  sdkVersion?: FieldPolicy<any> | FieldReadFunction<any>
  status?: FieldPolicy<any> | FieldReadFunction<any>
  updatesPerSecond?: FieldPolicy<any> | FieldReadFunction<any>
  usesUpdates?: FieldPolicy<any> | FieldReadFunction<any>
}
export type GameVersionsConnectionKeySpecifier = (
  | "edges"
  | "nodes"
  | "pageInfo"
  | "totalCount"
  | GameVersionsConnectionKeySpecifier
)[]
export type GameVersionsConnectionFieldPolicy = {
  edges?: FieldPolicy<any> | FieldReadFunction<any>
  nodes?: FieldPolicy<any> | FieldReadFunction<any>
  pageInfo?: FieldPolicy<any> | FieldReadFunction<any>
  totalCount?: FieldPolicy<any> | FieldReadFunction<any>
}
export type GameVersionsEdgeKeySpecifier = (
  | "cursor"
  | "node"
  | GameVersionsEdgeKeySpecifier
)[]
export type GameVersionsEdgeFieldPolicy = {
  cursor?: FieldPolicy<any> | FieldReadFunction<any>
  node?: FieldPolicy<any> | FieldReadFunction<any>
}
export type GamesConnectionKeySpecifier = (
  | "edges"
  | "nodes"
  | "pageInfo"
  | "totalCount"
  | GamesConnectionKeySpecifier
)[]
export type GamesConnectionFieldPolicy = {
  edges?: FieldPolicy<any> | FieldReadFunction<any>
  nodes?: FieldPolicy<any> | FieldReadFunction<any>
  pageInfo?: FieldPolicy<any> | FieldReadFunction<any>
  totalCount?: FieldPolicy<any> | FieldReadFunction<any>
}
export type GamesEdgeKeySpecifier = (
  | "cursor"
  | "node"
  | GamesEdgeKeySpecifier
)[]
export type GamesEdgeFieldPolicy = {
  cursor?: FieldPolicy<any> | FieldReadFunction<any>
  node?: FieldPolicy<any> | FieldReadFunction<any>
}
export type InviteGameDevPayloadKeySpecifier = (
  | "clientMutationId"
  | InviteGameDevPayloadKeySpecifier
)[]
export type InviteGameDevPayloadFieldPolicy = {
  clientMutationId?: FieldPolicy<any> | FieldReadFunction<any>
}
export type MeKeySpecifier = (
  | "admin"
  | "devId"
  | "displayName"
  | "email"
  | MeKeySpecifier
)[]
export type MeFieldPolicy = {
  admin?: FieldPolicy<any> | FieldReadFunction<any>
  devId?: FieldPolicy<any> | FieldReadFunction<any>
  displayName?: FieldPolicy<any> | FieldReadFunction<any>
  email?: FieldPolicy<any> | FieldReadFunction<any>
}
export type MutationKeySpecifier = (
  | "checkVerification"
  | "createDashboardMagicLink"
  | "createGame"
  | "createGameVersion"
  | "inviteGameDev"
  | "requestPayout"
  | "startVerification"
  | "updateGame"
  | "updateGameDev"
  | "updateGameSdk"
  | MutationKeySpecifier
)[]
export type MutationFieldPolicy = {
  checkVerification?: FieldPolicy<any> | FieldReadFunction<any>
  createDashboardMagicLink?: FieldPolicy<any> | FieldReadFunction<any>
  createGame?: FieldPolicy<any> | FieldReadFunction<any>
  createGameVersion?: FieldPolicy<any> | FieldReadFunction<any>
  inviteGameDev?: FieldPolicy<any> | FieldReadFunction<any>
  requestPayout?: FieldPolicy<any> | FieldReadFunction<any>
  startVerification?: FieldPolicy<any> | FieldReadFunction<any>
  updateGame?: FieldPolicy<any> | FieldReadFunction<any>
  updateGameDev?: FieldPolicy<any> | FieldReadFunction<any>
  updateGameSdk?: FieldPolicy<any> | FieldReadFunction<any>
}
export type PageInfoKeySpecifier = (
  | "endCursor"
  | "hasNextPage"
  | "hasPreviousPage"
  | "startCursor"
  | PageInfoKeySpecifier
)[]
export type PageInfoFieldPolicy = {
  endCursor?: FieldPolicy<any> | FieldReadFunction<any>
  hasNextPage?: FieldPolicy<any> | FieldReadFunction<any>
  hasPreviousPage?: FieldPolicy<any> | FieldReadFunction<any>
  startCursor?: FieldPolicy<any> | FieldReadFunction<any>
}
export type QueryKeySpecifier = (
  | "gameByAppId"
  | "gameById"
  | "gameVersionByGameIdAndGameVersionId"
  | "gameVersionByKey"
  | "gameVersions"
  | "games"
  | "me"
  | "query"
  | "userDevByUserId"
  | "userDevs"
  | "userPrivateReadonlies"
  | "userPrivateReadonlyByEmail"
  | "userPrivateReadonlyByUserId"
  | "userProfileEditableByUserId"
  | "userProfileEditables"
  | QueryKeySpecifier
)[]
export type QueryFieldPolicy = {
  gameByAppId?: FieldPolicy<any> | FieldReadFunction<any>
  gameById?: FieldPolicy<any> | FieldReadFunction<any>
  gameVersionByGameIdAndGameVersionId?:
    | FieldPolicy<any>
    | FieldReadFunction<any>
  gameVersionByKey?: FieldPolicy<any> | FieldReadFunction<any>
  gameVersions?: FieldPolicy<any> | FieldReadFunction<any>
  games?: FieldPolicy<any> | FieldReadFunction<any>
  me?: FieldPolicy<any> | FieldReadFunction<any>
  query?: FieldPolicy<any> | FieldReadFunction<any>
  userDevByUserId?: FieldPolicy<any> | FieldReadFunction<any>
  userDevs?: FieldPolicy<any> | FieldReadFunction<any>
  userPrivateReadonlies?: FieldPolicy<any> | FieldReadFunction<any>
  userPrivateReadonlyByEmail?: FieldPolicy<any> | FieldReadFunction<any>
  userPrivateReadonlyByUserId?: FieldPolicy<any> | FieldReadFunction<any>
  userProfileEditableByUserId?: FieldPolicy<any> | FieldReadFunction<any>
  userProfileEditables?: FieldPolicy<any> | FieldReadFunction<any>
}
export type RequestPayoutPayloadKeySpecifier = (
  | "clientMutationId"
  | RequestPayoutPayloadKeySpecifier
)[]
export type RequestPayoutPayloadFieldPolicy = {
  clientMutationId?: FieldPolicy<any> | FieldReadFunction<any>
}
export type StartVerificationPayloadKeySpecifier = (
  | "clientMutationId"
  | "verificationToken"
  | StartVerificationPayloadKeySpecifier
)[]
export type StartVerificationPayloadFieldPolicy = {
  clientMutationId?: FieldPolicy<any> | FieldReadFunction<any>
  verificationToken?: FieldPolicy<any> | FieldReadFunction<any>
}
export type UpdateGameDevPayloadKeySpecifier = (
  | "clientMutationId"
  | UpdateGameDevPayloadKeySpecifier
)[]
export type UpdateGameDevPayloadFieldPolicy = {
  clientMutationId?: FieldPolicy<any> | FieldReadFunction<any>
}
export type UpdateGamePayloadKeySpecifier = (
  | "clientMutationId"
  | "game"
  | UpdateGamePayloadKeySpecifier
)[]
export type UpdateGamePayloadFieldPolicy = {
  clientMutationId?: FieldPolicy<any> | FieldReadFunction<any>
  game?: FieldPolicy<any> | FieldReadFunction<any>
}
export type UpdateGameSdkPayloadKeySpecifier = (
  | "clientMutationId"
  | "error"
  | "success"
  | UpdateGameSdkPayloadKeySpecifier
)[]
export type UpdateGameSdkPayloadFieldPolicy = {
  clientMutationId?: FieldPolicy<any> | FieldReadFunction<any>
  error?: FieldPolicy<any> | FieldReadFunction<any>
  success?: FieldPolicy<any> | FieldReadFunction<any>
}
export type UserDevKeySpecifier = (
  | "badge"
  | "createdAt"
  | "updatedAt"
  | "userId"
  | UserDevKeySpecifier
)[]
export type UserDevFieldPolicy = {
  badge?: FieldPolicy<any> | FieldReadFunction<any>
  createdAt?: FieldPolicy<any> | FieldReadFunction<any>
  updatedAt?: FieldPolicy<any> | FieldReadFunction<any>
  userId?: FieldPolicy<any> | FieldReadFunction<any>
}
export type UserDevsConnectionKeySpecifier = (
  | "edges"
  | "nodes"
  | "pageInfo"
  | "totalCount"
  | UserDevsConnectionKeySpecifier
)[]
export type UserDevsConnectionFieldPolicy = {
  edges?: FieldPolicy<any> | FieldReadFunction<any>
  nodes?: FieldPolicy<any> | FieldReadFunction<any>
  pageInfo?: FieldPolicy<any> | FieldReadFunction<any>
  totalCount?: FieldPolicy<any> | FieldReadFunction<any>
}
export type UserDevsEdgeKeySpecifier = (
  | "cursor"
  | "node"
  | UserDevsEdgeKeySpecifier
)[]
export type UserDevsEdgeFieldPolicy = {
  cursor?: FieldPolicy<any> | FieldReadFunction<any>
  node?: FieldPolicy<any> | FieldReadFunction<any>
}
export type UserPrivateReadonliesConnectionKeySpecifier = (
  | "edges"
  | "nodes"
  | "pageInfo"
  | "totalCount"
  | UserPrivateReadonliesConnectionKeySpecifier
)[]
export type UserPrivateReadonliesConnectionFieldPolicy = {
  edges?: FieldPolicy<any> | FieldReadFunction<any>
  nodes?: FieldPolicy<any> | FieldReadFunction<any>
  pageInfo?: FieldPolicy<any> | FieldReadFunction<any>
  totalCount?: FieldPolicy<any> | FieldReadFunction<any>
}
export type UserPrivateReadonliesEdgeKeySpecifier = (
  | "cursor"
  | "node"
  | UserPrivateReadonliesEdgeKeySpecifier
)[]
export type UserPrivateReadonliesEdgeFieldPolicy = {
  cursor?: FieldPolicy<any> | FieldReadFunction<any>
  node?: FieldPolicy<any> | FieldReadFunction<any>
}
export type UserPrivateReadonlyKeySpecifier = (
  | "email"
  | "userId"
  | UserPrivateReadonlyKeySpecifier
)[]
export type UserPrivateReadonlyFieldPolicy = {
  email?: FieldPolicy<any> | FieldReadFunction<any>
  userId?: FieldPolicy<any> | FieldReadFunction<any>
}
export type UserProfileEditableKeySpecifier = (
  | "displayName"
  | "userId"
  | UserProfileEditableKeySpecifier
)[]
export type UserProfileEditableFieldPolicy = {
  displayName?: FieldPolicy<any> | FieldReadFunction<any>
  userId?: FieldPolicy<any> | FieldReadFunction<any>
}
export type UserProfileEditablesConnectionKeySpecifier = (
  | "edges"
  | "nodes"
  | "pageInfo"
  | "totalCount"
  | UserProfileEditablesConnectionKeySpecifier
)[]
export type UserProfileEditablesConnectionFieldPolicy = {
  edges?: FieldPolicy<any> | FieldReadFunction<any>
  nodes?: FieldPolicy<any> | FieldReadFunction<any>
  pageInfo?: FieldPolicy<any> | FieldReadFunction<any>
  totalCount?: FieldPolicy<any> | FieldReadFunction<any>
}
export type UserProfileEditablesEdgeKeySpecifier = (
  | "cursor"
  | "node"
  | UserProfileEditablesEdgeKeySpecifier
)[]
export type UserProfileEditablesEdgeFieldPolicy = {
  cursor?: FieldPolicy<any> | FieldReadFunction<any>
  node?: FieldPolicy<any> | FieldReadFunction<any>
}
export type StrictTypedTypePolicies = {
  CheckVerificationPayload?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | CheckVerificationPayloadKeySpecifier
      | (() => undefined | CheckVerificationPayloadKeySpecifier)
    fields?: CheckVerificationPayloadFieldPolicy
  }
  CreateGamePayload?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | CreateGamePayloadKeySpecifier
      | (() => undefined | CreateGamePayloadKeySpecifier)
    fields?: CreateGamePayloadFieldPolicy
  }
  CreateGameVersionPayload?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | CreateGameVersionPayloadKeySpecifier
      | (() => undefined | CreateGameVersionPayloadKeySpecifier)
    fields?: CreateGameVersionPayloadFieldPolicy
  }
  DashboardMagicLinkPayload?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | DashboardMagicLinkPayloadKeySpecifier
      | (() => undefined | DashboardMagicLinkPayloadKeySpecifier)
    fields?: DashboardMagicLinkPayloadFieldPolicy
  }
  Game?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?: false | GameKeySpecifier | (() => undefined | GameKeySpecifier)
    fields?: GameFieldPolicy
  }
  GameDev?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | GameDevKeySpecifier
      | (() => undefined | GameDevKeySpecifier)
    fields?: GameDevFieldPolicy
  }
  GameDevsConnection?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | GameDevsConnectionKeySpecifier
      | (() => undefined | GameDevsConnectionKeySpecifier)
    fields?: GameDevsConnectionFieldPolicy
  }
  GameDevsEdge?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | GameDevsEdgeKeySpecifier
      | (() => undefined | GameDevsEdgeKeySpecifier)
    fields?: GameDevsEdgeFieldPolicy
  }
  GameVersion?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | GameVersionKeySpecifier
      | (() => undefined | GameVersionKeySpecifier)
    fields?: GameVersionFieldPolicy
  }
  GameVersionsConnection?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | GameVersionsConnectionKeySpecifier
      | (() => undefined | GameVersionsConnectionKeySpecifier)
    fields?: GameVersionsConnectionFieldPolicy
  }
  GameVersionsEdge?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | GameVersionsEdgeKeySpecifier
      | (() => undefined | GameVersionsEdgeKeySpecifier)
    fields?: GameVersionsEdgeFieldPolicy
  }
  GamesConnection?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | GamesConnectionKeySpecifier
      | (() => undefined | GamesConnectionKeySpecifier)
    fields?: GamesConnectionFieldPolicy
  }
  GamesEdge?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | GamesEdgeKeySpecifier
      | (() => undefined | GamesEdgeKeySpecifier)
    fields?: GamesEdgeFieldPolicy
  }
  InviteGameDevPayload?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | InviteGameDevPayloadKeySpecifier
      | (() => undefined | InviteGameDevPayloadKeySpecifier)
    fields?: InviteGameDevPayloadFieldPolicy
  }
  Me?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?: false | MeKeySpecifier | (() => undefined | MeKeySpecifier)
    fields?: MeFieldPolicy
  }
  Mutation?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | MutationKeySpecifier
      | (() => undefined | MutationKeySpecifier)
    fields?: MutationFieldPolicy
  }
  PageInfo?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | PageInfoKeySpecifier
      | (() => undefined | PageInfoKeySpecifier)
    fields?: PageInfoFieldPolicy
  }
  Query?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | QueryKeySpecifier
      | (() => undefined | QueryKeySpecifier)
    fields?: QueryFieldPolicy
  }
  RequestPayoutPayload?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | RequestPayoutPayloadKeySpecifier
      | (() => undefined | RequestPayoutPayloadKeySpecifier)
    fields?: RequestPayoutPayloadFieldPolicy
  }
  StartVerificationPayload?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | StartVerificationPayloadKeySpecifier
      | (() => undefined | StartVerificationPayloadKeySpecifier)
    fields?: StartVerificationPayloadFieldPolicy
  }
  UpdateGameDevPayload?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | UpdateGameDevPayloadKeySpecifier
      | (() => undefined | UpdateGameDevPayloadKeySpecifier)
    fields?: UpdateGameDevPayloadFieldPolicy
  }
  UpdateGamePayload?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | UpdateGamePayloadKeySpecifier
      | (() => undefined | UpdateGamePayloadKeySpecifier)
    fields?: UpdateGamePayloadFieldPolicy
  }
  UpdateGameSdkPayload?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | UpdateGameSdkPayloadKeySpecifier
      | (() => undefined | UpdateGameSdkPayloadKeySpecifier)
    fields?: UpdateGameSdkPayloadFieldPolicy
  }
  UserDev?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | UserDevKeySpecifier
      | (() => undefined | UserDevKeySpecifier)
    fields?: UserDevFieldPolicy
  }
  UserDevsConnection?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | UserDevsConnectionKeySpecifier
      | (() => undefined | UserDevsConnectionKeySpecifier)
    fields?: UserDevsConnectionFieldPolicy
  }
  UserDevsEdge?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | UserDevsEdgeKeySpecifier
      | (() => undefined | UserDevsEdgeKeySpecifier)
    fields?: UserDevsEdgeFieldPolicy
  }
  UserPrivateReadonliesConnection?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | UserPrivateReadonliesConnectionKeySpecifier
      | (() => undefined | UserPrivateReadonliesConnectionKeySpecifier)
    fields?: UserPrivateReadonliesConnectionFieldPolicy
  }
  UserPrivateReadonliesEdge?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | UserPrivateReadonliesEdgeKeySpecifier
      | (() => undefined | UserPrivateReadonliesEdgeKeySpecifier)
    fields?: UserPrivateReadonliesEdgeFieldPolicy
  }
  UserPrivateReadonly?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | UserPrivateReadonlyKeySpecifier
      | (() => undefined | UserPrivateReadonlyKeySpecifier)
    fields?: UserPrivateReadonlyFieldPolicy
  }
  UserProfileEditable?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | UserProfileEditableKeySpecifier
      | (() => undefined | UserProfileEditableKeySpecifier)
    fields?: UserProfileEditableFieldPolicy
  }
  UserProfileEditablesConnection?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | UserProfileEditablesConnectionKeySpecifier
      | (() => undefined | UserProfileEditablesConnectionKeySpecifier)
    fields?: UserProfileEditablesConnectionFieldPolicy
  }
  UserProfileEditablesEdge?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | UserProfileEditablesEdgeKeySpecifier
      | (() => undefined | UserProfileEditablesEdgeKeySpecifier)
    fields?: UserProfileEditablesEdgeFieldPolicy
  }
}
export type TypedTypePolicies = StrictTypedTypePolicies & TypePolicies

export const CheckVerificationDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "CheckVerification" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "verificationToken" },
          },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "String" },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "checkVerification" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "input" },
                value: {
                  kind: "ObjectValue",
                  fields: [
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "verificationToken" },
                      value: {
                        kind: "Variable",
                        name: { kind: "Name", value: "verificationToken" },
                      },
                    },
                  ],
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "authToken" } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  CheckVerificationMutation,
  CheckVerificationMutationVariables
>
export const CreateGameDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "CreateGame" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "game" } },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "CreateGameInput" },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "createGame" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "input" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "game" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: { kind: "Name", value: "game" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<CreateGameMutation, CreateGameMutationVariables>
export const CreateGameVersionDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "CreateGameVersion" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "gameId" },
          },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "Int" } },
          },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "content" },
          },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "Upload" },
            },
          },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "isDraft" },
          },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "Boolean" },
            },
          },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "postToDiscord" },
          },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "Boolean" },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "createGameVersion" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "input" },
                value: {
                  kind: "ObjectValue",
                  fields: [
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "gameId" },
                      value: {
                        kind: "Variable",
                        name: { kind: "Name", value: "gameId" },
                      },
                    },
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "content" },
                      value: {
                        kind: "Variable",
                        name: { kind: "Name", value: "content" },
                      },
                    },
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "isDraft" },
                      value: {
                        kind: "Variable",
                        name: { kind: "Name", value: "isDraft" },
                      },
                    },
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "postToDiscord" },
                      value: {
                        kind: "Variable",
                        name: { kind: "Name", value: "postToDiscord" },
                      },
                    },
                  ],
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "previewLink" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "congratulationMsg" },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "gameVersion" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "gameId" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "gameVersionId" },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  CreateGameVersionMutation,
  CreateGameVersionMutationVariables
>
export const GameDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "Game" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "id" } },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "Int" } },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "gameById" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "id" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "id" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "title" } },
                { kind: "Field", name: { kind: "Name", value: "description" } },
                { kind: "Field", name: { kind: "Name", value: "createdAt" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "gameDevs" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "nodes" },
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "userId" },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "displayName" },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "type" },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "gameVersions" },
                  arguments: [
                    {
                      kind: "Argument",
                      name: { kind: "Name", value: "orderBy" },
                      value: {
                        kind: "ListValue",
                        values: [
                          { kind: "EnumValue", value: "PRIMARY_KEY_DESC" },
                        ],
                      },
                    },
                  ],
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "nodes" },
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "gameId" },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "gameVersionId" },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "status" },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<GameQuery, GameQueryVariables>
export const GamesDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "Games" },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "games" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: { kind: "Name", value: "nodes" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      { kind: "Field", name: { kind: "Name", value: "title" } },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "description" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "gameDevs" },
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "nodes" },
                              selectionSet: {
                                kind: "SelectionSet",
                                selections: [
                                  {
                                    kind: "Field",
                                    name: { kind: "Name", value: "userId" },
                                  },
                                  {
                                    kind: "Field",
                                    name: {
                                      kind: "Name",
                                      value: "displayName",
                                    },
                                  },
                                  {
                                    kind: "Field",
                                    name: { kind: "Name", value: "type" },
                                  },
                                ],
                              },
                            },
                          ],
                        },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "gameVersions" },
                        arguments: [
                          {
                            kind: "Argument",
                            name: { kind: "Name", value: "orderBy" },
                            value: {
                              kind: "ListValue",
                              values: [
                                {
                                  kind: "EnumValue",
                                  value: "PRIMARY_KEY_DESC",
                                },
                              ],
                            },
                          },
                        ],
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "nodes" },
                              selectionSet: {
                                kind: "SelectionSet",
                                selections: [
                                  {
                                    kind: "Field",
                                    name: { kind: "Name", value: "gameId" },
                                  },
                                  {
                                    kind: "Field",
                                    name: {
                                      kind: "Name",
                                      value: "gameVersionId",
                                    },
                                  },
                                  {
                                    kind: "Field",
                                    name: { kind: "Name", value: "status" },
                                  },
                                ],
                              },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<GamesQuery, GamesQueryVariables>
export const InviteGameDevDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "InviteGameDev" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "input" },
          },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "InviteGameDevInput" },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "inviteGameDev" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "input" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "input" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: { kind: "Name", value: "clientMutationId" },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  InviteGameDevMutation,
  InviteGameDevMutationVariables
>
export const CreateDashboardMagicLinkDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "createDashboardMagicLink" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "input" },
          },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "DashboardMagicLinkInput" },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "createDashboardMagicLink" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "input" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "input" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: { kind: "Name", value: "clientMutationId" },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "dashboardMagicLink" },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  CreateDashboardMagicLinkMutation,
  CreateDashboardMagicLinkMutationVariables
>
export const MeDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "Me" },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "me" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "devId" } },
                { kind: "Field", name: { kind: "Name", value: "displayName" } },
                { kind: "Field", name: { kind: "Name", value: "email" } },
                { kind: "Field", name: { kind: "Name", value: "admin" } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<MeQuery, MeQueryVariables>
export const StartVerificationDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "StartVerification" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "email" },
          },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "String" },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "startVerification" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "input" },
                value: {
                  kind: "ObjectValue",
                  fields: [
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "email" },
                      value: {
                        kind: "Variable",
                        name: { kind: "Name", value: "email" },
                      },
                    },
                  ],
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: { kind: "Name", value: "verificationToken" },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  StartVerificationMutation,
  StartVerificationMutationVariables
>
export const UpdateGameDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "UpdateGame" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "input" },
          },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "UpdateGameInput" },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "updateGame" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "input" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "input" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: { kind: "Name", value: "game" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      { kind: "Field", name: { kind: "Name", value: "title" } },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<UpdateGameMutation, UpdateGameMutationVariables>
export const UpdateGameDevDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "UpdateGameDev" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "input" },
          },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "UpdateGameDevInput" },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "updateGameDev" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "input" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "input" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: { kind: "Name", value: "clientMutationId" },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  UpdateGameDevMutation,
  UpdateGameDevMutationVariables
>
export const UpdateGameSdkDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "UpdateGameSdk" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "input" },
          },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "UpdateGameSdkInput" },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "updateGameSdk" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "input" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "input" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "success" } },
                { kind: "Field", name: { kind: "Name", value: "error" } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  UpdateGameSdkMutation,
  UpdateGameSdkMutationVariables
>
