---
title: New Updates! October 2024
description: Release notes for the Rune platform 
slug: release-notes-october
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
  <title>New Updates! October 2024</title>
  <meta property="og:title" content="New Updates! October 2024"/>
</head>

## 🛠️ App Improvements

* Implemented design changes to the game details screen, making it look even better and easier to navigate ✨
* 🔄 Added pull-to-refresh in the choose game screen inside rooms, serving up new recommendations to gamers each time!
* 🎨🛒 Improved our purchasing UI with better visuals and a smoother flow between avatar options.
* Updated our "choose game" UI for better alignment when favoriting and easier game selection 🎮👌
* Upgraded a bunch of navigation pathways and flows throughout the app, making Rune feel more polished 🌟
* 🔴 Added small and sleek red dots to encourage gamers to customize their avatar and names!
* Improved the way our app does over-the-air updates so everyone can get the newest designs & material seamlessly 🧵

## 🪲Bug Fixes

* Went on a bug-busting hunt this month! Tracked down and prevented a plethora of bugs in voice chat and rooms 💥🐛
* Refactored Rune's alert code and inadvertently fixed a few app crashes! Shout out to Denis 🚀
* Fixed the Rooms tabs by moving them back inside the header, similar to the search layout so the app is a cohesive experience throughout!
* Updated the game share aspect ratio to square, ensuring it looks better and fits on all screens 🖼️
* Made sure that all comments from a blocked or reported user immediately hide after refresh 🚫
* Disabled the unlock room button in matching rooms to keep the gaming experience between you and your new friend!
* Added ignoring 'rooms ending' events in the room if the call hasn’t started yet, avoiding false error reports 📞
* Adjusted our emoji picker for perfect visual alignment, eliminating jumping when selecting or deselecting on Android 😊
* Fixed a few cases where room ends weren't notifying the app properly, busting a few tricky bugs!
* Resolved an issue where gem totals weren't updating after a name change 💎
* Fixed an issue with game version selection, making sure that in dev game versions are not available for normal users. Thanks @iamlegend235 in our Discord for reporting it. 

## 💻 SDK Improvements

* Added an `isNewGame` flag to `stateSync` event that sets to true whenever there's a new game session (start of new game, restart) allowing devs to more easily handle game restarts 🕹️
* Updated our persistence code to bust a bug where players leaving wouldn't trigger the persisted state in the Dev UI!
* Prevented game errors by disallowing Rune.actions from being called inside update functions or other actions.
* Refined our logs to now include whether a user is a player, spectator, or unknown for all client-side messages 🔍
