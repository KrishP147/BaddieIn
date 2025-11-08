"""
PhantomBuster API Client
Provides methods to interact with PhantomBuster API for LinkedIn scraping
"""

import os
from typing import Dict, List, Optional
import requests
from dotenv import load_dotenv

load_dotenv()


class PhantomBusterClient:
    """Client for interacting with PhantomBuster API"""

    def __init__(self, api_key: Optional[str] = None):
        """
        Initialize the PhantomBuster client

        Args:
            api_key: Your PhantomBuster API key (defaults to env var)
        """
        self.api_key = api_key or os.getenv("PHANTOMBUSTER_API_KEY")
        if not self.api_key:
            raise ValueError("PhantomBuster API key is required")

        self.base_url = "https://api.phantombuster.com/api/v2"
        self.headers = {
            "X-Phantombuster-Key": self.api_key,
            "Content-Type": "application/json"
        }

    def get_agents(self) -> List[Dict]:
        """Get list of all your agents (phantoms)"""
        response = requests.get(
            f"{self.base_url}/agents/fetch-all",
            headers=self.headers,
            timeout=30
        )
        response.raise_for_status()
        return response.json()

    def get_agent_output(self, agent_id: str, mode: str = "most-recent") -> Dict:
        """
        Get the output/results from a specific agent

        Args:
            agent_id: The ID of your agent/phantom
            mode: Either "most-recent" or "all"
        """
        response = requests.get(
            f"{self.base_url}/agents/fetch-output",
            headers=self.headers,
            params={"id": agent_id, "mode": mode},
            timeout=30
        )
        response.raise_for_status()
        return response.json()

    def launch_agent(self, agent_id: str, argument: Optional[Dict] = None) -> Dict:
        """
        Launch an agent to start scraping

        Args:
            agent_id: The ID of your agent/phantom
            argument: Optional parameters to pass to the agent
        """
        payload = {"id": agent_id}
        if argument:
            payload["argument"] = argument

        response = requests.post(
            f"{self.base_url}/agents/launch",
            headers=self.headers,
            json=payload,
            timeout=30
        )
        response.raise_for_status()
        return response.json()

    def get_containers(self) -> List[Dict]:
        """Get list of all result containers"""
        response = requests.get(
            f"{self.base_url}/containers/fetch-all",
            headers=self.headers,
            timeout=30
        )
        response.raise_for_status()
        return response.json()

    def get_container_data(self, container_id: str) -> Dict:
        """
        Get data from a specific result container
        This returns container metadata, not the actual data

        Args:
            container_id: The ID of the container
        """
        response = requests.get(
            f"{self.base_url}/containers/fetch",
            headers=self.headers,
            params={"id": container_id},
            timeout=30
        )
        response.raise_for_status()
        return response.json()

    def get_agent_result_object(self, agent_id: str) -> Dict:
        """
        Get the result object (CSV/JSON URLs) from an agent

        Args:
            agent_id: The ID of your agent/phantom
        """
        response = requests.get(
            f"{self.base_url}/agents/fetch-result-object",
            headers=self.headers,
            params={"id": agent_id},
            timeout=30
        )
        response.raise_for_status()
        return response.json()

    def get_agent_status(self, agent_id: str) -> Dict:
        """
        Get the current status of an agent

        Args:
            agent_id: The ID of your agent/phantom
        """
        response = requests.get(
            f"{self.base_url}/agents/fetch",
            headers=self.headers,
            params={"id": agent_id},
            timeout=30
        )
        response.raise_for_status()
        return response.json()


# Singleton instance for dependency injection
_client_instance: Optional[PhantomBusterClient] = None


def get_phantombuster_client() -> PhantomBusterClient:
    """Get or create the PhantomBuster client singleton"""
    global _client_instance
    if _client_instance is None:
        _client_instance = PhantomBusterClient()
    return _client_instance
