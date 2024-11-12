import { Text, Box } from "ink"
import TextInputImport from "ink-text-input"
import React, { useState, useEffect, useMemo, useCallback } from "react"

import { Step } from "../components/Step.js"
import { useCheckVerification } from "../gql/useCheckVerification.js"
import { useMe } from "../gql/useMe.js"
import { useStartVerification } from "../gql/useStartVerification.js"
import { formatApolloError } from "../lib/formatApolloError.js"
import { storage } from "../lib/storage/storage.js"

// @ts-ignore
const TextInput = TextInputImport.default as typeof TextInputImport

const checkVerificationEvery = 2000
const alreadyHasAuthToken = !!storage.get("authToken")

export function Login() {
  const [authToken, setAuthToken] = useState(() => storage.get("authToken"))
  const { meLoading, meError } = useMe({ skip: !authToken })
  const [email, setEmail] = useState("")
  const {
    startVerification,
    startVerificationLoading,
    startVerificationError,
    verificationToken,
  } = useStartVerification()
  const {
    checkVerification,
    checkVerificationLoading,
    checkVerificationError,
    authToken: newAuthToken,
  } = useCheckVerification()

  const sanitizedEmail = useMemo(() => email.trim().toLowerCase(), [email])

  const submitEmail = useCallback(() => {
    if (sanitizedEmail) startVerification({ email: sanitizedEmail })
  }, [sanitizedEmail, startVerification])

  useEffect(() => {
    if (
      verificationToken &&
      !authToken &&
      !checkVerificationLoading &&
      !checkVerificationError
    ) {
      const handle = setTimeout(() => {
        checkVerification({ verificationToken })
      }, checkVerificationEvery)

      return () => clearTimeout(handle)
    }
  }, [
    authToken,
    checkVerification,
    checkVerificationError,
    checkVerificationLoading,
    verificationToken,
  ])

  useEffect(() => {
    if (newAuthToken) {
      storage.set("authToken", newAuthToken)
      setAuthToken(newAuthToken)
    }
  }, [newAuthToken])

  useEffect(() => {
    if (meError?.message.includes("[tango][AUTH_FAILED]")) {
      storage.delete("authToken")
    }
  }, [meError?.message])

  if (alreadyHasAuthToken && meLoading) {
    return <Step status="waiting" label="Checking authorization" />
  }

  if (meError) {
    return (
      <Step
        status="error"
        label={formatApolloError(meError, {
          "[tango][AUTH_FAILED]": "Authentication failed. Please try again.",
        })}
      />
    )
  }

  return (
    <Box flexDirection="column">
      {!alreadyHasAuthToken && (
        <>
          <Step
            status={
              verificationToken
                ? "success"
                : startVerificationLoading
                  ? "waiting"
                  : "userInput"
            }
            label={(status) =>
              status === "success"
                ? "Email sent"
                : status === "waiting"
                  ? "Sending verification email"
                  : "Login to your Rune account to continue. If you don't have a Rune account, install the app and create an email-verified account"
            }
            view={(status) =>
              status === "userInput" && (
                <Box flexDirection="column">
                  {startVerificationError && (
                    <Text color="red">
                      {formatApolloError(startVerificationError, {
                        "[tango][VERIFICATION_RATE_LIMIT]":
                          "It looks like you’ve already tried to verify this email recently, please wait a bit before trying again",
                      })}
                    </Text>
                  )}
                  <Box>
                    <Text>Email: </Text>
                    <TextInput
                      placeholder="email@example.com"
                      value={email}
                      onChange={setEmail}
                      onSubmit={submitEmail}
                    />
                  </Box>
                </Box>
              )
            }
          />
          {!!verificationToken && (
            <Step
              status={
                authToken
                  ? "success"
                  : checkVerificationError
                    ? "error"
                    : "waiting"
              }
              label={(status) =>
                status === "success"
                  ? "Email confirmed"
                  : checkVerificationError
                    ? formatApolloError(checkVerificationError, {
                        "[tango][JWT_EXPIRED]":
                          "It looks like the email link has expired, please try again",
                      })
                    : `An email was sent to \`${sanitizedEmail}\`, please open it and click the link inside to proceed`
              }
            />
          )}
        </>
      )}
    </Box>
  )
}
