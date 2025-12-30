# Social Forge

Social Forge is a cross-platform social media content generator powered by Gemini. It allows you to create tailored posts and images for LinkedIn, Twitter, Instagram, Pinterest, YouTube, and Discord instantly from a single idea.

## Features

-   **Multi-Platform Generation:** Generate content for LinkedIn, Twitter, Instagram, Pinterest, YouTube, and Discord simultaneously.
-   **AI-Powered:** Utilizes Google's Gemini models for high-quality text and image generation.
-   **Customizable Settings:**
    -   **Tone:** Choose from Professional, Casual, Enthusiastic, Witty, or Direct.
    -   **Image Size:** Support for various resolutions (1024x1024, 1280x720, etc.).
    -   **Aspect Ratio:** Auto, 1:1, 16:9, 4:5, etc.
    -   **Text Length:** Short, Medium, or Long.
-   **Regeneration:** Individually regenerate text or images for specific platforms if the initial result isn't perfect.
-   **Modern UI:** A clean, dark-mode interface built with React and Tailwind CSS.

## Tech Stack

-   **Frontend:** [React](https://react.dev/), [Vite](https://vitejs.dev/), [TypeScript](https://www.typescriptlang.org/)
-   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
-   **Icons:** [Lucide React](https://lucide.dev/)
-   **AI:** [Google GenAI SDK](https://ai.google.dev/) (Gemini)

## Prerequisites

-   [Node.js](https://nodejs.org/) (v16 or higher recommended)
-   A Google Gemini API Key. You can get one from [Google AI Studio](https://aistudio.google.com/).

## Getting Started

1.  **Clone the repository** (if applicable) or download the source code.

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Configure Environment Variables:**

    Create a `.env.local` file in the root directory and add your Gemini API key:

    ```env
    GEMINI_API_KEY=your_api_key_here
    ```

    > **Note:** The application uses Vite's environment variable loading and exposes this key as `process.env.API_KEY` to the application.

4.  **Run the development server:**

    ```bash
    npm run dev
    ```

5.  **Open the app:**

    Visit `http://localhost:5173` (or the port shown in your terminal) in your browser.

## Usage

1.  Enter your idea in the text area (e.g., "Launching a new eco-friendly coffee mug").
2.  Adjust the settings (Tone, Length, Image Size) using the settings panel.
3.  Click **Generate Campaign**.
4.  Wait for the AI to generate text and images for all platforms.
5.  Review the results. You can regenerate specific text or images by clicking the refresh icon on each card.

## License

This project is private and proprietary.
