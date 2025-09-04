import os
from datetime import datetime
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from dotenv import load_dotenv
import json
from uuid import uuid4
import traceback

load_dotenv()
app = Flask(__name__)

# Configure CORS - allow all localhost origins for development
CORS(app, resources={
    r"/api/*": {
        "origins": ["http://localhost:*", "http://127.0.0.1:*", "http://localhost:3000", "http://localhost:5173"],
        "methods": ["GET", "POST", "OPTIONS"],
        "allow_headers": ["Content-Type"],
        "supports_credentials": True
    }
})

# Database configuration
db_url = os.getenv("DATABASE_URL", "sqlite:///calm_profile.db")
if db_url.startswith("postgres://"):
    db_url = db_url.replace("postgres://", "postgresql+psycopg2://", 1)

app.config["SQLALCHEMY_DATABASE_URI"] = db_url
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
db = SQLAlchemy(app)


class Assessment(db.Model):
    """Store assessment results for future reference."""
    __tablename__ = "assessments"
    
    id = db.Column(db.String(36), primary_key=True)
    email = db.Column(db.String(255), index=True)
    archetype_primary = db.Column(db.String(32))
    archetype_mix = db.Column(db.JSON)
    axis_scores = db.Column(db.JSON)
    overhead_index = db.Column(db.Float)
    hours_lost = db.Column(db.Float)
    annual_cost = db.Column(db.Float)
    raw_responses = db.Column(db.JSON)
    context_data = db.Column(db.JSON)  # Changed from metadata to context_data
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    report_sent = db.Column(db.Boolean, default=False)
    payment_status = db.Column(db.String(20), default="pending")


# Import the scoring system AFTER db is defined
from calm_profile_system import score_assessment, format_response

with app.app_context():
    db.create_all()


@app.route('/')
def index():
    """API info endpoint."""
    return jsonify({
        "name": "Calm Profile API",
        "version": "1.0",
        "endpoints": {
            "health": "/api/health",
            "assess": "/api/assess"
        }
    })


@app.get("/api/health")
def health():
    """Health check endpoint."""
    return jsonify({"status": "healthy", "timestamp": datetime.utcnow().isoformat()})


@app.post("/api/assess")
def assess():
    """Process assessment and return profile results."""
    try:
        # Get JSON data
        data = request.get_json(force=True)
        print(f"Received data keys: {data.keys()}")
        
        # Extract responses and context
        responses = data.get("responses", {})
        context = data.get("context", {})
        
        print(f"Responses: {responses}")
        print(f"Context: {context}")
        
        # Convert frontend format {0: "A", 1: "B"...} to backend format
        formatted_responses = {}
        for i in range(20):
            key = str(i)
            if key in responses:
                # Convert A/B to 1/0 for binary scoring
                formatted_responses[key] = 1 if responses[key] == "A" else 0
        
        print(f"Formatted responses: {formatted_responses}")
        
        # Score the assessment
        result = score_assessment(formatted_responses)
        
        # Extract context data with defaults
        team_size = context.get("teamSize", "solo")
        meeting_load = context.get("meetingLoad", "light")
        platform = context.get("platform", "google")
        
        # Calculate overhead index based on meeting load
        overhead_multipliers = {
            "light": 0.15,
            "moderate": 0.25,
            "heavy": 0.40,
            "extreme": 0.60
        }
        
        # Parse meeting load to get the key
        meeting_key = "light"
        if meeting_load:
            for key in overhead_multipliers:
                if key in meeting_load.lower():
                    meeting_key = key
                    break
        
        overhead_base = overhead_multipliers[meeting_key]
        
        # Adjust overhead based on archetype
        archetype_adjustments = {
            "architect": 0.9,
            "conductor": 0.85,
            "curator": 1.1,
            "craftsperson": 1.2
        }
        
        primary_archetype = result["archetype"]["primary"].lower()
        overhead_index = overhead_base * archetype_adjustments.get(primary_archetype, 1.0)
        
        # Calculate team size multiplier for cost
        team_multipliers = {
            "solo": 1,
            "2-5": 4,
            "6-15": 10,
            "16-50": 25,
            "50+": 55
        }
        
        # Parse team size
        team_multiplier = team_multipliers.get("solo", 1)
        if team_size:
            for key, value in team_multipliers.items():
                if key in str(team_size):
                    team_multiplier = value
                    break
        
        # Calculate metrics
        hours_lost_ppw = overhead_index * 40  # 40 hour work week
        annual_cost = hours_lost_ppw * 48 * 125 * team_multiplier  # 48 weeks, $125/hour
        
        # Generate assessment ID
        assessment_id = str(uuid4())
        
        # Store in database
        assessment = Assessment(
            id=assessment_id,
            archetype_primary=result["archetype"]["primary"],
            archetype_mix=result["archetype"]["mix"],
            axis_scores=result["scores"]["axes"],
            overhead_index=overhead_index,
            hours_lost=hours_lost_ppw,
            annual_cost=annual_cost,
            raw_responses=responses,
            context_data={  # Changed from metadata to context_data
                "team_size": team_size,
                "meeting_load": meeting_load,
                "platform": platform
            }
        )
        
        db.session.add(assessment)
        db.session.commit()
        
        # Build response
        response_data = {
            "success": True,
            "assessment_id": assessment_id,
            "archetype": result["archetype"],
            "scores": {
                **result["scores"]["axes"],
                "overhead_index": round(overhead_index * 100)
            },
            "metrics": {
                "hours_lost_ppw": round(hours_lost_ppw, 1),
                "annual_cost": round(annual_cost)
            },
            "recommendations": result["recommendations"],
            "tagline": result["archetype"].get("tagline", "")
        }
        
        print(f"Sending response: {response_data}")
        return jsonify(response_data)
        
    except Exception as e:
        print(f"Error in assess endpoint: {str(e)}")
        print(traceback.format_exc())
        return jsonify({
            "success": False,
            "error": str(e),
            "details": traceback.format_exc()
        }), 500


@app.post("/api/create-checkout")
def create_checkout():
    """Create Stripe checkout session or mock for testing."""
    try:
        data = request.get_json(force=True)
        email = data.get("email")
        assessment_id = data.get("assessment_id")
        
        # For development - return mock checkout URL
        # Remove this block and uncomment Stripe code for production
        return jsonify({
            "success": True,
            "checkout_url": f"http://localhost:3000/thank-you?session_id=mock_{assessment_id}"
        })
        
        # Production Stripe code (uncomment when ready):
        """
        import stripe
        stripe.api_key = os.getenv("STRIPE_SECRET_KEY")
        
        if not stripe.api_key:
            return jsonify({"error": "Stripe not configured"}), 500
        
        # Update assessment with email
        assessment = Assessment.query.get(assessment_id)
        if assessment:
            assessment.email = email
            db.session.commit()
        
        # Create Stripe checkout session
        session = stripe.checkout.Session.create(
            payment_method_types=['card'],
            line_items=[{
                'price_data': {
                    'currency': 'usd',
                    'product_data': {
                        'name': 'Calm Profile Assessment Report',
                        'description': 'Comprehensive workstyle analysis and recommendations'
                    },
                    'unit_amount': 49500,  # $495.00
                },
                'quantity': 1,
            }],
            mode='payment',
            success_url=f'http://localhost:3000/thank-you?session_id={{CHECKOUT_SESSION_ID}}',
            cancel_url='http://localhost:3000/assessment',
            customer_email=email,
            metadata={
                'assessment_id': assessment_id
            }
        )
        
        return jsonify({
            "success": True,
            "checkout_url": session.url
        })
        """
        
    except Exception as e:
        print(f"Checkout error: {str(e)}")
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    port = int(os.getenv("PORT", 5000))
    debug_mode = os.getenv("FLASK_ENV", "development") == "development"
    app.run(debug=debug_mode, host="0.0.0.0", port=port)