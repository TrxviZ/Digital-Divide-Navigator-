is# Digital Divide Navigator

### Bridging the Digital Divide Through AI-Powered Accessibility

Digital Divide Navigator is an AI-powered web application designed to make digital services easier to access and understand, especially for people with limited digital literacy, students, and individuals who struggle with complex online forms.

The project uses a conversational AI assistant to understand information provided in natural language, identify missing details, and guide users through form-filling processes with follow-up questions.

---

## Problem Statement

Many people struggle to access essential digital services because:

- Online application forms can be complicated and confusing.
- Users may not understand technical terms or form requirements.
- Filling lengthy forms manually can be time-consuming.
- People with limited digital literacy may not know what information is required.
- Language and accessibility barriers can make online services difficult to use.

**Digital Divide Navigator aims to simplify these experiences through AI-assisted guidance.**

## Key Features

- **AI-Powered Information Extraction:** Understands information written in natural language.
- **Conversational Assistance:** Allows users to provide information through a conversation.
- **Smart Follow-Up Questions:** Identifies missing information and asks users for clarification.
- **Dynamic Form Analysis:** Analyses publicly accessible HTML forms and identifies their fields.
- **Scholarship Form Assistance:** Helps users organise information required for scholarship applications.
- **Local AI Processing:** Uses Ollama to run language models locally.
- **Missing Information Detection:** Tracks required fields that have not yet been provided.
- **Accessible Web Interface:** Provides a web-based interface for interacting with the assistant.

## Technology Stack

| Component | Technology |
|---|---|
| Frontend | React |
| Frontend Development Server | Vite |
| Backend | Node.js |
| Backend Framework | Express.js |
| AI Engine | Ollama |
| AI Model | Qwen 3.5 (0.8B) |
| HTTP Requests | Axios |
| HTML Parsing | Cheerio |
| API Communication | REST API |
| Version Control | Git & GitHub |

## Project Architecture

```text
Digital-Divide-Navigator/
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── App.js
│   │   └── ...
│   ├── package.json
│   └── ...
│
├── backend/
│   ├── server.js
│   ├── package.json
│   └── ...
│
└── README.md
```

### How It Works

```text
       User
        |
        v
   React Frontend
        |
        v
   Express Backend
        |
        +-------------------+
        |                   |
        v                   v
   Cheerio Parser        Ollama AI
        |                   |
        v                   v
   Form Field Data     Information Extraction
        |                   |
        +---------+---------+
                  |
                  v
          Missing Field Check
                  |
          +-------+-------+
          |               |
       Missing          Complete
          |               |
          v               v
    Follow-Up       Field Mapping
     Questions
          |
          v
    User Responses
```

## Installation and Setup

### Prerequisites

Install the following:

- Node.js (18 or later recommended)
- npm
- Git
- Ollama

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/Digital-Divide-Navigator.git

cd Digital-Divide-Navigator
```

### 2. Install Frontend Dependencies

```bash
cd frontend
npm install
```

### 3. Install Backend Dependencies

Open another terminal:

```bash
cd backend
npm install
```

If Cheerio is missing, install it using:

```bash
npm install cheerio
```

### 4. Configure Ollama

Install Ollama and download the model:

```bash
ollama pull qwen3.5:0.8b
```

Make sure Ollama is running before starting the backend.

Check the installed models:

```bash
ollama list
```

### 5. Start the Backend

From the backend directory:

```bash
npm start
```

The backend runs on:

```text
http://localhost:5000
```

### 6. Start the Frontend

Open another terminal:

```bash
cd frontend
npm run dev
```

Vite will provide a local development URL, usually:

```text
http://localhost:5173
```

Open that address in your browser.

## Application Workflow

### Step 1: Enter Information

The user provides their personal, academic, or application-related information in natural language.

### Step 2: Analyse the Form

The application accepts a publicly accessible form URL (we used for https://kissing-occurred-brooks-preservation.trycloudflare.com )and analyses its HTML structure to identify fields, labels, and required information.

### Step 3: AI Information Extraction

The backend sends the user's information and form field requirements to the locally running Ollama model.

### Step 4: Identify Missing Information

The AI compares the information provided with the required form fields.

### Step 5: Ask Follow-Up Questions

If information is missing, the assistant asks questions to collect the remaining details.

### Step 6: Prepare Field Mapping

Once enough information is collected, the application prepares a structured mapping of form fields and their corresponding values.

## Backend API

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/health` | Checks backend availability |
| POST | `/api/analyze-form` | Analyses an HTML form URL |
| POST | `/api/collect-info` | Extracts information and identifies missing fields |

## Future Improvements

- Tamil, Hindi, and other regional language support.
- Voice-based interaction for users who find typing difficult.
- Document upload and automatic information extraction.
- Browser extension for assisted filling of external forms.
- Secure user authentication and data protection.
- Integration with government scholarship and welfare scheme databases.
- Mobile-friendly and low-bandwidth experience.
- Improved accessibility for elderly and differently abled users.
- Deployment on low-cost hardware such as the Arduino UNO Q.

## Privacy and Security

Digital Divide Navigator is designed around local AI processing through Ollama.

However, the current prototype is not a production-ready system for sensitive personal information.

- Use fictional information while testing.
- Do not enter real identity documents or sensitive financial details into an unsecured deployment.
- Use HTTPS and appropriate access controls before making the application publicly available.
- Review all extracted information before using it in an actual application.

## Current Limitations

- Form analysis currently relies on HTML fields that are available in the fetched page source.
- JavaScript-rendered forms, login-protected pages, and some dynamic websites may not be supported.
- The current implementation prepares field mappings but does not automatically populate or submit external websites.
- AI-generated extraction results should always be reviewed by the user.

## Project Vision

Our vision is to make digital services accessible to everyone, regardless of their technical knowledge, educational background, or access to expensive computing resources.

By combining conversational AI, local processing, and simple user experiences, Digital Divide Navigator aims to turn complicated digital processes into understandable, guided interactions.

**Technology should empower everyone, not leave anyone behind.**

---

## Contributors

Developed as an initiative to address the digital divide through accessible and AI-assisted technology.

Contributions, suggestions, and feedback are welcome!

## License

This project is currently an academic prototype. Add a `LICENSE` file to the repository if you intend to publish it under an open-source license.
