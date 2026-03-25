# AI Booking Gateway & Widget Injector 🚀

> An intelligent, embeddable widget system featuring AI-driven voice and chat assistants. Designed for seamless integration and lead generation, powered by Next.js and AWS Bedrock.

[![Next.js](https://img.shields.io/badge/Next.js-16.2-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue?logo=react)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![AWS](https://img.shields.io/badge/AWS-Bedrock%20%7C%20Polly-FF9900?logo=amazonaws)](https://aws.amazon.com/)
[![Vitest](https://img.shields.io/badge/Vitest-Testing-729B1B?logo=vitest)](https://vitest.dev/)

## 🌟 Overview

The **AI Booking Gateway** (internal codename: `widget-inyector`) is a modern front-end application and embeddable widget solution. It provides websites with instant AI capabilities, including voice-enabled assistants, intelligent chat interfaces, and automated data extraction for lead generation.

### Key Features

- **Conversational AI Widget:** Embeddable chat and voice assistant elements (`AIAssistantChat`, `AIAssistantVoice`).
- **Voice Synthesis:** Integrated with **AWS Polly** and **AWS Bedrock Runtime** for natural language understanding and text-to-speech.
- **Dynamic Content Scraping:** Utilizes `cheerio` to parse target websites and contextualize the AI assistant dynamically.
- **High-Performance UI:** Built on **React 19** and **Next.js 16.2** (Turbopack enabled) with fluid animations via **Framer Motion**.
- **Modern Styling:** Styled edge-to-edge using **Tailwind CSS v4** and customized icons from `lucide-react`.

## 🏗️ Technical Architecture

This project is built with scalability, performance, and developer experience (DX) in mind:

- **Framework:** Next.js (App Router) for hybrid SSR/SSG and serverless API routes.
- **Language:** TypeScript `v5` with strict typing for maximum reliability.
- **Styling Strategy:** Tailwind CSS (v4) paired with `clsx` and `tailwind-merge` for dynamic component styling.
- **Testing:** Comprehensive unit and component testing setup using **Vitest**, `jsdom`, and `@testing-library/react`.
- **Linting & Formatting:** Enforced code quality via ESLint 9.

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- `npm`, `yarn`, or `pnpm`
- AWS Credentials configured in your environment (for Bedrock and Polly access)

### Installation

1. Clone the repository:

   ```bash
   git clone git@github.com:Franklin-Osede/ai-booking-gateway.git
   ```

2. Navigate into the project directory:

   ```bash
   cd widget-inyector
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Set up environment variables:
   Duplicate the `.env.local.example` (or set up `.env.local`) with your AWS configurations and other required keys.

### Development

Start the development server with Turbopack enabled:

```bash
npm run dev
```

The application will be available at `http://localhost:3005`.

## 🧪 Testing

Run the test suite using Vitest to ensure code acts as expected:

```bash
npx vitest
```

## 📈 Scalability & Future Roadmap

- Implementation of further modular widget components.
- Expanding AI LLM integrations beyond initial Bedrock runtimes.
- Sophisticated metrics dashboards for interaction analysis.

---

_Designed and developed with modern web engineering standards._
