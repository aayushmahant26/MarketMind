# This file calculates the Risk Score 
# It fetches the Technical data from grapg state and calculates the risk score 

from agents.state import GraphState
from services.logger_service import logger


def risk_agent(state: GraphState):
    logger.info("Risk agent started")

    if state.get("skip_risk", False):
        logger.info("Skipping risk agent because skip_risk is True")
        state["risk_data"] = None
        return state

    if state.get("symbol") == "None" or not state.get("symbol"):
        logger.info("Skipping risk agent for out of-context query")
        state["risk_data"] = None
        return state

    technical_data = state.get("technical_data")
    if not technical_data:
        logger.info("Skipping risk agent: no technical data available")
        state["risk_data"] = None
        return state

    risk_score = 0

    rsi = technical_data.get("rsi")
    atr = technical_data.get("atr")

    if rsi is not None and (rsi > 70 or rsi < 30):
        risk_score += 3

    if atr is not None and atr > 200:
        risk_score += 3


    if risk_score >= 6:
        risk = "High"
    elif risk_score >= 3:
        risk = "Medium"
    else:
        risk = "Low"

    state["risk_data"] = {
        "risk_level": risk,
        "risk_score": risk_score
    }

    logger.info(
        f"Risk analysis completed | Risk={risk}, Score={risk_score}"
    )

    return state