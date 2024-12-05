---
title: New Updates! November 2024
description: Release notes for the Rune platform 
slug: release-notes-november
tags: [Release Notes]
image: /img/blog/social-previews/rune.png
authors:
- name: Amani Albrecht
  title: Chief of Staff at Rune  
  url: https://www.linkedin.com/in/amanialbrecht
  image_url: /img/blog/people/amani-albrecht.png
  hide_table_of_contents: true
---

<head>
  <title>New Updates! November 2024</title>
  <meta property="og:title" content="New Updates! November 2024"/>
</head>

## 🛠️ App Improvements

* Unveiled our new and improved login experience: Upgraded flow resolves captcha issues, improves multi-account handling, and remembers email IDs to speed up logins! 🚀🔑
* Released a complimenting onboarding experience, giving encouraging gems & guiding users through name customization, avatar setup, and enabling notifications ✨🎉
* Updated our login logic to be even simpler—removed the birthday picker and now you just input your age directly 🎂
* Stopped showing the old locked view for outdated clients. With the new login experience, we've eliminated the need for an update required screen 🔒
* Removed the "Rune Again" overlay now that our name transition has fully settled in ✨
* Enhanced the game lists with pull-to-refresh functionality across all variants 🕹️🔄
* 💎 Restyled our gem icons, animations, and balance design; setting the stage for bigger changes ahead!
* Launched game comment translations, enabling everyone to automatically see all game comments in their own language 💬
* Improved multi-language and diacritic support in all searches, enhancing global usability 🌍

## 🪲Bug Fixes

* Prevented a race condition: now if a user enters their age too quickly, the app handles auth preparation more smoothly to avoid error screens 🏁 
* Fixed guest verification to work without restarts after incomplete email verifications and streamlined age confirmation flow to prevent back navigation errors.
* Removed a login issue by removing an unnecessary fallback that placed error and done handlers incorrectly, preventing uncaught errors.
* Tweaked the splash screen logic: It stays visible longer if the app isn't fully initialized and hides more aggressively once ready, reducing bugs!
* Updated logging to deprioritize uncompressed messages and ensure foreground activities are captured more effectively 📲🔍
* Updated localUser sync when app user changes, fixing a bug where display name and avatar updates weren’t immediately reflected. Now, they’re correct on next login 👤
* Caught and removed a potential source of network failures to reduce crashes and improve stability 🌐
* Implemented possible fixes for production crashes related to 'TypeError: Cannot read property 'nodes' of undefined' with defensive programming.
* Addressed log spam issues by fixing getLinkKey errors that occur when user share links are not yet populated upon login or logout 🔗
* Fixed a crash by ensuring navigation containers correctly reference existing routes, especially during login scenarios.
* Upgraded react-native-screens from 3.34.0 to 3.35.0 to address a known crash issue.
* Resolved an issue with images in our expo updates, allowing us to re-enable auto-updates for iOS 🍏

## 💻 SDK Improvements

* Introduced world time that syncs milliseconds since epoch across server and clients, making it possible for you all to build daily changes and seasonal events directly into your games!
* Improved the warning message for actions taken after game over within the SDK, enhancing clarity and guidance 🚨
* Updated the allowed package size for games, accommodating larger game files 📦
* Added the ability to playtest AI games directly in the SDK, complete with types for developers to specify image data for Open AI integration 🤖
