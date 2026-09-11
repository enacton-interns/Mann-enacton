# Content Repurposing System (AI-Powered)

An enterprise-grade AI platform designed to bridge the gap between long-form video content and high-engagement social media marketing. This system empowers YouTubers, creators, and students to extract maximum value from video content by leveraging Retrieval-Augmented Generation (RAG).

## 🚀 The Vision

In an era of information overload, this system acts as your personal research assistant and content strategist. It doesn't just summarize; it understands the nuance of your videos, allowing you to:

- **Repurpose**: Instantly transform a 60-minute video into LinkedIn posts, X (Twitter) threads, or visual assets.
- **Query**: Ask complex questions about a video and receive precise, cited answers.
- **Learn**: Deep-dive into educational content without watching the entire video.

## 🏗️ System Architecture

The system follows a modern RAG (Retrieval-Augmented Generation) architecture:

1.  **Ingestion Pipeline**: Fetches raw YouTube transcripts, cleans them, and segments them into semantically meaningful chunks using LangChain.
2.  **Embedding Engine**: Converts text chunks into high-dimensional vectors using Google's Gemini Embedding models.
3.  **Vector Storage**: Stores vectors in a PostgreSQL database using `pgvector`, enabling high-performance semantic similarity searches.
4.  **Retrieval & Synthesis**: When a user queries the system, it performs a vector search to find the most relevant transcript segments, then feeds them into a Gemini LLM with a specialized system prompt to generate accurate, context-aware responses.

## 📂 Project Structure

```text
src/
├── app/
│   ├── api/          # Backend logic (RAG search, content generation, source ingestion)
│   ├── chat/         # Interactive chat interface for video Q&A
│   ├── dashboard/    # Central hub for managing video sources and analytics
│   └── sources/      # Dynamic workspaces for individual video analysis
├── components/       # Reusable UI components (Dashboard, Workspace, Sources)
├── lib/
│   ├── ai/           # Core AI logic (chunking strategies, embedding generation)
│   ├── db/           # Drizzle ORM schema and database query layer
│   └── youtube/      # Utilities for transcript fetching and timestamp navigation
└── types/            # TypeScript interfaces for data consistency
```

## 🛠️ Tech Stack

- **Framework**: Next.js (App Router)
- **AI/LLM**: Google Gemini API (Flash/Pro models)
- **Database**: PostgreSQL + `pgvector`
- **ORM**: Drizzle ORM
- **Text Processing**: LangChain
- **Styling**: Tailwind CSS

## ⚙️ Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database with `pgvector` extension enabled.

### Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```
2. **Environment Configuration**:
   Create a `.env` file in the root directory:
   ```env
   DATABASE_URL=your_postgres_connection_string
   GOOGLE_GENERATIVE_AI_API_KEY=your_gemini_key
   MISTRAL_EMBEDDINGS_API_KEY=your_mistral_key
   ```
3. **Database Migration**:
   Run the following command to push your schema to the database:
   ```bash
   npx drizzle-kit push
   ```
4. **Run the development server**:
   ```bash
   npm run dev
   ```

## 💡 Why this matters

For **Creators**, this is a force multiplier. It turns one hour of video production into a week's worth of social media content.
For **Students**, it is a cognitive tool. It allows you to "talk" to your study materials, find specific explanations, and synthesize complex arguments across long-form lectures.

---

## 👤 Maintainer

Developed and maintained by **Mann**.
