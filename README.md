# POCs with AI

A collection of focused proof-of-concept applications built to explore how AI-assisted delivery can accelerate product discovery, UI modernization, workflow prototyping, and stakeholder demos.

Each exercise is treated as a standalone product slice: it has its own brief, domain context, frontend implementation, and demo narrative. The goal is not to produce disposable screens, but to create credible prototypes that can be evaluated by business, operations, and technology stakeholders.

## Current Exercises

| Exercise | Domain | Status | Live Demo | Summary |
| --- | --- | --- | --- | --- |
| [Exercise 01 - Emirates Logistics](./Excercise-01-Emirates-Logistics) | Transport Management System | Active | [Open demo](https://pocs-with-ai.vercel.app/admin/dashboard) | Role-based TMS proof of concept for Admin, Customer, and Vendor workflows across booking, trip scheduling, live tracking, and billing settlement. |

## Glimpses
<img width="1919" height="1139" alt="image" src="https://github.com/user-attachments/assets/02c0fda9-d56e-4e6d-af84-b0aec0cb3461" />

## Repository Goals

- Build realistic product demos from structured business briefs.
- Preserve domain workflows while modernizing user experience.
- Keep each POC easy to run, inspect, and deploy.
- Document assumptions, demo flow, and implementation boundaries.
- Use reusable UI patterns where they make the prototype feel production-minded.


## Project Structure

```text
.
├── Excercise-01-Emirates-Logistics/
│   ├── context.md
│   ├── POC-BRIEF.md
│   ├── README.md
│   └── frontend/
│       ├── src/
│       ├── package.json
│       └── vercel.json
├── LICENSE
└── README.md
```

## How to Work with an Exercise

1. Open the exercise folder.
2. Read `POC-BRIEF.md` for business intent.
3. Read `context.md` for demo script and implementation notes.
4. Follow the exercise-level `README.md` for setup, run, and deployment instructions.

## Quality Bar

Each POC should be understandable on first open:

- Clear product positioning.
- Professional visual presentation.
- Stable demo flow.
- Documented setup commands.
- Explicit in-scope and out-of-scope boundaries.
- No hidden assumptions required to understand the prototype.

## License

This repository is licensed under the terms in [LICENSE](./LICENSE).
