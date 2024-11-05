import { Binary } from "bson"

export interface Storage {
  authToken: string
  installer: "yarn" | "npm" | null
  [key: string]: StorageValue<string | number | boolean | null | Date | Binary>
}

type StorageValue<T> =
  | T
  | StorageValue<T>[]
  | { [key: string]: StorageValue<T> }
