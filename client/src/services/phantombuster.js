/**
 * PhantomBuster API Service
 * Frontend service for interacting with PhantomBuster through the backend API
 */

import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

/**
 * Get list of all PhantomBuster agents
 */
export async function getAgents() {
  const response = await axios.get(`${API_BASE_URL}/api/phantombuster/agents`);
  return response.data;
}

/**
 * Get status and details of a specific agent
 * @param {string} agentId - The ID of the agent
 */
export async function getAgentStatus(agentId) {
  const response = await axios.get(`${API_BASE_URL}/api/phantombuster/agents/${agentId}`);
  return response.data;
}

/**
 * Get output/results from a specific agent
 * @param {string} agentId - The ID of the agent
 * @param {string} mode - Either "most-recent" or "all"
 */
export async function getAgentOutput(agentId, mode = 'most-recent') {
  const response = await axios.get(
    `${API_BASE_URL}/api/phantombuster/agents/${agentId}/output`,
    { params: { mode } }
  );
  return response.data;
}

/**
 * Launch an agent to start scraping
 * @param {string} agentId - The ID of the agent
 * @param {Object} argument - Optional parameters to pass to the agent
 */
export async function launchAgent(agentId, argument = null) {
  const response = await axios.post(
    `${API_BASE_URL}/api/phantombuster/agents/launch`,
    { agent_id: agentId, argument }
  );
  return response.data;
}

/**
 * Get list of all result containers
 */
export async function getContainers() {
  const response = await axios.get(`${API_BASE_URL}/api/phantombuster/containers`);
  return response.data;
}

/**
 * Get data from a specific result container
 * @param {string} containerId - The ID of the container
 */
export async function getContainerData(containerId) {
  const response = await axios.get(`${API_BASE_URL}/api/phantombuster/containers/${containerId}`);
  return response.data;
}

/**
 * PhantomBuster service object with all methods
 */
const phantombusterService = {
  getAgents,
  getAgentStatus,
  getAgentOutput,
  launchAgent,
  getContainers,
  getContainerData
};

export default phantombusterService;
