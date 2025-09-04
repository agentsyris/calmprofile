import os
from datetime import datetime
from flask import Flask, request, jsonify, abort, render_template, send_from_directory
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from dotenv import load_dotenv
import json
from calm_profile_system import score_assessment, generate_summary

load_dotenv()
app = Flask(__name__)

# Configure CORS properly
CORS(app, resources={
    r"/api/*": {
        "origins": ["http://localhost:*", "http://127.0.0.1:*", "https://syris.systems"],
        "methods": ["GET", "POST", "OPTIONS"],
        "allow_headers": ["Content-Type"]
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
    __tablename__ = "assessments"
    id = db.Column(db.String(36), primary_key=True)
    email = db.Column(db.String(255), index=True)
    archetype = db.Column(db.String(32))
    scores = db.Column(db.JSON)
    raw_responses = db.Column(db.JSON)
    meta_data = db.Column(db.JSON)  # Changed from 'metadata' to 'meta_data'
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    report_sent = db.Column(db.Boolean, default=False)

with app.app_context():
    db.create_all()

# Serve the HTML file
@app.route('/')
def index():
    return send_from_directory('static', 'calm-profile.html')

@app.get("/api/health")
def health():
    return jsonify({"ok": True, "time": datetime.utcnow().isoformat()})

@app.post("/api/assess")
def create_assessment():
    """Process assessment responses and return profile results."""
    try:
        data = request.get_json(force=True)
        
        # Extract responses and metadata
        responses = data.get("responses", {})
        metadata = data.get("meta", {})
        email = data.get("email")
        
        # Format answers for scoring system
        answers = {}
        
        # Convert frontend format to scoring system format
        # Frontend sends index-based responses, we need q1-q20 format
        for i in range(20):
            if str(i) in responses:
                # Frontend sends the actual answer ('A' or 'B')
                answers[f"q{i+1}"] = responses[str(i)]
            elif i in responses:
                answers[f"q{i+1}"] = responses[i]
        
        # Add metadata
        answers["meta"] = metadata
        
        # Score the assessment
        profile = score_assessment(answers)
        
        # Generate summary
        summary_text = generate_summary(profile)
        
        # Prepare response
        result = {
            "success": True,
            "archetype": {
                "primary": profile.type_result.primary,
                "secondary": profile.type_result.secondary,
                "confidence": profile.type_result.confidence,
                "hybrid": profile.type_result.hybrid
            },
            "scores": {
                "structure": profile.scores.structure,
                "collaboration": profile.scores.collaboration,
                "scope": profile.scores.scope,
                "tempo": profile.scores.tempo,
                "overhead_index": profile.scores.overhead_index
            },
            "metrics": {
                "hours_lost_ppw": profile.scores.hours_ppw,
                "hours_team": profile.scores.hours_team,
                "annual_cost": profile.scores.annual_cost
            },
            "recommendations": {
                "strengths": CONTENT_LIBRARY["strengths"].get(profile.type_result.primary, []),
                "quick_wins": CONTENT_LIBRARY["quick_wins"].get(profile.type_result.primary, []),
                "tool_stack": CONTENT_LIBRARY["tool_stacks"].get(
                    metadata.get("platform", "microsoft"), {}
                ).get(profile.type_result.primary, [])
            },
            "summary": summary_text
        }
        
        # Save to database if email provided
        if email:
            from uuid import uuid4
            assessment_id = str(uuid4())
            
            assessment = Assessment(
                id=assessment_id,
                email=email,
                archetype=profile.type_result.primary,
                scores=result["scores"],
                raw_responses=responses,
                meta_data=metadata  # Changed from 'metadata' to 'meta_data'
            )
            db.session.add(assessment)
            db.session.commit()
            
            result["assessment_id"] = assessment_id
        
        return jsonify(result)
        
    except Exception as e:
        app.logger.error(f"Assessment error: {str(e)}")
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

# Import content library for recommendations
from calm_profile_system import CONTENT_LIBRARY

# Stripe integration (keeping existing code)
import stripe
stripe.api_key = os.environ.get("STRIPE_SECRET_KEY")

@app.post("/api/create-checkout")
def create_checkout():
    data = request.get_json(force=True)
    email = data.get("email")
    assessment_id = data.get("assessment_id")
    
    if not email:
        return jsonify({"error": "email required"}), 400

    if not assessment_id:
        from uuid import uuid4
        assessment_id = str(uuid4())

    success_url = os.getenv("CHECKOUT_SUCCESS_URL", "http://localhost:5000/thank-you?session_id={CHECKOUT_SESSION_ID}")
    cancel_url = os.getenv("CHECKOUT_CANCEL_URL", "http://localhost:5000/")

    try:
        session = stripe.checkout.Session.create(
            payment_method_types=["card"],
            mode="payment",
            customer_email=email,
            line_items=[{
                "price_data": {
                    "currency": "usd",
                    "product_data": {
                        "name": "calm.profile diagnostic report",
                        "description": "12-page operational assessment pdf + 30-min debrief"
                    },
                    "unit_amount": 49500
                },
                "quantity": 1
            }],
            success_url=success_url,
            cancel_url=cancel_url,
            metadata={"assessment_id": assessment_id, "email": email}
        )
        return jsonify({"checkout_url": session.url})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.getenv("PORT", "5000")), debug=True)