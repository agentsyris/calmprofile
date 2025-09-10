#!/usr/bin/env python3
"""
generate sample diagnostic report pdf from assessment data
"""

import json
import os
import sys
from datetime import datetime
from pathlib import Path
import weasyprint
from jinja2 import Template


def load_assessment_data(json_path):
    """load assessment data from json file"""
    try:
        with open(json_path, "r") as f:
            data = json.load(f)
        return data
    except Exception as e:
        print(f"error loading assessment data: {e}")
        return None


def generate_pdf_report(assessment_data, output_path):
    """generate pdf report from assessment data"""

    # template html
    html_template = """
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>calm.profile diagnostic report</title>
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
            
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            
            body {
                font-family: 'Inter', sans-serif;
                line-height: 1.6;
                color: #0a0a0a;
                background: #ffffff;
                font-size: 14px;
            }
            
            .container {
                max-width: 800px;
                margin: 0 auto;
                padding: 40px 20px;
            }
            
            .header {
                text-align: center;
                margin-bottom: 40px;
                border-bottom: 2px solid #00c9a7;
                padding-bottom: 20px;
            }
            
            .logo {
                font-family: 'JetBrains Mono', monospace;
                font-size: 24px;
                font-weight: 500;
                color: #0a0a0a;
                margin-bottom: 10px;
            }
            
            .logo .dot {
                color: #00c9a7;
            }
            
            .tagline {
                font-size: 12px;
                color: #666666;
                text-transform: lowercase;
            }
            
            .report-title {
                font-size: 28px;
                font-weight: 600;
                color: #0a0a0a;
                margin: 30px 0 10px 0;
                text-transform: lowercase;
            }
            
            .report-subtitle {
                font-size: 16px;
                color: #666666;
                margin-bottom: 40px;
            }
            
            .section {
                margin-bottom: 40px;
            }
            
            .section-title {
                font-size: 20px;
                font-weight: 600;
                color: #0a0a0a;
                margin-bottom: 20px;
                text-transform: lowercase;
                border-left: 4px solid #00c9a7;
                padding-left: 15px;
            }
            
            .archetype-card {
                background: #f8f9fa;
                border: 1px solid #e9ecef;
                border-radius: 8px;
                padding: 20px;
                margin-bottom: 20px;
            }
            
            .archetype-name {
                font-size: 18px;
                font-weight: 600;
                color: #00c9a7;
                margin-bottom: 10px;
            }
            
            .archetype-tagline {
                font-size: 14px;
                color: #666666;
                font-style: italic;
                margin-bottom: 15px;
            }
            
            .confidence-bar {
                background: #e9ecef;
                height: 8px;
                border-radius: 4px;
                overflow: hidden;
                margin-bottom: 10px;
            }
            
            .confidence-fill {
                background: #00c9a7;
                height: 100%;
                width: {{ assessment_data.archetype.confidence }}%;
                transition: width 0.3s ease;
            }
            
            .confidence-text {
                font-size: 12px;
                color: #666666;
                text-align: right;
            }
            
            .metrics-grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 20px;
                margin-bottom: 20px;
            }
            
            .metric-card {
                background: #ffffff;
                border: 1px solid #e9ecef;
                border-radius: 6px;
                padding: 15px;
                text-align: center;
            }
            
            .metric-value {
                font-size: 24px;
                font-weight: 600;
                color: #00c9a7;
                margin-bottom: 5px;
            }
            
            .metric-label {
                font-size: 12px;
                color: #666666;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }
            
            .recommendations {
                background: #f8f9fa;
                border-radius: 8px;
                padding: 20px;
            }
            
            .recommendation-item {
                margin-bottom: 15px;
                padding-left: 20px;
                position: relative;
            }
            
            .recommendation-item::before {
                content: "→";
                position: absolute;
                left: 0;
                color: #00c9a7;
                font-weight: bold;
            }
            
            .strengths-list {
                list-style: none;
            }
            
            .strengths-list li {
                margin-bottom: 8px;
                padding-left: 20px;
                position: relative;
            }
            
            .strengths-list li::before {
                content: "✓";
                position: absolute;
                left: 0;
                color: #00c9a7;
                font-weight: bold;
            }
            
            .footer {
                margin-top: 60px;
                padding-top: 20px;
                border-top: 1px solid #e9ecef;
                text-align: center;
                font-size: 12px;
                color: #666666;
            }
            
            .footer .logo {
                font-size: 16px;
                margin-bottom: 5px;
            }
            
            @media print {
                body { margin: 0; }
                .container { padding: 20px; }
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="logo">syrıs<span class="dot">.</span></div>
                <div class="tagline">calm in the chaos of creative work</div>
            </div>
            
            <h1 class="report-title">calm.profile diagnostic report</h1>
            <p class="report-subtitle">behavioral archetype analysis & productivity assessment</p>
            
            <div class="section">
                <h2 class="section-title">archetype analysis</h2>
                <div class="archetype-card">
                    <div class="archetype-name">{{ assessment_data.archetype.primary.title() }}</div>
                    <div class="archetype-tagline">{{ assessment_data.archetype.tagline }}</div>
                    <div class="confidence-bar">
                        <div class="confidence-fill"></div>
                    </div>
                    <div class="confidence-text">{{ assessment_data.archetype.confidence }}% confidence</div>
                </div>
            </div>
            
            <div class="section">
                <h2 class="section-title">productivity metrics</h2>
                <div class="metrics-grid">
                    <div class="metric-card">
                        <div class="metric-value">{{ assessment_data.metrics.hours_lost_ppw }}</div>
                        <div class="metric-label">hours lost per week</div>
                    </div>
                    <div class="metric-card">
                        <div class="metric-value">${{ "{:,}".format(assessment_data.metrics.annual_cost) }}</div>
                        <div class="metric-label">annual productivity cost</div>
                    </div>
                </div>
            </div>
            
            <div class="section">
                <h2 class="section-title">recommendations</h2>
                <div class="recommendations">
                    <h3 style="margin-bottom: 15px; color: #0a0a0a;">quick wins</h3>
                    {% for rec in assessment_data.recommendations.quick_wins %}
                    <div class="recommendation-item">{{ rec }}</div>
                    {% endfor %}
                    
                    <h3 style="margin-bottom: 15px; color: #0a0a0a; margin-top: 25px;">strengths to leverage</h3>
                    <ul class="strengths-list">
                        {% for strength in assessment_data.recommendations.strengths %}
                        <li>{{ strength }}</li>
                        {% endfor %}
                    </ul>
                </div>
            </div>
            
            <div class="footer">
                <div class="logo">syrıs<span class="dot">.</span></div>
                <div>generated on {{ current_date }}</div>
                <div>assessment id: {{ assessment_data.assessment_id }}</div>
            </div>
        </div>
    </body>
    </html>
    """

    try:
        # render template
        template = Template(html_template)
        current_date = datetime.now().strftime("%b %d, %Y at %I:%M %p")
        html_content = template.render(
            assessment_data=assessment_data, current_date=current_date
        )

        # generate pdf
        pdf_bytes = weasyprint.HTML(string=html_content).write_pdf()

        # save to file
        with open(output_path, "wb") as f:
            f.write(pdf_bytes)

        print(f"pdf generated successfully: {output_path}")
        return True

    except Exception as e:
        print(f"pdf generation failed: {e}")
        return False


def main():
    """main function"""
    if len(sys.argv) != 2:
        print("usage: python generate_sample_report.py <assessment_json_path>")
        sys.exit(1)

    json_path = sys.argv[1]
    if not os.path.exists(json_path):
        print(f"error: file not found: {json_path}")
        sys.exit(1)

    # load assessment data
    assessment_data = load_assessment_data(json_path)
    if not assessment_data:
        sys.exit(1)

    # generate output path
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    output_path = f"diagnostic-sample_{timestamp}.pdf"

    # generate pdf
    success = generate_pdf_report(assessment_data, output_path)

    if success:
        print(f"report generated: {output_path}")
        print(f"file size: {os.path.getsize(output_path)} bytes")
    else:
        sys.exit(1)


if __name__ == "__main__":
    main()
