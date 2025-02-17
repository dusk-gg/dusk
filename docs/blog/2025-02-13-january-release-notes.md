---
title: New Updates! January 2025
description: Release notes for the Rune platform 
slug: release-notes-january
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
  <title>New Updates! January 2025</title>
  <meta property="og:title" content="New Updates! January 2025"/>
</head>

## 🛠️ App Improvements

* Added a fun and simple sound effect for gaining gems in the app, from daily rewards to quests 💎🔊
* 🎨 Introduced dynamic gradient height behind titles in game preview tiles to make game titles easier to read!
* Upgraded all login flow assets to be even sharper and more polished ✨
* Removed nonfunctional arrows from room info on the Room Details screen for a cleaner look!
* 🔢 Enabled one-time code autofill in keyboard suggestions for a smoother login experience.

## 🪲Bug Fixes

* Fixed an issue causing weirdly small button text sizes by rerendering scalable text 🔤
* Prevented a bug where users weren’t showing up on cold-boot by ensuring we load and persist local users 👥
* Averted signed-in users with no wifi to a new no wifi screen so there’s no confusion and users can reinitialize the app then be returned directly to their previous screen! 📶
* 🔍Found and fixed a few more crashes related to unsafe casting of errors to objects.
* Added missing onScrollToIndexFailed handlers to prevent crashes 🚫📜
* Stopped a crash issue when the link email code error wasn't an object by removing unsafe casts.
* Resolve the problem where scrolling to the bottom wasn’t possible on searchable list screens when the keyboard was open ⌨️
* Upgraded our login flow health reporting for enhanced bug-busting in the future 📊
* Addressed an issue where gamers were occasionally added to a room twice on incoming calls by waiting for the user token 📞
* 🕒🔒Investigated and prevented failures during account activations by accommodating the longer time spent in sign-in state for first-time activations.
* Removed a 5-second delay before friend’s rooms are joinable which was causing problems where an incoming call was flashing briefly before the call interface rendered.
* ✅ Tweaked guest verification to behave more reliably when singing in takes longer than usual.
* Thwarted a race condition that could trap users in onboarding by ensuring the overlay loads at the right time 🚀
* Prevented a rare problem where gamers could get stuck right after entering their verification codes 🔐
* 👾🚫Blocked unnecessary gremlin screen from appearing when logging out and immediately logging back in!
