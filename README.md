# Medical Diagnosis Imaging Visualizer

Transform complex medical reports into interactive AI-generated visual diagnoses. This application uses Natural Language Processing (NLP) to extract medical findings from text reports and generates realistic medical images to help patients understand their diagnoses.

## 🎯 Project Overview

**Medical Diagnosis Imaging** is an innovative web application that bridges the gap between complex medical terminology and patient understanding. By converting medical reports into visual representations with AI-generated medical images, the system empowers patients with clarity about their health conditions.

### Key Features

- **📋 NLP Analysis**: Automatically extract key medical findings from complex medical reports
- **🖼️ AI Image Generation**: Generate realistic medical visualizations (X-rays, anatomical diagrams) based on extracted findings
- **🎨 Visual Mapping**: Map diagnoses to interactive body visualizations instantly
- **🔴 Severity Coding**: Color-coded severity levels (Severe/Moderate/Mild) for clarity
- **📊 History Tracking**: Save and retrieve past diagnoses for easy reference
- **👤 User Authentication**: Secure OAuth-based authentication
- **📱 Responsive Design**: Works seamlessly on desktop and mobile devices

## 🚀 Tech Stack

### Frontend
- **React 19** - UI framework
- **Tailwind CSS 4** - Styling
- **TypeScript** - Type safety
- **tRPC** - Type-safe API calls
- **Wouter** - Lightweight routing
- **Lucide React** - Icons

### Backend
- **Express.js** - Web server
- **tRPC** - RPC framework
- **Node.js** - Runtime

### Database
- **MySQL/TiDB** - Data persistence
- **Drizzle ORM** - Type-safe database queries

### AI & APIs
- **Image Generation API** - AI-powered medical image creation
- **Manus OAuth** - Authentication
- **LLM Integration** - Advanced NLP capabilities

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **pnpm** (package manager) - [Install pnpm](https://pnpm.io/installation)
- **Git** - [Install Git](https://git-scm.com/download)
- **MySQL Database** - Local or remote instance

## 🛠️ Installation

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/medical-diagnosis-imaging.git
cd medical-diagnosis-imaging
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Set Up Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# Database
DATABASE_URL=mysql://user:password@localhost:3306/medical_diagnosis

# OAuth
VITE_APP_ID=your_app_id
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://oauth.manus.im

# JWT
JWT_SECRET=your_jwt_secret_key

# API Keys
BUILT_IN_FORGE_API_KEY=your_api_key
BUILT_IN_FORGE_API_URL=https://api.manus.im

# App Configuration
VITE_APP_TITLE=Medical Diagnosis Imaging
VITE_APP_LOGO=/logo.svg
```

### 4. Set Up Database

Push the database schema:

```bash
pnpm db:push
```

### 5. Start the Development Server

```bash
pnpm dev
```

The application will be available at `http://localhost:3000`

## 📖 Usage

### For Patients/Users

1. **Sign In**: Authenticate using your credentials
2. **Enter Medical Report**: Paste your medical report text into the input field
3. **Analyze**: Click "Analyze Report" to extract findings
4. **View Visualization**: See the AI-generated medical image with highlighted problem areas
5. **Review Findings**: Check the extracted findings with severity indicators
6. **Save History**: Access past diagnoses from your history

### For Developers

#### Project Structure

```
medical-diagnosis-imaging/
├── client/                          # Frontend React application
│   ├── src/
│   │   ├── pages/                  # Page components
│   │   │   ├── Home.tsx            # Landing page
│   │   │   ├── Diagnosis.tsx       # Main diagnosis analyzer
│   │   │   └── NotFound.tsx        # 404 page
│   │   ├── components/             # Reusable UI components
│   │   │   ├── BodyVisualization.tsx
│   │   │   ├── DashboardLayout.tsx
│   │   │   └── ui/                 # shadcn/ui components
│   │   ├── lib/
│   │   │   └── trpc.ts             # tRPC client setup
│   │   ├── contexts/               # React contexts
│   │   ├── App.tsx                 # Main app component
│   │   ├── main.tsx                # Entry point
│   │   └── index.css               # Global styles
│   └── public/                     # Static assets
├── server/                          # Backend Express server
│   ├── routers.ts                  # tRPC procedure definitions
│   ├── db.ts                       # Database query helpers
│   ├── storage.ts                  # S3 storage helpers
│   └── _core/                      # Core server utilities
│       ├── index.ts                # Server setup
│       ├── trpc.ts                 # tRPC setup
│       ├── context.ts              # tRPC context
│       ├── env.ts                  # Environment variables
│       ├── llm.ts                  # LLM integration
│       ├── imageGeneration.ts      # Image generation API
│       └── voiceTranscription.ts   # Voice transcription
├── drizzle/                         # Database schema & migrations
│   ├── schema.ts                   # Table definitions
│   └── migrations/                 # Migration files
├── shared/                          # Shared constants & types
├── package.json                     # Dependencies
├── tsconfig.json                    # TypeScript config
├── vite.config.ts                  # Vite config
└── README.md                        # This file
```

#### Adding Features

1. **Update Database Schema** (`drizzle/schema.ts`)
2. **Run Migration** (`pnpm db:push`)
3. **Add Query Helpers** (`server/db.ts`)
4. **Create tRPC Procedures** (`server/routers.ts`)
5. **Build UI Components** (`client/src/pages/` or `client/src/components/`)
6. **Connect Frontend** (use `trpc.*.useQuery/useMutation()`)

## 🔧 Available Scripts

```bash
# Development
pnpm dev              # Start dev server

# Building
pnpm build            # Build for production
pnpm preview          # Preview production build

# Database
pnpm db:push          # Push schema changes to database
pnpm db:studio        # Open Drizzle Studio

# Linting & Formatting
pnpm lint             # Run ESLint
pnpm format           # Format code with Prettier

# Type Checking
pnpm type-check       # Check TypeScript types
```

## 🗄️ Database Schema

### Users Table
- `id`: Primary key
- `openId`: OAuth identifier
- `name`: User name
- `email`: User email
- `role`: User role (user/admin)
- `createdAt`: Creation timestamp
- `updatedAt`: Last update timestamp

### Diagnoses Table
- `id`: Primary key
- `userId`: Foreign key to users
- `reportText`: Medical report text
- `findings`: JSON string of extracted findings
- `generatedImageUrl`: URL to AI-generated image
- `createdAt`: Creation timestamp
- `updatedAt`: Last update timestamp

### Findings Table
- `id`: Primary key
- `diagnosisId`: Foreign key to diagnoses
- `bodyPart`: Affected body part
- `condition`: Medical condition
- `severity`: Severity level (severe/moderate/mild)
- `description`: Finding description
- `createdAt`: Creation timestamp

## 🔐 Security Considerations

1. **Environment Variables**: Never commit `.env` files
2. **Authentication**: Uses OAuth 2.0 with Manus
3. **Database**: Use SSL connections in production
4. **API Keys**: Store securely in environment variables
5. **Input Validation**: All inputs are validated on server-side

## 📝 API Documentation

### tRPC Procedures

#### `diagnosis.create`
Create a new diagnosis from medical report text.

**Input:**
```typescript
{
  reportText: string
}
```

**Output:**
```typescript
{
  diagnosisId: number
  findings: Finding[]
  imageUrl: string | null
}
```

#### `diagnosis.list`
Get all diagnoses for the current user.

**Output:**
```typescript
Diagnosis[]
```

#### `diagnosis.getById`
Get a specific diagnosis by ID.

**Input:**
```typescript
{
  diagnosisId: number
}
```

**Output:**
```typescript
Diagnosis | null
```

## 🚀 Deployment

### Deploy to Production

1. **Build the application**
   ```bash
   pnpm build
   ```

2. **Set production environment variables**
   ```bash
   export DATABASE_URL=your_production_db_url
   export JWT_SECRET=your_production_secret
   # ... set other env vars
   ```

3. **Run migrations**
   ```bash
   pnpm db:push
   ```

4. **Start the server**
   ```bash
   pnpm start
   ```

### Recommended Hosting Platforms
- **Vercel** - For frontend
- **Railway** - For backend + database
- **Render** - For full-stack deployment
- **AWS/Google Cloud** - For enterprise deployments

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For issues, questions, or suggestions:

1. **GitHub Issues** - Report bugs or request features
2. **Discussions** - Ask questions and share ideas
3. **Documentation** - Check the [GITHUB_SETUP.md](./GITHUB_SETUP.md) for setup help

## 🙏 Acknowledgments

- Built with [React](https://react.dev)
- Styled with [Tailwind CSS](https://tailwindcss.com)
- Database powered by [Drizzle ORM](https://orm.drizzle.team)
- API framework [tRPC](https://trpc.io)
- UI components from [shadcn/ui](https://ui.shadcn.com)

## 📞 Contact

For questions or collaboration opportunities, please reach out through:
- GitHub Issues
- Email: your-email@example.com
- LinkedIn: [Your Profile]

---

**Happy coding! 🚀**

Last updated: November 2024
