[![MseeP.ai Security Assessment Badge](https://mseep.net/pr/kld3v-reed-jobs-mcp-badge.png)](https://mseep.ai/app/kld3v-reed-jobs-mcp)

# Reed Jobs MCP Server
[![smithery badge](https://smithery.ai/badge/@kld3v/reed_jobs_mcp)](https://smithery.ai/server/@kld3v/reed_jobs_mcp)

A Model Context Protocol (MCP) server that integrates with the Reed Jobs API to search and retrieve job listings. Built with TypeScript and designed to work seamlessly with Cursor IDE.

## Features

- 🔍 Search jobs with multiple filters (keywords, location, salary, contract type)
- 📋 Get detailed job information
- 🌍 Remote work filter support
- 💰 Salary range filtering
- 📍 Location-based search with distance parameters

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- A Reed API key (get one from [Reed Developer Portal](https://www.reed.co.uk/developers))

### Installation

#### Installing via Smithery

To install Reed Jobs for Claude Desktop automatically via [Smithery](https://smithery.ai/server/@kld3v/reed_jobs_mcp):

```bash
npx -y @smithery/cli install @kld3v/reed_jobs_mcp --client claude
```

#### Manual Installation

1. Clone the repository:

```bash
git clone <your-repo-url>
cd reed-jobs-mcp
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the root directory:

```bash
REED_API_KEY=your_reed_api_key_here
```

4. Build the project:

```bash
npm run build
```

5. Start the server:

```bash
npm start
```

### Cursor IDE Configuration

Add this to your `mcp.json` in Cursor:

```json
{
	"mcpServers": {
		"reed-jobs-mcp": {
			"command": "node",
			"args": ["path/to/your/dist/index.js"],
			"cwd": "path/to/your/project"
		}
	}
}
```

## Available Tools

### Search Jobs

```typescript
mcp_reed_jobs_search_jobs({
	keywords: string,
	locationName: string,
	contract: boolean,
	permanent: boolean,
	fullTime: boolean,
	partTime: boolean,
	minimumSalary: number,
	maximumSalary: number,
	distanceFromLocation: number,
})
```

### Get Job Details

```typescript
mcp_reed_jobs_get_job_details({
	jobId: number,
})
```

## Environment Variables

- `REED_API_KEY`: Your Reed API key

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see below:

```
MIT License

Copyright (c) 2024

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## Acknowledgments

- Thanks to Reed.co.uk for providing the API
- Built with Model Context Protocol
- If this project helps you, please consider giving it a ⭐️

---

Built with ❤️ using TypeScript and MCP
