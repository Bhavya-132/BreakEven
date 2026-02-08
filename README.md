# BreakEven: Relationship Finance Toolkit
## Product Overview
One-liner: A relationship finance toolkit that helps women split fairly, separate safely, and plan an exit with clear steps—powered by simulated banking data (Nessie) and AI explanations.

### Core Promise

Users don’t just "see" spending; they receive two distinct, actionable paths to reach their financial goals:

Fast Plan: The shortest possible timeline to reach a savings goal through aggressive budgeting.

Steady Plan: A sustainable, lower-burnout approach that preserves a "joy budget."

### Target Users

Women seeking more control over shared household finances.

Women establishing a personal financial buffer while remaining in a relationship.

Women requiring a step-by-step financial plan to move out safely.

## Key Features
Data Ingestion: Automated transaction pulling and categorization via the Nessie simulated banking API.

Financial Modes:

BALANCE: Fairness and split analysis for shared expenses.

SEPARATE: Managing "mine/ours/yours" and building personal buffers.

EXIT: A comprehensive leaving plan with a concrete timeline.

Plan Generator: Deterministic logic to calculate monthly savings, months to goal, and specific category adjustments.

AI Explanation Layer: Leveraging OpenRouter to provide plain-English summaries and weekly action checklists.

## Tech Stack
Languages: TypeScript, JavaScript (ES6+), HTML5, CSS3

Frontend: Next.js (App Router), React, Tailwind CSS

Backend: Node.js (Express or Fastify), TypeScript

Database: MongoDB

AI/LLM: OpenRouter (GPT-4/Claude integration for narrative explanations)

Banking API: Nessie (Capital One simulated data)

Voice/Audio: ElevenLabs (Optional)

## Project Structure
Plaintext
breakeven/
  apps/
    web/                # Frontend (Next.js)
      src/app/          # Dashboard, Modes, and Plan views
      src/components/   # Reusable UI (ModeCards, PlanCards)
    api/                # Backend (Node/Express)
      src/integrations/ # Nessie and OpenRouter logic
      src/controllers/  # Plan generation and data normalization
  packages/
    shared/             # Shared TypeScript types and constants
  docs/                 # Product and Security documentation
  .env.example          # Environment template
## Getting Started
### Prerequisites

Node.js (v18 or higher)

MongoDB instance (local or Atlas)

API Keys for Nessie and OpenRouter

### Installation

Clone the repository: git clone https://github.com/Bhavya-132/BreakEven.git

Install dependencies: npm install

Configure Environment Variables: Create a .env file in the api and web folders based on .env.example: NESSIE_API_KEY=your_key_here OPENROUTER_API_KEY=your_key_here MONGODB_URI=your_mongodb_uri

Run the development server: npm run dev

## User Flow
Connect: Import spending data via Nessie or load the demo dataset.

Choose Mode: Select Balance, Separate, or Exit based on current needs.

Set Goal: Define the target amount (e.g., $3,000 for a relocation buffer).

Generate: Review the Fast vs. Steady plans.

Execute: Follow the AI-generated weekly checklist and track progress.

## Security and Privacy
Simulated Data: All financial data is simulated via Nessie. Users are instructed never to enter real banking credentials.

Server-Side Secrets: All API keys (Nessie, OpenRouter) are managed strictly on the server side.

Privacy First: The UI is designed to be calm and non-judgmental, featuring a "quick exit" safety button for users in sensitive situations.

## License
Distributed under the MIT License.
