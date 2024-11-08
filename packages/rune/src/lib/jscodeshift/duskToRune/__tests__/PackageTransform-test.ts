import { describe, it, expect } from "@jest/globals"
import fs from "fs"
import path from "path"

import transformJSON from "../PackageTransform"

describe("PackageJSONTransform", () => {
  it("should transform package", () => {
    expect(
      JSON.stringify(
        transformJSON(
          // eslint-disable-next-line @typescript-eslint/no-require-imports
          require(
            path.resolve(
              __dirname,
              "../__testfixtures__/testPackage.input.json"
            )
          )
        ),
        null,
        2
      )
    ).toEqual(
      fs.readFileSync(
        path.resolve(__dirname, "../__testfixtures__/testPackage.output.json"),
        "utf-8"
      )
    )
  })
})
