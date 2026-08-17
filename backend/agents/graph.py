# This file is the main LangGraph workflow. It defines which agents exist, the order in which they execute, and how data flows between them.

from langgraph.graph import StateGraph, END # GraphState is used to create the wrokflow , END marks the end of workflow .

from agents.state import GraphState 
from agents.supervisor import supervisor_agent
from agents.market_agent import market_agent
from agents.technical_agent import technical_agent
from agents.news_agent import news_agent
from agents.risk_agent import risk_agent
from agents.report_agent import report_agent

workflow = StateGraph(GraphState)

# Creating nodes . Whenever the execution reaches a certain node , corresponding function executes.
workflow.add_node("supervisor", supervisor_agent)
workflow.add_node("market", market_agent)
workflow.add_node("technical", technical_agent)
workflow.add_node("news", news_agent)
workflow.add_node("risk", risk_agent)
workflow.add_node("report", report_agent)

# Setting entry point . It tells LangGraph to start execution from supervisor agent.
workflow.set_entry_point("supervisor")

# Adding edges
workflow.add_edge("supervisor", "market") # It tells that after supervisor agent is done executing , then start market agent execution.
workflow.add_edge("market", "technical") # It tells that after market agent is done executing , then start technical agent execution.

def route_after_technical(state):
    if state["skip_news"]:
        if state["skip_risk"]:
            return "report"
        return "risk"
    return "news"

# After technical agent is done executing , check the condition in route_after_technical() function and then decide which agent to execute next.
workflow.add_conditional_edges(
    "technical",
    route_after_technical
)

workflow.add_edge("news", "risk")
workflow.add_edge("risk", "report")
workflow.add_edge("report", END)

graph = workflow.compile() # Compiles the workflow into a runnable graph.

def run_marketmind(query, force_full=True, conversation_context=""):
    initial_state = {
        "query": query,
        "query_symbol": "",
        "symbol": "",
        "analysis_type": "",
        "force_full": force_full,
        "conversation_context": conversation_context,

        "market_data": None,
        "technical_data": None,
        "news_data": None,
        "risk_data": None,

        "skip_news": False,
        "skip_risk": False,

        "final_report": None
}

    result = graph.invoke(initial_state)
    return result