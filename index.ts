import { McpServer, ResourceTemplate } from '@modelcontextprotocol/sdk/server/mcp.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import { z } from 'zod'
import axios from 'axios'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

// Create an MCP server
const server = new McpServer({
	name: 'Demo',
	version: '1.0.0',
})

// Reed API configuration
const REED_API_KEY = process.env.REED_API_KEY // Using environment variable
const REED_API_BASE_URL = 'https://www.reed.co.uk/api/1.0'

// Interface for Reed API job responses
interface ReedJob {
	jobId: number
	employerId: number
	employerName: string
	jobTitle: string
	locationName: string
	minimumSalary?: number
	maximumSalary?: number
	yearlyMinimumSalary?: number
	yearlyMaximumSalary?: number
	currency?: string
	expirationDate?: string
	date?: string
	jobDescription?: string
	applications?: number
	jobUrl?: string
	contractType?: string
	jobType?: string
	salaryType?: string
}

server.tool(
	'mcp_reed_jobs_search_jobs',
	{
		keywords: z.string(),
		locationName: z.string().optional(),
		contract: z.boolean().optional(),
		permanent: z.boolean().optional(),
		fullTime: z.boolean().optional(),
		partTime: z.boolean().optional(),
		minimumSalary: z.number().optional(),
		maximumSalary: z.number().optional(),
		distanceFromLocation: z.number().optional(),
		resultsToTake: z.number().optional(),
		resultsToSkip: z.number().optional(),
	},
	async (args: any) => {
		try {
			const { keywords, locationName, contract, permanent, fullTime, partTime, minimumSalary, maximumSalary, distanceFromLocation, resultsToTake, resultsToSkip } = args

			// Reed API search endpoint
			const response = await axios.get(`${REED_API_BASE_URL}/search`, {
				params: {
					keywords,
					locationName,
					contract: contract === true ? 'true' : undefined,
					permanent: permanent === true ? 'true' : undefined,
					fullTime: fullTime === true ? 'true' : undefined,
					partTime: partTime === true ? 'true' : undefined,
					minimumSalary,
					maximumSalary,
					distanceFromLocation,
					resultsToTake: resultsToTake || 25,
					resultsToSkip,
				},
				auth: {
					username: REED_API_KEY || '',
					password: '',
				},
			})

			// Extract jobs from the response (Reed API returns results within a wrapper)
			const jobs = (response.data.results || []) as ReedJob[]

			// Format jobs as a table-like string for text display
			const jobsText = jobs
				.map(
					(job: ReedJob) =>
						`${job.jobTitle} at ${job.employerName}\n` +
						`Location: ${job.locationName}\n` +
						`${
							job.minimumSalary !== undefined && job.maximumSalary !== undefined
								? `Salary: £${job.minimumSalary?.toLocaleString()} - £${job.maximumSalary?.toLocaleString()}\n`
								: job.minimumSalary !== undefined
								? `Salary: £${job.minimumSalary?.toLocaleString()}\n`
								: ''
						}` +
						`Date Posted: ${job.date || 'Not specified'}\n` +
						`Job ID: ${job.jobId}\n` +
						`URL: https://www.reed.co.uk/jobs/${job.jobId}\n`
				)
				.join('\n')

			return {
				content: [
					{
						type: 'text',
						text: `Found ${jobs.length} jobs matching "${keywords}"${locationName ? ` in ${locationName}` : ''}\n\n${jobsText}`,
					},
				],
			}
		} catch (error) {
			console.error('Error searching jobs:', error)
			return {
				content: [
					{
						type: 'text',
						text: `Error searching for jobs: ${error instanceof Error ? error.message : String(error)}`,
					},
				],
			}
		}
	}
)

server.tool(
	'mcp_reed_jobs_get_job_details',
	{
		jobId: z.number(),
	},
	async (args) => {
		try {
			const { jobId } = args

			// Reed API job details endpoint
			const response = await axios.get(`${REED_API_BASE_URL}/jobs/${jobId}`, {
				auth: {
					username: REED_API_KEY || '',
					password: '',
				},
			})

			const job = response.data as ReedJob

			// Format job details as text
			const jobDetails =
				`${job.jobTitle} at ${job.employerName}\n\n` +
				`Location: ${job.locationName}\n` +
				`${
					job.minimumSalary !== undefined && job.maximumSalary !== undefined
						? `Salary: £${job.minimumSalary?.toLocaleString()} - £${job.maximumSalary?.toLocaleString()} ${job.currency || 'GBP'}\n`
						: job.minimumSalary !== undefined
						? `Salary: £${job.minimumSalary?.toLocaleString()} ${job.currency || 'GBP'}\n`
						: ''
				}` +
				`${job.salaryType ? `Salary type: ${job.salaryType}\n` : ''}` +
				`Contract type: ${job.contractType || 'Not specified'}\n` +
				`Job type: ${job.jobType || 'Not specified'}\n` +
				`Expires: ${job.expirationDate || 'Not specified'}\n\n` +
				`Description:\n${job.jobDescription || 'No description provided'}\n\n` +
				`Apply at: https://www.reed.co.uk/jobs/${jobId}`

			return {
				content: [
					{
						type: 'text',
						text: jobDetails,
					},
				],
			}
		} catch (error) {
			console.error('Error getting job details:', error)
			return {
				content: [
					{
						type: 'text',
						text: `Error getting job details: ${error instanceof Error ? error.message : String(error)}`,
					},
				],
			}
		}
	}
)

// Start receiving messages on stdin and sending messages on stdout
const transport = new StdioServerTransport()
await server.connect(transport)
