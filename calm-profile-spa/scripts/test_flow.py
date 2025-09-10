#!/usr/bin/env python3
"""
automated flow testing script for calm.profile
captures console logs, network errors, and api responses
"""

import json
import time
import requests
import subprocess
import os
from datetime import datetime
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException, NoSuchElementException

# configuration
SPA_URL = "http://localhost:3000"
API_URL = "http://localhost:5001"
ARTIFACTS_DIR = "artifacts"
FLOW_DIR = f"{ARTIFACTS_DIR}/flow"
API_DIR = f"{ARTIFACTS_DIR}/api"

# ensure directories exist
os.makedirs(FLOW_DIR, exist_ok=True)
os.makedirs(API_DIR, exist_ok=True)
os.makedirs(f"{FLOW_DIR}/snapshots", exist_ok=True)


def setup_driver():
    """setup chrome driver with logging enabled"""
    options = Options()
    options.add_argument("--headless")
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")
    options.add_argument("--disable-gpu")
    options.add_argument("--window-size=1920,1080")

    # enable logging
    options.add_argument("--enable-logging")
    options.add_argument("--log-level=0")
    options.set_capability(
        "goog:loggingPrefs", {"browser": "ALL", "driver": "ALL", "performance": "ALL"}
    )

    driver = webdriver.Chrome(options=options)
    return driver


def capture_console_logs(driver):
    """capture browser console logs"""
    logs = []
    try:
        for log in driver.get_log("browser"):
            logs.append(
                {
                    "timestamp": log["timestamp"],
                    "level": log["level"],
                    "message": log["message"],
                }
            )
    except Exception as e:
        logs.append({"error": f"failed to capture logs: {e}"})
    return logs


def capture_network_errors(driver):
    """capture network failures"""
    errors = []
    try:
        for log in driver.get_log("performance"):
            if log["message"].get("method") == "Network.responseReceived":
                response = log["message"]["params"]["response"]
                if response["status"] >= 400:
                    errors.append(
                        {
                            "url": response["url"],
                            "status": response["status"],
                            "timestamp": log["timestamp"],
                        }
                    )
    except Exception as e:
        errors.append({"error": f"failed to capture network errors: {e}"})
    return errors


def take_screenshot(driver, name):
    """take screenshot and save to snapshots"""
    try:
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"{FLOW_DIR}/snapshots/{name}_{timestamp}.png"
        driver.save_screenshot(filename)
        return filename
    except Exception as e:
        print(f"screenshot failed: {e}")
        return None


def test_assessment_flow():
    """run through complete assessment flow"""
    driver = setup_driver()
    flow_log = []
    network_errors = []
    console_logs = []

    try:
        print("starting flow test...")

        # step 1: load spa
        print("loading spa...")
        driver.get(SPA_URL)
        time.sleep(2)
        take_screenshot(driver, "01_home")
        flow_log.append({"step": "load_spa", "url": SPA_URL, "status": "success"})

        # step 2: navigate to assessment
        print("navigating to assessment...")
        try:
            assessment_link = WebDriverWait(driver, 10).until(
                EC.element_to_be_clickable(
                    (
                        By.XPATH,
                        "//a[contains(@href, '/assessment') or contains(text(), 'assessment')]",
                    )
                )
            )
            assessment_link.click()
            time.sleep(2)
            take_screenshot(driver, "02_assessment_start")
            flow_log.append({"step": "navigate_assessment", "status": "success"})
        except TimeoutException:
            flow_log.append(
                {"step": "navigate_assessment", "status": "failed", "error": "timeout"}
            )
            return

        # step 3: complete 20 questions
        print("completing 20 questions...")
        for i in range(20):
            try:
                # find question options and click first option (A)
                options = driver.find_elements(
                    By.XPATH,
                    "//input[@type='radio'] | //button[contains(@class, 'option')]",
                )
                if options:
                    options[0].click()
                    time.sleep(0.5)

                    # try to find next button
                    next_btn = driver.find_element(
                        By.XPATH,
                        "//button[contains(text(), 'next') or contains(text(), 'Next') or contains(@class, 'next')]",
                    )
                    if next_btn.is_enabled():
                        next_btn.click()
                        time.sleep(1)
                else:
                    # try clicking on option text
                    option_texts = driver.find_elements(
                        By.XPATH,
                        "//label[contains(@class, 'option')] | //div[contains(@class, 'option')]",
                    )
                    if option_texts:
                        option_texts[0].click()
                        time.sleep(0.5)

                        next_btn = driver.find_element(
                            By.XPATH,
                            "//button[contains(text(), 'next') or contains(text(), 'Next')]",
                        )
                        if next_btn.is_enabled():
                            next_btn.click()
                            time.sleep(1)

                if i % 5 == 0:
                    take_screenshot(driver, f"03_question_{i+1}")

            except Exception as e:
                flow_log.append(
                    {"step": f"question_{i+1}", "status": "failed", "error": str(e)}
                )
                print(f"question {i+1} failed: {e}")

        take_screenshot(driver, "04_questions_complete")
        flow_log.append({"step": "complete_questions", "status": "success"})

        # step 4: submit assessment
        print("submitting assessment...")
        try:
            submit_btn = WebDriverWait(driver, 10).until(
                EC.element_to_be_clickable(
                    (
                        By.XPATH,
                        "//button[contains(text(), 'submit') or contains(text(), 'Submit') or contains(@class, 'submit')]",
                    )
                )
            )
            submit_btn.click()
            time.sleep(3)
            take_screenshot(driver, "05_submit")
            flow_log.append({"step": "submit_assessment", "status": "success"})
        except TimeoutException:
            flow_log.append(
                {"step": "submit_assessment", "status": "failed", "error": "timeout"}
            )

        # step 5: context form
        print("filling context form...")
        try:
            # fill team size
            team_size_select = driver.find_element(
                By.XPATH,
                "//select[@name='team_size'] | //select[contains(@class, 'team-size')]",
            )
            team_size_select.send_keys("2-5")

            # fill meeting load
            meeting_select = driver.find_element(
                By.XPATH,
                "//select[@name='meeting_load'] | //select[contains(@class, 'meeting')]",
            )
            meeting_select.send_keys("moderate")

            # fill hourly rate
            rate_input = driver.find_element(
                By.XPATH,
                "//input[@name='hourly_rate'] | //input[contains(@class, 'rate')]",
            )
            rate_input.clear()
            rate_input.send_keys("100")

            # submit context
            context_submit = driver.find_element(
                By.XPATH,
                "//button[contains(text(), 'calculate') or contains(text(), 'Calculate')]",
            )
            context_submit.click()
            time.sleep(3)
            take_screenshot(driver, "06_context_submit")
            flow_log.append({"step": "submit_context", "status": "success"})
        except Exception as e:
            flow_log.append(
                {"step": "submit_context", "status": "failed", "error": str(e)}
            )

        # step 6: results page
        print("viewing results...")
        time.sleep(2)
        take_screenshot(driver, "07_results")
        flow_log.append({"step": "view_results", "status": "success"})

        # step 7: enter email
        print("entering email...")
        try:
            email_input = WebDriverWait(driver, 10).until(
                EC.presence_of_element_located(
                    (By.XPATH, "//input[@type='email'] | //input[@name='email']")
                )
            )
            email_input.send_keys("test@example.com")

            email_submit = driver.find_element(
                By.XPATH,
                "//button[contains(text(), 'get report') or contains(text(), 'checkout')]",
            )
            email_submit.click()
            time.sleep(3)
            take_screenshot(driver, "08_email_submit")
            flow_log.append({"step": "submit_email", "status": "success"})
        except Exception as e:
            flow_log.append(
                {"step": "submit_email", "status": "failed", "error": str(e)}
            )

        # step 8: checkout (stripe test)
        print("testing checkout...")
        try:
            # look for stripe checkout button or redirect
            checkout_elements = driver.find_elements(
                By.XPATH,
                "//button[contains(text(), 'checkout')] | //a[contains(@href, 'stripe')]",
            )
            if checkout_elements:
                checkout_elements[0].click()
                time.sleep(2)
                take_screenshot(driver, "09_checkout")
                flow_log.append({"step": "checkout", "status": "success"})
            else:
                flow_log.append(
                    {
                        "step": "checkout",
                        "status": "skipped",
                        "reason": "no checkout element found",
                    }
                )
        except Exception as e:
            flow_log.append({"step": "checkout", "status": "failed", "error": str(e)})

        # capture final logs
        console_logs = capture_console_logs(driver)
        network_errors = capture_network_errors(driver)

    except Exception as e:
        flow_log.append({"step": "flow_test", "status": "failed", "error": str(e)})
        print(f"flow test failed: {e}")

    finally:
        driver.quit()

    # save artifacts
    with open(f"{FLOW_DIR}/console.log", "w") as f:
        json.dump(console_logs, f, indent=2)

    with open(f"{FLOW_DIR}/network-failures.json", "w") as f:
        json.dump(network_errors, f, indent=2)

    with open(f"{FLOW_DIR}/flow_log.json", "w") as f:
        json.dump(flow_log, f, indent=2)

    print("flow test complete. artifacts saved.")
    return flow_log, console_logs, network_errors


def test_api_directly():
    """test api endpoints directly"""
    print("testing api endpoints...")

    # test health
    try:
        health_resp = requests.get(f"{API_URL}/health")
        print(f"health check: {health_resp.status_code}")
    except Exception as e:
        print(f"health check failed: {e}")

    # test assessment endpoint
    try:
        test_responses = {str(i): "A" for i in range(20)}
        test_context = {
            "team_size": "2-5",
            "meeting_load": "moderate",
            "hourly_rate": 100,
            "platform": "test",
        }

        assess_resp = requests.post(
            f"{API_URL}/api/assess",
            json={
                "responses": test_responses,
                "context": test_context,
                "email": "test@example.com",
            },
        )

        print(f"assessment api: {assess_resp.status_code}")

        if assess_resp.status_code == 200:
            result = assess_resp.json()
            with open(f"{API_DIR}/last_assessment.json", "w") as f:
                json.dump(result, f, indent=2)
            print("assessment result saved")
            return result
        else:
            print(f"assessment failed: {assess_resp.text}")

    except Exception as e:
        print(f"api test failed: {e}")

    return None


if __name__ == "__main__":
    print("starting calm.profile flow test...")

    # test api directly first
    api_result = test_api_directly()

    # test full flow
    flow_log, console_logs, network_errors = test_assessment_flow()

    print("\n=== test summary ===")
    print(
        f"flow steps completed: {len([s for s in flow_log if s.get('status') == 'success'])}"
    )
    print(
        f"console errors: {len([l for l in console_logs if l.get('level') == 'SEVERE'])}"
    )
    print(f"network errors: {len(network_errors)}")
    print(f"artifacts saved to: {ARTIFACTS_DIR}/")
