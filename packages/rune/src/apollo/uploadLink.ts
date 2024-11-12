import { createUploadLink } from "apollo-upload-client"
import fetch from "cross-fetch"
import FormData from "form-data"

import { Scalars } from "../generated/types.js"

const options = {
  isExtractableFile: (file: any) => Buffer.isBuffer(file?.content),
  FormData,
  formDataAppendFile: (
    formData: FormData,
    fieldName: string,
    file: Scalars["Upload"]
  ) => {
    formData.append(fieldName, file.content, {
      filename: file.name,
      contentType: file.type,
    })
  },
}

export const uploadLink = createUploadLink({
  uri:
    process.env.STAGE === "local"
      ? "http://localhost:3000/dev/graphql"
      : `https://tango-${
          process.env.STAGE ?? "production"
        }.rune.ai/dev/graphql`,
  fetch,
  ...(options as any),
})
