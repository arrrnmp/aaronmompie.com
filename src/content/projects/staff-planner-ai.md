---
title: "Staff Planner AI"
description: "Weekly scheduling where the model parses intent and OR-Tools enforces the math."
role: "Design & Engineering"
techStack: ["React 19", "Bun", "TypeScript", "Python", "OR-Tools", "PostgreSQL"]
github: https://github.com/arrrnmp/staff-planner-ai
order: 1
es:
  description: "Cuadrantes semanales en los que el modelo interpreta lo que pides y OR-Tools pone las matemáticas."
  role: "Diseño e ingeniería"
  long: "Hacer el cuadrante semanal es un problema de restricciones. Esta app deja que un responsable describa las reglas en lenguaje natural: la IA interpreta la intención, un solver de OR-Tools en Python garantiza que el horario sea viable y un frontend en React se encarga del resto. Inferencia con Gemini o NVIDIA, persistencia en PostgreSQL y un diagnóstico que explica por qué no hay solución cuando las restricciones no se pueden cumplir."
---

Weekly staff scheduling is a constraint problem. This app lets a manager describe rules in plain language — the AI parses intent, a Python OR-Tools solver enforces feasibility, and a React frontend handles the rest. Gemini or NVIDIA inference, PostgreSQL persistence, and an infeasibility diagnostic when the constraints can't be satisfied.
