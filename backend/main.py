from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List
import requests
from fastapi.middleware.cors import CORSMiddleware
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"],  
)

@app.get("/divisas/incomingCountries", response_model=List[dict])
async def get_incoming_countries():
    response = requests.get("https://elb.currencybird.cl/apigateway-cb/api/public/incomingCountries")

    incoming_countries = response.json()
    
    return incoming_countries

@app.get("/divisas/sendCountries", response_model=List[dict])
async def get_incoming_countries():
    response = requests.get("https://elb.currencybird.cl/apigateway-cb/api/public/sendCountries")

    send_countries = response.json()
    
    return send_countries

class ConversionRequest(BaseModel):
    currency: str  
    amount: float
    date: str 

@app.post("/convert_to_chile_with_fee")
async def convert_to_chile_with_fee(request: ConversionRequest):
    conversion_url = f"https://{request.date}.currency-api.pages.dev/v1/currencies/clp.json"
    response = requests.get(conversion_url)
    
    if response.status_code != 200:
        raise HTTPException(status_code=response.status_code, detail="Error fetching conversion rate")
    
    conversion_rates = response.json()
    if "clp" not in conversion_rates:
        raise HTTPException(status_code=404, detail="Conversion rate for CLP not found")
    
    conversion_rate = conversion_rates["clp"][request.currency.lower()]

    final_amount = (request.amount / conversion_rate) * 0.95
    
    return {
        "conversion_rate": round((1/conversion_rate) * 0.95,6),
        "final_amount": round(final_amount,6)
    }

@app.post("/convert_to_chile_without_fee")
async def convert_to_chile_without_fee(request: ConversionRequest):
    conversion_url = f"https://{request.date}.currency-api.pages.dev/v1/currencies/clp.json"
    response = requests.get(conversion_url)
    
    if response.status_code != 200:
        raise HTTPException(status_code=response.status_code, detail="Error fetching conversion rate")
    
    conversion_rates = response.json()
    if "clp" not in conversion_rates:
        raise HTTPException(status_code=404, detail="Conversion rate for CLP not found")
    
    conversion_rate = 1/conversion_rates["clp"][request.currency.lower()]

    final_amount = request.amount * conversion_rate * 1/0.95
    
    return {
        "conversion_rate": round((1/conversion_rate) * 0.95,6),
        "final_amount": round(final_amount,6)
    }

@app.post("/convert_from_chile_with_fee")
async def convert_from_chile_with_fee(request: ConversionRequest):
    conversion_url = f"https://{request.date}.currency-api.pages.dev/v1/currencies/clp.json"
    response = requests.get(conversion_url)
    
    if response.status_code != 200:
        raise HTTPException(status_code=response.status_code, detail="Error fetching conversion rate")
    
    conversion_rates = response.json()
    if "clp" not in conversion_rates:
        raise HTTPException(status_code=404, detail="Conversion rate for CLP not found")
    
    conversion_rate = (conversion_rates["clp"][request.currency.lower()])

    final_amount = request.amount * conversion_rate * 0.95
    
    return {
        "conversion_rate": round(conversion_rate * 0.95,6),
        "final_amount": round(final_amount,6)
    }
    
@app.post("/convert_from_chile_without_fee")
async def convert_from_chile_without_fee(request: ConversionRequest):

    conversion_url = f"https://{request.date}.currency-api.pages.dev/v1/currencies/clp.json"
    response = requests.get(conversion_url)
    
    if response.status_code != 200:
        raise HTTPException(status_code=response.status_code, detail="Error fetching conversion rate")
    
    conversion_rates = response.json()
    
    if "clp" not in conversion_rates:
        raise HTTPException(status_code=404, detail="Conversion rate for CLP not found")

    conversion_rate = (conversion_rates["clp"][request.currency.lower()]) 
    final_amount = (request.amount * conversion_rate) / 0.95

    return {
        "conversion_rate": round(((1/conversion_rate)*0.95),6),
        "final_amount": round(final_amount,6)
    }