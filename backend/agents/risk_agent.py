# This file calculates the Risk Score 
# It fetches the Technical data from grapg state and calculates the risk score 

from agents.state import GraphState
from services.logger_service import logger


def risk_agent(state: GraphState):
    logger.info("Risk agent started")

    technical_data = state["technical_data"]

    risk_score = 0

    rsi = technical_data["rsi"]
    atr = technical_data["atr"]

    if rsi > 70 or rsi < 30:
        risk_score += 3

    if atr > 200:
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