---
title: "aPhone Mirroring"
description: "Android on macOS, natively: SwiftUI on one side, Kotlin on the other, scrcpy in between."
role: "Native Engineering"
techStack: ["Swift", "SwiftUI", "Kotlin", "scrcpy", "TCP"]
github: https://github.com/arrrnmp/aphone-mirroring
order: 4
---

A native macOS app that mirrors Android screens and surfaces Messages, Calls, Photos, Contacts, and Notifications through a SwiftUI interface. The Android side is Kotlin; they communicate over a TCP JSON bridge using the scrcpy v3.3.4 protocol. Two native apps, one coherent experience.
