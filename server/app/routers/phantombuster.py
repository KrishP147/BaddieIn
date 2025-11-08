"""
PhantomBuster API Routes
Endpoints for interacting with PhantomBuster scraping service
"""

from typing import Dict, List, Optional
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
import requests

from app.services.phantombuster import PhantomBusterClient, get_phantombuster_client


router = APIRouter(prefix="/api/phantombuster", tags=["phantombuster"])


class LaunchAgentRequest(BaseModel):
    """Request model for launching an agent"""
    agent_id: str
    argument: Optional[Dict] = None


class AgentOutputRequest(BaseModel):
    """Request model for fetching agent output"""
    agent_id: str
    mode: str = "most-recent"


@router.get("/agents")
async def get_agents(
    client: PhantomBusterClient = Depends(get_phantombuster_client)
) -> List[Dict]:
    """
    Get list of all your PhantomBuster agents (phantoms)
    """
    try:
        agents = client.get_agents()
        return agents
    except requests.exceptions.HTTPError as e:
        raise HTTPException(
            status_code=e.response.status_code if e.response else 500,
            detail=f"PhantomBuster API error: {str(e)}"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/agents/{agent_id}")
async def get_agent_status(
    agent_id: str,
    client: PhantomBusterClient = Depends(get_phantombuster_client)
) -> Dict:
    """
    Get status and details of a specific agent
    """
    try:
        status = client.get_agent_status(agent_id)
        return status
    except requests.exceptions.HTTPError as e:
        raise HTTPException(
            status_code=e.response.status_code if e.response else 500,
            detail=f"PhantomBuster API error: {str(e)}"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/agents/{agent_id}/output")
async def get_agent_output(
    agent_id: str,
    mode: str = "most-recent",
    client: PhantomBusterClient = Depends(get_phantombuster_client)
) -> Dict:
    """
    Get the output/results from a specific agent

    Args:
        agent_id: The ID of your agent/phantom
        mode: Either "most-recent" or "all"
    """
    try:
        output = client.get_agent_output(agent_id, mode)
        return output
    except requests.exceptions.HTTPError as e:
        raise HTTPException(
            status_code=e.response.status_code if e.response else 500,
            detail=f"PhantomBuster API error: {str(e)}"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/agents/launch")
async def launch_agent(
    request: LaunchAgentRequest,
    client: PhantomBusterClient = Depends(get_phantombuster_client)
) -> Dict:
    """
    Launch an agent to start scraping

    Args:
        request: Contains agent_id and optional argument parameters
    """
    try:
        result = client.launch_agent(request.agent_id, request.argument)
        return result
    except requests.exceptions.HTTPError as e:
        raise HTTPException(
            status_code=e.response.status_code if e.response else 500,
            detail=f"PhantomBuster API error: {str(e)}"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/containers")
async def get_containers(
    client: PhantomBusterClient = Depends(get_phantombuster_client)
) -> List[Dict]:
    """
    Get list of all result containers
    """
    try:
        containers = client.get_containers()
        return containers
    except requests.exceptions.HTTPError as e:
        raise HTTPException(
            status_code=e.response.status_code if e.response else 500,
            detail=f"PhantomBuster API error: {str(e)}"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/containers/{container_id}")
async def get_container_data(
    container_id: str,
    client: PhantomBusterClient = Depends(get_phantombuster_client)
) -> Dict:
    """
    Get metadata from a specific result container

    Args:
        container_id: The ID of the container
    """
    try:
        data = client.get_container_data(container_id)
        return data
    except requests.exceptions.HTTPError as e:
        raise HTTPException(
            status_code=e.response.status_code if e.response else 500,
            detail=f"PhantomBuster API error: {str(e)}"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/agents/{agent_id}/results")
async def get_agent_results(
    agent_id: str,
    client: PhantomBusterClient = Depends(get_phantombuster_client)
) -> Dict:
    """
    Get the result object (CSV/JSON URLs) from an agent

    Args:
        agent_id: The ID of your agent/phantom
    """
    try:
        results = client.get_agent_result_object(agent_id)
        return results
    except requests.exceptions.HTTPError as e:
        raise HTTPException(
            status_code=e.response.status_code if e.response else 500,
            detail=f"PhantomBuster API error: {str(e)}"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
