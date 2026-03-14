import pytest

REGISTER_URL = "/api/v1/register"
LOGIN_URL = "/api/v1/login"
REFRESH_URL = "/api/v1/token/refresh"
ME_URL = "/api/v1/me"

VALID_USER = {"email": "test@example.com", "username": "testuser", "password": "Password123"}


def register_and_login(client):
    client.post(REGISTER_URL, json=VALID_USER)
    resp = client.post(LOGIN_URL, json={"email": VALID_USER["email"], "password": VALID_USER["password"]})
    return resp.json()


# --- Register ---

def test_register_success(client):
    resp = client.post(REGISTER_URL, json=VALID_USER)
    assert resp.status_code == 200
    data = resp.json()
    assert data["email"] == VALID_USER["email"]
    assert "password" not in data


def test_register_duplicate_email(client):
    client.post(REGISTER_URL, json=VALID_USER)
    resp = client.post(REGISTER_URL, json={**VALID_USER, "username": "other"})
    assert resp.status_code == 400


def test_register_duplicate_username(client):
    client.post(REGISTER_URL, json=VALID_USER)
    resp = client.post(REGISTER_URL, json={**VALID_USER, "email": "other@example.com"})
    assert resp.status_code == 400


def test_register_weak_password_short(client):
    resp = client.post(REGISTER_URL, json={**VALID_USER, "password": "Abc1"})
    assert resp.status_code == 422


def test_register_weak_password_no_uppercase(client):
    resp = client.post(REGISTER_URL, json={**VALID_USER, "password": "password123"})
    assert resp.status_code == 422


def test_register_weak_password_no_digit(client):
    resp = client.post(REGISTER_URL, json={**VALID_USER, "password": "Password"})
    assert resp.status_code == 422


# --- Login ---

def test_login_success(client):
    client.post(REGISTER_URL, json=VALID_USER)
    resp = client.post(LOGIN_URL, json={"email": VALID_USER["email"], "password": VALID_USER["password"]})
    assert resp.status_code == 200
    data = resp.json()
    assert "access_token" in data
    assert "refresh_token" in data
    assert data["token_type"] == "bearer"


def test_login_wrong_password(client):
    client.post(REGISTER_URL, json=VALID_USER)
    resp = client.post(LOGIN_URL, json={"email": VALID_USER["email"], "password": "WrongPass1"})
    assert resp.status_code == 401


def test_login_nonexistent_user(client):
    resp = client.post(LOGIN_URL, json={"email": "noone@example.com", "password": "Password123"})
    assert resp.status_code == 401


# --- GET /me ---

def test_get_me(client):
    tokens = register_and_login(client)
    resp = client.get(ME_URL, headers={"Authorization": f"Bearer {tokens['access_token']}"})
    assert resp.status_code == 200
    assert resp.json()["email"] == VALID_USER["email"]


def test_get_me_no_token(client):
    resp = client.get(ME_URL)
    assert resp.status_code in (401, 403)


def test_get_me_invalid_token(client):
    resp = client.get(ME_URL, headers={"Authorization": "Bearer invalidtoken"})
    assert resp.status_code == 401


# --- Refresh token ---

def test_refresh_token(client):
    tokens = register_and_login(client)
    resp = client.post(REFRESH_URL, json={"refresh_token": tokens["refresh_token"]})
    assert resp.status_code == 200
    data = resp.json()
    assert "access_token" in data
    assert "refresh_token" in data


def test_refresh_invalid_token(client):
    resp = client.post(REFRESH_URL, json={"refresh_token": "notavalidtoken"})
    assert resp.status_code == 401


def test_access_token_cannot_be_used_as_refresh(client):
    tokens = register_and_login(client)
    resp = client.post(REFRESH_URL, json={"refresh_token": tokens["access_token"]})
    assert resp.status_code == 401
