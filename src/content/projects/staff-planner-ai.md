---
title: "Staff Planner AI"
description: "AI-assisted scheduling where the model parses intent and OR-Tools enforces the math."
role: "Design & Engineering"
techStack: ["React 19", "Bun", "TypeScript", "Python", "OR-Tools", "PostgreSQL"]
github: https://github.com/arrrnmp/staff-planner-ai
order: 1
---

Weekly staff scheduling is a constraint problem. This app lets a manager describe rules in plain language — the AI parses intent, a Python OR-Tools solver enforces feasibility, and a React frontend handles the rest. Gemini or NVIDIA inference, PostgreSQL persistence, and an infeasibility diagnostic when the constraints can't be satisfied.
