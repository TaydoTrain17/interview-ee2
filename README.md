# AI Chat Assistant

A modern web application that allows users to have conversations with an AI assistant using both text and voice interactions.

## Features

- **Text-based Chat**: Type messages and get real-time responses from the AI
- **Voice Input**: Use your microphone to speak to the AI
- **Text-to-Speech**: Have the AI responses read aloud
- **Responsive Design**: Works on desktop and mobile devices

## Technologies Used

- **Next.js**: React framework for the frontend
- **TypeScript**: For type-safe code
- **Tailwind CSS**: For styling
- **OpenAI API**: For generating AI chat responses
- **Web Speech API**: For speech recognition and text-to-speech

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- An OpenAI API key

### Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env.local` file in the root directory with your OpenAI API key:
   ```
   OPENAI_API_KEY=your_api_key_here
   ```

### Running the Application

```
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Usage

1. Type a message in the input field and click the send button, or press Enter
2. Click the microphone button to start voice input
3. Click the play button on an AI response to have it read aloud

## Browser Compatibility

- Speech recognition features work best in Chrome, Edge, and Safari
- Text-to-speech is supported in most modern browsers

## License

MIT
