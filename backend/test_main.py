from fastapi.testclient import TestClient
from main import app 

client = TestClient(app)

def test_get_incoming_countries():
    response = client.get("/divisas/incomingCountries")
    assert response.status_code == 200
    assert isinstance(response.json(), list)  

def test_get_send_countries():
    response = client.get("/divisas/sendCountries")
    assert response.status_code == 200
    assert isinstance(response.json(), list) 

def test_convert_to_chile_with_fee():
    data = {
        "currency": "usd",
        "amount": 1000.0,
        "date": "2024-08-01"
    }
    response = client.post("/convert_to_chile_with_fee", json=data)
    assert response.status_code == 200
    json_data = response.json()
    assert "final_amount" in json_data
    assert "conversion_rate" in json_data
    assert isinstance(json_data["final_amount"], float)
    assert isinstance(json_data["conversion_rate"], float)

def test_convert_to_chile_without_fee():
    data = {
        "currency": "usd",
        "amount": 1000.0,
        "date": "2024-08-01"
    }
    response = client.post("/convert_to_chile_without_fee", json=data)
    assert response.status_code == 200
    json_data = response.json()
    assert "final_amount" in json_data
    assert "conversion_rate" in json_data
    assert isinstance(json_data["final_amount"], float)
    assert isinstance(json_data["conversion_rate"], float)

def test_convert_from_chile_with_fee():
    data = {
        "currency": "usd",
        "amount": 1000.0,
        "date": "2024-08-01"
    }
    response = client.post("/convert_from_chile_with_fee", json=data)
    assert response.status_code == 200
    json_data = response.json()
    assert "final_amount" in json_data
    assert "conversion_rate" in json_data
    assert isinstance(json_data["final_amount"], float)
    assert isinstance(json_data["conversion_rate"], float)

def test_convert_from_chile_without_fee():
    data = {
        "currency": "usd",
        "amount": 1000.0,
        "date": "2024-08-01"
    }
    response = client.post("/convert_from_chile_without_fee", json=data)
    assert response.status_code == 200
    json_data = response.json()
    assert "final_amount" in json_data
    assert "conversion_rate" in json_data
    assert isinstance(json_data["final_amount"], float)
    assert isinstance(json_data["conversion_rate"], float)
