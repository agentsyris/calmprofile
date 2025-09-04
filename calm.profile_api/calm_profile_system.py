"""
Calm Profile System
====================

This module implements the internal logic for the *calm.profile* assessment. The
functions defined here can be used to score user responses to the questionnaire,
determine a primary archetype (Architect, Conductor, Curator or Craftsperson),
calculate friction metrics, estimate hours lost to overhead, and assemble a
structured data model that can be consumed by a report generator.

The system uses binary choice questions (A/B) with scores of +1 or -1 for each
response. Questions are grouped into four axes (structure, collaboration, scope,
tempo) with 5 questions each.

Usage example::

    from calm_profile_system import score_assessment, generate_summary

    # Binary responses: 'A' or 'B' for each question (q1-q20)
    answers = {
        "q1": "A", "q2": "B", "q3": "A", "q4": "A", "q5": "B",
        "q6": "A", "q7": "B", "q8": "B", "q9": "A", "q10": "A",
        "q11": "B", "q12": "B", "q13": "A", "q14": "A", "q15": "B",
        "q16": "A", "q17": "B", "q18": "A", "q19": "B", "q20": "A",
        "meta": {"team_size": "6-15", "meetings": "7-10", "platform": "microsoft"},
    }

    profile = score_assessment(answers)
    print(generate_summary(profile))

"""

from dataclasses import dataclass, field
from typing import Dict, List, Optional, Tuple, Any
import math

# -----------------------------------------------------------------------------
# Constants
# -----------------------------------------------------------------------------

# Question mapping to axes - each axis has 5 questions
# Structure orientation (rigid vs flexible processes)
STRUCTURE_QUESTIONS = ["q1", "q2", "q3", "q4", "q5"]
# Collaboration orientation (synchronous vs asynchronous)
COLLABORATION_QUESTIONS = ["q6", "q7", "q8", "q9", "q10"]
# Scope focus (big picture vs detail-oriented)
SCOPE_QUESTIONS = ["q11", "q12", "q13", "q14", "q15"]
# Tempo preference (fast-paced vs methodical)
TEMPO_QUESTIONS = ["q16", "q17", "q18", "q19", "q20"]

# Binary scoring: A = +1, B = -1 for all questions
BINARY_SCORES = {"A": 1, "B": -1}

# Archetype centroids for axes (structure, collaboration, scope, tempo)
# Scores are on 0-100 scale
CENTROIDS = {
    "architect": {"structure": 85, "collaboration": 35, "scope": 70, "tempo": 40},
    "curator": {"structure": 35, "collaboration": 45, "scope": 85, "tempo": 55},
    "conductor": {"structure": 65, "collaboration": 85, "scope": 60, "tempo": 85},
    "craftsperson": {"structure": 80, "collaboration": 20, "scope": 25, "tempo": 35},
}

# Weights for computing weighted distance to centroids
AXIS_WEIGHTS = {"structure": 0.45, "collaboration": 0.35, "scope": 0.10, "tempo": 0.10}

# Team size anchors for estimating team hours lost
TEAM_ANCHOR = {
    "solo": 1,
    "2-5": 4,
    "6-15": 10,
    "16-50": 30,
    "50+": 60,
}

# Content library for archetypes
CONTENT_LIBRARY = {
    "strengths": {
        "architect": [
            "exceptional process architecture and system design",
            "predictive risk mitigation and contingency planning",
            "comprehensive documentation and knowledge management"
        ],
        "conductor": [
            "multi-stakeholder alignment and consensus building",
            "real-time facilitation and conflict resolution",
            "cross-functional coordination and resource optimization"
        ],
        "curator": [
            "balanced approach to structure and flexibility",
            "strong collaborative instincts with practical execution",
            "adaptive methodology that scales with context"
        ],
        "craftsperson": [
            "uncompromising attention to quality and detail",
            "deep technical expertise and domain mastery",
            "consistent delivery of exceptional outputs"
        ],
    },
    "blind_spots": {
        "architect": ["rigidity under pressure", "excessive setup time", "over-documenting"],
        "conductor": ["meeting bloat", "decision paralysis", "context switching overload"],
        "curator": ["scope creep", "tool proliferation", "incomplete deliverables"],
        "craftsperson": ["perfectionism delays", "isolation risk", "throughput bottlenecks"],
    },
    "quick_wins": {
        "architect": [
            "Create a central SOP library covering 80% of recurring processes",
            "Implement change control gates with approval workflows",
            "Institute weekly operational reviews with metrics"
        ],
        "conductor": [
            "Implement 25-minute timeboxed synchronous standups",
            "Establish meeting-free focus blocks (Wednesdays)",
            "Transition status updates to async video briefings"
        ],
        "curator": [
            "Implement flexible frameworks with clear boundaries",
            "Create collaborative spaces with defined outcomes",
            "Establish rhythm of structured and unstructured time"
        ],
        "craftsperson": [
            "Block daily 90-minute deep work sessions",
            "Define explicit 'done' criteria for all deliverables",
            "Implement work-in-progress limits (max 3)"
        ],
    },
    "tool_stacks": {
        "microsoft": {
            "architect": ["Notion", "Azure Boards", "Power Automate", "SharePoint"],
            "conductor": ["Teams", "Planner", "Loop Workspaces", "Outlook"],
            "curator": ["Planner", "Teams", "OneNote", "Miro"],
            "craftsperson": ["Linear", "OneDrive", "Focus Assist", "Teams"],
        },
        "google": {
            "architect": ["Notion", "Sheets Automation", "Zapier", "Drive"],
            "conductor": ["Meet", "Asana", "Collaborative Docs", "Calendar"],
            "curator": ["Trello", "Meet", "Keep", "Miro"],
            "craftsperson": ["Linear", "Drive", "Calendar Blocking", "Docs"],
        },
        "slack": {
            "architect": ["Notion", "Linear", "Workflow Builder", "Slack Canvas"],
            "conductor": ["Huddles", "Asana", "Loom", "Slack Canvas"],
            "curator": ["Trello", "Slack Canvas", "Zoom", "Miro"],
            "craftsperson": ["Linear", "GitHub", "Do Not Disturb", "Slack Canvas"],
        },
        "other": {
            "architect": ["Notion", "Jira", "Custom Middleware", "Confluence"],
            "conductor": ["Zoom", "Monday", "Mural", "Asana"],
            "curator": ["Monday", "Miro", "Confluence", "Figma"],
            "craftsperson": ["Linear", "Git", "Productivity Apps", "Documentation"],
        },
    },
}

# -----------------------------------------------------------------------------
# Data classes
# -----------------------------------------------------------------------------

@dataclass
class Scores:
    """Container for axis scores, overhead index and quantitative metrics."""
    structure: float
    collaboration: float
    scope: float
    tempo: float
    overhead_index: float
    hours_ppw: float
    hours_team: float
    annual_cost: float


@dataclass
class TypeResult:
    """Classification result for primary and secondary archetypes."""
    primary: str
    secondary: str
    margin: float
    confidence: str  # 'high', 'medium', or 'low'
    hybrid: Optional[str]


@dataclass
class Profile:
    """Complete assessment profile combining scores and archetype classification."""
    scores: Scores
    type_result: TypeResult
    team_size: str
    meetings_band: str
    platform: str


# -----------------------------------------------------------------------------
# Core functions
# -----------------------------------------------------------------------------

def _compute_axis_scores(answers: Dict[str, str]) -> Dict[str, float]:
    """Compute 0-100 axis scores from binary responses.
    
    Args:
        answers: Dictionary with keys q1-q20 and values 'A' or 'B'
    
    Returns:
        Dictionary mapping axis names to scores (0-100)
    """
    axes = {
        "structure": STRUCTURE_QUESTIONS,
        "collaboration": COLLABORATION_QUESTIONS,
        "scope": SCOPE_QUESTIONS,
        "tempo": TEMPO_QUESTIONS,
    }
    
    scores = {}
    for axis, questions in axes.items():
        raw_score = 0
        for q in questions:
            response = answers.get(q)
            if response not in ['A', 'B']:
                # Handle numeric scores if passed directly
                if isinstance(response, (int, float)):
                    raw_score += response
                else:
                    raise ValueError(f"Invalid response for {q}: {response}")
            else:
                raw_score += BINARY_SCORES[response]
        
        # Raw score range: -5 to +5 (5 questions, each ±1)
        # Convert to 0-100 scale
        normalized = ((raw_score + 5) / 10.0) * 100.0
        scores[axis] = round(normalized, 1)
    
    return scores


def _compute_overhead_index(answers: Dict[str, str], axis_scores: Dict[str, float]) -> float:
    """Calculate overhead index based on extremeness of scores.
    
    The overhead index estimates operational friction based on how far
    the user's scores deviate from balanced (50) on each axis.
    
    Args:
        answers: Raw question responses (for future friction-specific questions)
        axis_scores: Normalized axis scores (0-100)
    
    Returns:
        Overhead index (0-100)
    """
    # Calculate variance from center (50) for each axis
    variance_sum = 0
    for score in axis_scores.values():
        variance_sum += abs(score - 50)
    
    # Average variance across 4 axes
    avg_variance = variance_sum / 4
    
    # Scale to overhead index (higher variance = higher overhead)
    overhead_index = 50 + (avg_variance * 0.8)
    
    return round(min(100, overhead_index), 1)


def _compute_metrics(overhead_index: float, team_size: str, meetings_band: str) -> Tuple[float, float, float]:
    """Calculate productivity metrics from overhead index and metadata.
    
    Args:
        overhead_index: Overall overhead score (0-100)
        team_size: Team size category
        meetings_band: Weekly meeting load category
    
    Returns:
        Tuple of (hours_per_person_weekly, team_hours_weekly, annual_cost)
    """
    # Hours lost per person per week (max ~6 hours at 100% overhead)
    hours_ppw = round(6.0 * (overhead_index / 100.0), 1)
    
    # Team hours lost
    team_multiplier = TEAM_ANCHOR.get(team_size, 4)
    hours_team = round(hours_ppw * team_multiplier, 1)
    
    # Annual cost estimate (assuming $125/hour, 52 weeks)
    annual_cost = round(hours_team * 52 * 125, 0)
    
    return hours_ppw, hours_team, annual_cost


def _classify_archetype(axis_scores: Dict[str, float]) -> TypeResult:
    """Determine primary and secondary archetype based on axis scores.
    
    Uses weighted Euclidean distance to archetype centroids.
    
    Args:
        axis_scores: Dictionary of normalized axis scores (0-100)
    
    Returns:
        TypeResult with primary/secondary archetypes and confidence
    """
    distances = {}
    
    for archetype, centroid in CENTROIDS.items():
        weighted_distance = 0
        for axis, weight in AXIS_WEIGHTS.items():
            diff = abs(axis_scores[axis] - centroid[axis]) / 100.0
            weighted_distance += weight * diff ** 2
        distances[archetype] = math.sqrt(weighted_distance)
    
    # Sort by distance (closest first)
    sorted_archetypes = sorted(distances.items(), key=lambda x: x[1])
    primary = sorted_archetypes[0][0]
    secondary = sorted_archetypes[1][0]
    
    # Calculate margin and confidence
    margin = sorted_archetypes[1][1] - sorted_archetypes[0][1]
    
    if margin >= 0.15:
        confidence = "high"
        hybrid = None
    elif margin >= 0.07:
        confidence = "medium"
        hybrid = None
    else:
        confidence = "low"
        hybrid = f"{primary}-{secondary}"
    
    return TypeResult(
        primary=primary,
        secondary=secondary,
        margin=round(margin, 3),
        confidence=confidence,
        hybrid=hybrid
    )


def score_assessment(answers: Dict[str, Any]) -> Profile:
    """Main function to score an assessment and return a complete profile.
    
    Args:
        answers: Dictionary containing:
            - q1 through q20: Binary responses ('A' or 'B')
            - meta: Dictionary with team_size, meetings, and platform
    
    Returns:
        Complete Profile object with scores, archetype, and metadata
    """
    # Extract metadata
    meta = answers.get("meta", {})
    team_size = meta.get("team_size", "2-5")
    meetings_band = meta.get("meetings", "7-10")
    platform = meta.get("platform", "microsoft").lower()
    
    # Calculate axis scores
    axis_scores = _compute_axis_scores(answers)
    
    # Calculate overhead index
    overhead_index = _compute_overhead_index(answers, axis_scores)
    
    # Calculate productivity metrics
    hours_ppw, hours_team, annual_cost = _compute_metrics(
        overhead_index, team_size, meetings_band
    )
    
    # Determine archetype
    type_result = _classify_archetype(axis_scores)
    
    # Build scores object
    scores = Scores(
        structure=axis_scores["structure"],
        collaboration=axis_scores["collaboration"],
        scope=axis_scores["scope"],
        tempo=axis_scores["tempo"],
        overhead_index=overhead_index,
        hours_ppw=hours_ppw,
        hours_team=hours_team,
        annual_cost=annual_cost
    )
    
    return Profile(
        scores=scores,
        type_result=type_result,
        team_size=team_size,
        meetings_band=meetings_band,
        platform=platform
    )


def generate_summary(profile: Profile) -> str:
    """Generate a human-readable summary of the assessment results.
    
    Args:
        profile: Complete Profile object from score_assessment()
    
    Returns:
        Formatted text summary of results and recommendations
    """
    archetype = profile.type_result.primary
    lines = []
    
    # Header
    lines.append(f"Archetype: {archetype.capitalize()}")
    if profile.type_result.hybrid:
        lines.append(f"Hybrid Profile: {profile.type_result.hybrid}")
    lines.append("")
    
    # Confidence
    if profile.type_result.confidence == "low":
        lines.append(f"Note: You show characteristics of both {profile.type_result.primary} "
                    f"and {profile.type_result.secondary} archetypes.")
        lines.append("")
    
    # Scores
    lines.append("**Axis Scores (0-100):**")
    lines.append(f"- Structure: {profile.scores.structure}")
    lines.append(f"- Collaboration: {profile.scores.collaboration}")
    lines.append(f"- Scope: {profile.scores.scope}")
    lines.append(f"- Tempo: {profile.scores.tempo}")
    lines.append("")
    
    # Metrics
    lines.append("**Productivity Metrics:**")
    lines.append(f"- Overhead Index: {profile.scores.overhead_index}%")
    lines.append(f"- Hours lost per person weekly: {profile.scores.hours_ppw}h")
    lines.append(f"- Team hours lost weekly: {profile.scores.hours_team}h")
    lines.append(f"- Estimated annual cost: ${profile.scores.annual_cost:,.0f}")
    lines.append("")
    
    # Strengths
    strengths = CONTENT_LIBRARY["strengths"].get(archetype, [])
    if strengths:
        lines.append("**Core Strengths:**")
        for strength in strengths:
            lines.append(f"- {strength}")
        lines.append("")
    
    # Blind spots
    blind_spots = CONTENT_LIBRARY["blind_spots"].get(archetype, [])
    if blind_spots:
        lines.append("**Watch Out For:**")
        for blind_spot in blind_spots:
            lines.append(f"- {blind_spot}")
        lines.append("")
    
    # Quick wins
    quick_wins = CONTENT_LIBRARY["quick_wins"].get(archetype, [])
    if quick_wins:
        lines.append("**Immediate Actions:**")
        for win in quick_wins:
            lines.append(f"- {win}")
        lines.append("")
    
    # Tool stack
    tools = CONTENT_LIBRARY["tool_stacks"].get(profile.platform, {}).get(archetype, [])
    if tools:
        lines.append("**Recommended Tools:**")
        lines.append(", ".join(tools))
        lines.append("")
    
    return "\n".join(lines)


__all__ = [
    "score_assessment",
    "generate_summary",
    "Scores",
    "TypeResult",
    "Profile",
]