import pytest
from app import app

@pytest.fixture
def client():
    app.config["TESTING"] = True
    with app.test_client() as client:
        yield client

def test_15_backend_health_endpoint(client):
    """Test 15: GET /api/health returns 200 and healthy status."""
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.get_json()
    assert data["status"] == "healthy"
    assert "SafeVoice" in data["service"]
    assert "dictionary_term_count" in data

def test_16_invalid_api_requests(client):
    """Test 16: Invalid API requests return structured 400 error codes."""
    # Non-json payload
    response = client.post("/api/moderate", data="plain text", content_type="text/plain")
    assert response.status_code == 400

    # Missing text field
    response = client.post("/api/moderate", json={"wrong_key": "val"})
    assert response.status_code == 400
    assert "Missing 'text' field" in response.get_json()["error"]

    # Text length exceeding limit
    oversized = "a" * 25000
    response = client.post("/api/moderate", json={"text": oversized})
    assert response.status_code == 400
    assert "exceeds maximum" in response.get_json()["error"]

    # Empty dictionary term add
    response = client.post("/api/dictionary", json={"term": "   "})
    assert response.status_code == 400

    # Non-existent dictionary term delete
    response = client.delete("/api/dictionary/non_existent_term_xyz_123")
    assert response.status_code == 404

def test_api_moderate_endpoint_success(client):
    """Test standard API moderation endpoint with valid payload."""
    payload = {
        "text": "This is a stupid post with toxic behavior.",
        "mode": "mask"
    }
    response = client.post("/api/moderate", json=payload)
    assert response.status_code == 200
    data = response.get_json()
    assert data["match_count"] == 2
    assert "stupid" in data["flagged_terms"]
    assert "toxic" in data["flagged_terms"]
    assert data["is_moderated"] is True

def test_api_dictionary_lifecycle(client):
    """Test adding, retrieving, and deleting a dictionary term via API."""
    test_term = "arbitrarytestword"

    # 1. Add
    res_add = client.post("/api/dictionary", json={"term": test_term})
    assert res_add.status_code == 201

    # 2. Get list and verify
    res_get = client.get("/api/dictionary")
    assert res_get.status_code == 200
    assert test_term in res_get.get_json()["terms"]

    # 3. Delete
    res_del = client.delete(f"/api/dictionary/{test_term}")
    assert res_del.status_code == 200

    # 4. Confirm deleted
    res_get2 = client.get("/api/dictionary")
    assert test_term not in res_get2.get_json()["terms"]

def test_api_stats_lifecycle(client):
    """Test stats tracking and reset."""
    # Reset stats
    res_reset = client.post("/api/reset-stats")
    assert res_reset.status_code == 200

    # Moderate a short sentence
    client.post("/api/moderate", json={"text": "Hello stupid world", "mode": "mask"})

    # Check stats
    res_stats = client.get("/api/stats")
    assert res_stats.status_code == 200
    stats = res_stats.get_json()
    assert stats["total_words_processed"] == 3
    assert stats["total_flagged_words"] == 1
    assert stats["total_submissions"] >= 1
