"""
Calm Profile Scoring System
Binary A/B responses mapped to behavioral axes and archetypes
"""

from typing import Dict, Any, List, Optional
from dataclasses import dataclass
import math


# Question to axis mapping
AXIS_QUESTIONS = {
    "structure": [0, 1, 2, 4, 8],      # Organization and planning preference
    "collaboration": [3, 5, 7, 11, 13], # Solo vs team orientation  
    "scope": [6, 9, 10, 14, 16],        # Big picture vs detail focus
    "tempo": [12, 15, 17, 18, 19]       # Pace and deadline preference
}

# Archetype definitions with axis target values (0-100 scale)
ARCHETYPES = {
    "architect": {
        "name": "Architect",
        "axes": {
            "structure": 85,
            "collaboration": 30,
            "scope": 80,
            "tempo": 40
        },
        "tagline": "systematic builders of scalable foundations",
        "strengths": [
            "Framework design",
            "Process optimization",
            "Long-term planning",
            "System integration"
        ],
        "quick_wins": [
            "Implement project templates",
            "Create workflow documentation",
            "Set up automation tools"
        ]
    },
    "conductor": {
        "name": "Conductor",
        "axes": {
            "structure": 70,
            "collaboration": 85,
            "scope": 75,
            "tempo": 60
        },
        "tagline": "orchestrators of collaborative excellence",
        "strengths": [
            "Team coordination",
            "Meeting facilitation",
            "Stakeholder alignment",
            "Resource orchestration"
        ],
        "quick_wins": [
            "Establish daily standups",
            "Create team dashboards",
            "Implement feedback loops"
        ]
    },
    "curator": {
        "name": "Curator",
        "axes": {
            "structure": 40,
            "collaboration": 75,
            "scope": 30,
            "tempo": 45
        },
        "tagline": "quality guardians and creative refiners",
        "strengths": [
            "Quality assurance",
            "Detail orientation",
            "Creative curation",
            "Standard maintenance"
        ],
        "quick_wins": [
            "Develop review checklists",
            "Create style guides",
            "Set up quality gates"
        ]
    },
    "craftsperson": {
        "name": "Craftsperson",
        "axes": {
            "structure": 25,
            "collaboration": 20,
            "scope": 40,
            "tempo": 80
        },
        "tagline": "deep-work specialists and makers",
        "strengths": [
            "Deep focus work",
            "Technical execution",
            "Problem solving",
            "Rapid prototyping"
        ],
        "quick_wins": [
            "Block focus time",
            "Minimize meetings",
            "Set up maker schedule"
        ]
    }
}

# Tool stack recommendations by platform
TOOL_STACKS = {
    "microsoft": {
        "architect": ["Microsoft 365", "Planner", "SharePoint", "Power Automate"],
        "conductor": ["Teams", "Planner", "Loop", "Outlook"],
        "curator": ["Planner", "Teams", "OneNote", "Whiteboard"],
        "craftsperson": ["To Do", "OneDrive", "Focus Assist", "Teams Status"]
    },
    "google": {
        "architect": ["Workspace", "Sheets Scripts", "Sites", "AppSheet"],
        "conductor": ["Meet", "Calendar", "Groups", "Chat"],
        "curator": ["Keep", "Drive", "Jamboard", "Forms"],
        "craftsperson": ["Docs", "Drive", "Calendar", "Focus Mode"]
    },
    "slack": {
        "architect": ["Workflow Builder", "Canvas", "Lists", "Integrations"],
        "conductor": ["Huddles", "Channels", "Canvas", "Status"],
        "curator": ["Canvas", "Bookmarks", "Threads", "Shared Channels"],
        "craftsperson": ["DND Mode", "Saved Items", "Direct Messages", "Reminders"]
    },
    "other": {
        "architect": ["Notion", "Zapier", "Airtable", "Monday"],
        "conductor": ["Zoom", "Miro", "Asana", "Loom"],
        "curator": ["Figma", "Dropbox", "Trello", "Basecamp"],
        "craftsperson": ["Linear", "GitHub", "Bear", "RescueTime"]
    }
}


def calculate_axis_scores(responses: Dict[str, int]) -> Dict[str, float]:
    """
    Calculate axis scores from binary responses.
    
    Args:
        responses: Dict with keys "0"-"19" and values 0 or 1
                  where 1 = A response (high on axis) and 0 = B response (low on axis)
    
    Returns:
        Dict with axis names and scores 0-100
    """
    axis_scores = {}
    
    for axis_name, question_indices in AXIS_QUESTIONS.items():
        score_sum = 0
        count = 0
        
        for idx in question_indices:
            key = str(idx)
            if key in responses:
                score_sum += responses[key]
                count += 1
        
        # Calculate average and convert to 0-100 scale
        if count > 0:
            axis_scores[axis_name] = (score_sum / count) * 100
        else:
            axis_scores[axis_name] = 50  # Default to middle if no responses
    
    return axis_scores


def calculate_archetype_match(axis_scores: Dict[str, float]) -> Dict[str, float]:
    """
    Calculate match percentage for each archetype using Euclidean distance.
    """
    matches = {}
    
    for archetype_key, archetype_data in ARCHETYPES.items():
        # Calculate Euclidean distance
        distance = 0
        for axis, target_value in archetype_data["axes"].items():
            if axis in axis_scores:
                distance += (axis_scores[axis] - target_value) ** 2
        
        distance = math.sqrt(distance)
        
        # Convert distance to similarity percentage (inverse relationship)
        # Max theoretical distance is ~173 (sqrt of 4 * 100^2)
        max_distance = 173.2
        similarity = max(0, 100 - (distance / max_distance * 100))
        matches[archetype_key] = similarity
    
    return matches


def determine_archetype_mix(matches: Dict[str, float]) -> Dict[str, int]:
    """
    Convert match scores to percentage mix ensuring they sum to 100.
    """
    total = sum(matches.values())
    
    if total == 0:
        # Equal distribution if no matches
        return {k: 25 for k in matches.keys()}
    
    # Calculate percentages
    mix = {}
    allocated = 0
    
    for archetype, score in matches.items():
        percentage = round((score / total) * 100)
        mix[archetype] = percentage
        allocated += percentage
    
    # Adjust for rounding errors
    if allocated != 100:
        primary = max(mix.keys(), key=lambda k: matches[k])
        mix[primary] += (100 - allocated)
    
    return mix


def score_assessment(responses: Dict[str, int]) -> Dict[str, Any]:
    """
    Main scoring function that processes responses and returns full profile.
    
    Args:
        responses: Dict with keys "0"-"19" and values 0 or 1
    
    Returns:
        Complete assessment profile with archetype, scores, and recommendations
    """
    # Calculate axis scores
    axis_scores = calculate_axis_scores(responses)
    
    # Calculate archetype matches
    matches = calculate_archetype_match(axis_scores)
    
    # Determine primary archetype
    primary_archetype = max(matches.keys(), key=lambda k: matches[k])
    
    # Calculate archetype mix
    archetype_mix = determine_archetype_mix(matches)
    
    # Get archetype data
    archetype_data = ARCHETYPES[primary_archetype]
    
    # Build result
    result = {
        "archetype": {
            "primary": archetype_data["name"],
            "mix": archetype_mix,
            "tagline": archetype_data["tagline"]
        },
        "scores": {
            "axes": axis_scores,
            "matches": matches
        },
        "recommendations": {
            "strengths": archetype_data["strengths"],
            "quick_wins": archetype_data["quick_wins"],
            "tool_stack": []  # Will be filled based on platform
        }
    }
    
    return result


def format_response(result: Dict[str, Any], platform: str = "google") -> Dict[str, Any]:
    """
    Format the assessment result with platform-specific recommendations.
    
    Args:
        result: Raw assessment result
        platform: User's primary platform
    
    Returns:
        Formatted result with tool recommendations
    """
    # Get primary archetype key
    primary_name = result["archetype"]["primary"]
    primary_key = primary_name.lower()
    
    # Add tool stack based on platform
    if platform in TOOL_STACKS:
        if primary_key in TOOL_STACKS[platform]:
            result["recommendations"]["tool_stack"] = TOOL_STACKS[platform][primary_key]
    else:
        # Default to 'other' platform
        if primary_key in TOOL_STACKS["other"]:
            result["recommendations"]["tool_stack"] = TOOL_STACKS["other"][primary_key]
    
    return result


# For testing
if __name__ == "__main__":
    # Test with sample responses (all A's)
    test_responses = {str(i): 1 for i in range(20)}
    result = score_assessment(test_responses)
    formatted = format_response(result, "google")
    
    import json
    print(json.dumps(formatted, indent=2))
