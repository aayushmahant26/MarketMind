# This file defines the shared state (memory) that all LangGraph agents use to exchange data while the workflow is running.
# It specifies what information (query, market data, technical data, news, risk, final report, etc.) is available for agents to read and update throughout the graph execution.

from typing import TypedDict, Optional


class GraphState(TypedDict):
    query: str # What user asked

    query_symbol: str # Resolved/cleaned symbol (e.g., 'NIFTY' -> '^NSEI')
    symbol: str # Raw symbol from query

    market_data: Optional[dict] # Data from market_agent
    technical_data: Optional[dict] # Data from technical_agent
    news_data: Optional[dict] # Data from news_agent
    risk_data: Optional[dict] # Data from risk_agent

    skip_news: bool # Flag to skip news_agent
    skip_risk: bool # Flag to skip risk_agent
    force_full: bool # Toggle: True (always run all), False (skip nodes)

    analysis_type: str
    conversation_context: Optional[str] # Appends the past 5 chat messages for context

    final_report: Optional[str] # What the report_agent generates