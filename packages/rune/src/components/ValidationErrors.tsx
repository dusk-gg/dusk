import { Box, Text } from "ink"
import React from "react"

import { FileInfo } from "../lib/getGameFiles.js"
import { renderErrorCodeLine } from "../lib/renderCodeError.js"
import { ValidationResult } from "../lib/validateGameFiles.js"

export function ValidationErrors({
  validationResult,
  logicJsFile,
}: {
  validationResult: ValidationResult
  logicJsFile: FileInfo | undefined
}) {
  return (
    <Box flexDirection="column">
      {validationResult?.errors.map((error, i) => (
        <Box key={i} paddingLeft={0} flexDirection="column">
          <Text color="red">
            {i + 1}) {error.message}
          </Text>
          {!!error.lintErrors?.length && (
            <Box paddingLeft={2} flexDirection="column">
              {error.lintErrors.map((lintError, i) => (
                <Box key={i} flexDirection="column">
                  <Text>
                    - {lintError.message} ({lintError.ruleId})
                  </Text>
                  {logicJsFile?.content && (
                    <Box paddingLeft={2}>
                      {renderErrorCodeLine({
                        code: logicJsFile.content,
                        ...lintError,
                      })}
                    </Box>
                  )}
                </Box>
              ))}
            </Box>
          )}
        </Box>
      ))}
    </Box>
  )
}
