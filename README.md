# JQ-Genius

JQ-Genius is a web application that allows users to upload JSON files, generate JQ queries from natural language using AI, execute those queries, and visualize the results in a clear and accessible way. The project is designed with a modern and professional interface, making JSON data analysis and manipulation easy even for those unfamiliar with JQ.

---

## Table of Contents

- [Overview](#overview)
- [System Requirements](#system-requirements)
- [Installation](#installation)
- [Basic Usage](#basic-usage)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)
- [Credits](#credits)

---

## Overview

JQ-Genius simplifies working with JSON files by allowing you to:

- **Upload JSON files**: Upload files to analyze and query them.
- **Generate JQ queries using AI**: Write a query in natural language and the AI translates it into a valid JQ query.
- **Execute JQ queries**: Run the generated query on the JSON file and display the results.
- **Modern and responsive interface**: Inspired by a professional design, with readable colors and typography.

---

## System Requirements

- **Node.js** >= 18.x
- **npm** >= 9.x or **yarn**
- **Operating system**: Linux, macOS, or Windows
- **API Keys**:
  - `OPENAI_API_KEY` and/or `GOOGLE_GENAI_API_KEY` (see `.env`)

---

## Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/jq-genius.git
   cd jq-genius
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables:**

   Create a `.env` file in the project root (you can use the included example):

   ```
   GENAI_PROVIDER=openai/googleai
   OPENAI_API_KEY=your_openai_key
   GOOGLE_GENAI_API_KEY=your_google_key
   ```

4. **Run the app in development mode:**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser at** [http://localhost:9002](http://localhost:9002)

---

## Basic Usage

1. **Upload a JSON file** using the upload component.
2. **Write a query in natural language** (for example: "Select all users over 18 years old").
3. **Click on "Generate query"** to get the JQ query suggested by the AI.
4. **Run the query** and view the results on screen.
5. **Download the results** if you wish.

---

## Project Structure

- `/src/app/`  
  - `page.tsx`: Main page and interaction logic.
  - `layout.tsx`: Global layout and font/theme configuration.
  - `globals.css`: Global styles and CSS variables.
- `/src/components/ui/`  
  Reusable UI components (buttons, cards, menus, tables, etc.).
- `/src/ai/`  
  - `ai-instance.ts`: AI provider configuration (OpenAI, Google AI).
  - `flows/generate-jq-query.ts`: Logic to generate JQ queries from natural language.
- `/docs/blueprint.md`: Specification and design guidelines document.
- `/public/`: Static assets.
- `/next.config.ts`: Next.js configuration.
- `/tailwind.config.ts`: Tailwind CSS configuration.
- `.env`: Environment variables (do not upload to public repositories).

---

## Contributing

Contributions are welcome!

1. Fork the repository.
2. Create a branch for your feature or fix:
   ```bash
   git checkout -b my-feature
   ```
3. Make your changes and write tests if applicable.
4. Commit and push to your fork.
5. Open a Pull Request describing your changes.

Please follow good coding practices and respect the project structure.

---

## License

This project is under the MIT license. See the `LICENSE` file if present, or assume MIT by convention.

---

## Credits

- **Main author:** Alberto de la Cruz
- **Inspiration:** Firebase Studio, Next.js, Radix UI, Tailwind CSS
- **AI:** OpenAI, Google GenAI (depending on configuration)

---

Questions or suggestions? Open an issue or contact the author.
