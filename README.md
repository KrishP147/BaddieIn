# LinkedIn Baddie Finder

A full-stack application that integrates with PhantomBuster to scrape and analyze LinkedIn profiles.

## Project Structure

- `client/` – React 18 + Vite frontend
- `server/` – FastAPI backend with PhantomBuster integration

## Features

- PhantomBuster API integration for LinkedIn scraping
- RESTful API endpoints for managing agents and containers
- Secure credential management with environment variables
- React frontend with Tinder-style swipe interface

## Getting Started

### Prerequisites

- Node.js 18+
- Python 3.11+
- PhantomBuster account and API key

### Setup

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd GoonedIn
```

2. **Create a `.env` file in the project root**
```bash
PHANTOMBUSTER_API_KEY=your-api-key-here
LINKEDIN_SESSION_COOKIE=your-linkedin-session-cookie-here
```

**IMPORTANT:** The `.env` file is already in `.gitignore`. Never commit your API keys!

3. **Get your PhantomBuster API Key**
   - Log in to [PhantomBuster](https://phantombuster.com)
   - Go to Settings → API
   - Copy your API key

4. **Get your LinkedIn Session Cookie**
   - Log in to LinkedIn in your browser
   - Open Developer Tools (F12)
   - Go to Application/Storage → Cookies
   - Find and copy the `li_at` cookie value

### Backend Setup

```bash
cd server
python -m venv .venv

# On Windows
.venv\Scripts\activate

# On macOS/Linux
source .venv/bin/activate

pip install -r requirements.txt
uvicorn app.main:app --reload
```

The API will be available at `http://127.0.0.1:8000`

### Frontend Setup

```bash
cd client
npm install
npm run dev
```

The React app will be available at `http://localhost:5173`

## API Endpoints

### PhantomBuster Endpoints

- `GET /api/phantombuster/agents` - List all agents
- `GET /api/phantombuster/agents/{agent_id}` - Get agent status
- `GET /api/phantombuster/agents/{agent_id}/output` - Get agent output
- `POST /api/phantombuster/agents/launch` - Launch an agent
- `GET /api/phantombuster/containers` - List all containers
- `GET /api/phantombuster/containers/{container_id}` - Get container data

### Health Check

- `GET /health` - Check API health

## Usage Examples

### Frontend (React)

```javascript
import { getAgents, launchAgent, getAgentOutput } from './services/phantombuster';

// Get all agents
const agents = await getAgents();

// Launch an agent
await launchAgent('agent-id-here', {
  sessionCookie: 'your-cookie'
});

// Get results
const output = await getAgentOutput('agent-id-here');
```

### Backend (Python)

```python
from app.services.phantombuster import get_phantombuster_client

client = get_phantombuster_client()

# Get all agents
agents = client.get_agents()

# Launch an agent
result = client.launch_agent('agent-id-here')

# Get output
output = client.get_agent_output('agent-id-here')
```

## Security Notes

- Never commit the `.env` file
- Never hardcode API keys in your code
- Use environment variables for all sensitive data
- If you accidentally commit secrets, regenerate them immediately

## Development

### Running Tests

```bash
# Backend tests (when implemented)
cd server
pytest

# Frontend tests (when implemented)
cd client
npm test
```

### Building for Production

```bash
# Frontend
cd client
npm run build

# Backend
cd server
# Use a production ASGI server like gunicorn
pip install gunicorn
gunicorn app.main:app -w 4 -k uvicorn.workers.UvicornWorker
```

## Troubleshooting

### "401 Unauthorized" Error
- Check that your API key is correct in `.env`
- Ensure the backend is loading the `.env` file

### "Agent not found" Error
- Verify the agent ID is correct
- Make sure you've created agents in PhantomBuster dashboard

### CORS Errors
- Ensure the frontend is running on `http://localhost:5173`
- Check CORS configuration in [server/app/main.py](server/app/main.py)

## License

MIT
