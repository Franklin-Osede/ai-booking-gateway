# AI Booking Gateway & Widget Injector 🚀

> An advanced, embeddable widget system featuring AI-driven voice and chat assistants. Designed for seamless integration, dynamic personalization, and high-conversion lead generation, powered by Next.js, AWS Bedrock, and AWS Polly.

[![Next.js](https://img.shields.io/badge/Next.js-16.2-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue?logo=react)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![AWS](https://img.shields.io/badge/AWS-Bedrock%20%7C%20Polly-FF9900?logo=amazonaws)](https://aws.amazon.com/)
[![Vitest](https://img.shields.io/badge/Vitest-Testing-729B1B?logo=vitest)](https://vitest.dev/)

## 🌟 Overview

The **AI Booking Gateway** (internal codename: `widget-inyector`) is a state-of-the-art front-end application and embeddable widget solution. It provides websites with instant AI capabilities, including interactive voice-enabled assistants, intelligent chat interfaces, and automated data extraction for contextualized lead generation.

## 🏆 Project Milestones & Core Features

We have recently implemented a massive suite of features focusing on conversion, realism, and robust architecture:

### 🎙️ Advanced Voice Assistant & TTS Pipeline
- **Authentic iOS-style UI:** A premium, familiar phone widget interface with a refined Push-to-Talk (PTT) demo flow.
- **Real Amazon Polly API Integration:** Seamless Text-to-Speech (TTS) pipeline linking the Voice UI to a robust Bedrock/Polly serverless backend endpoint.
- **Prosody Optimization:** Fine-tuned AWS Polly speech synthesis (including the "Marcos" voice) for highly natural, conversational cadence.
- **Interactive Demo Flow:** Multi-step voice demonstration with interactive tap-chips to guide users effortlessly through the conversion funnel.
- **Responsive & Seamless:** Widget resize updates for mobile and precise position alignment to avoid overlaps with existing site elements.

### 📅 Calendar & Booking Integration
- **Embedded AI Calendar:** Fully migrated the Voice Agent booking flow into an immersive, React-based inline calendar, dramatically reducing booking friction directly within the widget.

### 🧠 Dynamic Personalization & Scraping
- **Contextual Scraping:** Implemented dynamic target website scanning (`?site` parsing) to provide highly personalized AI greetings based on the host page.
- **Niche Configuration Engine:** Expanded `nicheConfig` to definitively cover 7 specific industry sectors (Dental, Legal, SaaS, Auto, etc.), automatically customizing the AI's behavior and terminology.
- **Resilient Fallbacks:** Hardened scraping proxies with generic aesthetic fallbacks to guarantee a perfect presentation and completely prevent AI hallucination when target data is unavailable or restrictive.

### ⚙️ Engine & Dashboard Upgrades
- **API Standardization:** Migrated all proxy and scraper endpoints to strict **v1 OpenAPI standards**.
- **Dashboard Enhancements:** Upgraded the injector panel to dynamically serve complete voice agent payloads instead of legacy static lead magnets.
- **Chat UX Polish:** Removed slow connecting animations to improve immediate conversion rates and resolved render loop issues for flawless long-session stability.

## 🏗️ Technical Architecture

This project strictly adheres to **Clean Architecture / Domain-Driven Design (DDD)** principles, structured into `app`, `application`, `domain`, `infrastructure`, and `presentation` layers to guarantee maximum enterprise scalability.

- **Framework:** Next.js 16.2 (App Router) with Turbopack for hybrid SSR/SSG and serverless API routes.
- **Language:** TypeScript `v5` ensuring absolute type safety across all domains.
- **Styling UI:** Tailwind CSS v4, Framer Motion for fluid edge-to-edge animations, and customizable `lucide-react` icons.
- **Testing:** Comprehensive Vite-powered test environment (`vitest`, `jsdom`, `@testing-library/react`).

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- `npm`, `yarn`, or `pnpm`
- AWS Credentials configured in your environment for Bedrock and Polly access

### Installation & Run

1. **Clone & Install:**
   ```bash
   git clone git@github.com:Franklin-Osede/ai-booking-gateway.git
   cd widget-inyector
   npm install
   ```

2. **Environment Variables:**
   Duplicate the `.env.local.example` to `.env.local` and populate your AWS configurations.

3. **Development Server:**
   ```bash
   npm run dev
   ```
   *Application will be available at `http://localhost:3005`*

## 🧪 Testing

Run the automated Vitest suite to validate domain logic and UI components:
```bash
npx vitest
```

---
_Designed and developed with modern web engineering standards._
