from fastapi import FastAPI
from pydantic import BaseModel, Field, ValidationError
from typing import List, Optional, Literal, Dict, Any
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="GeoSynth AI Validator", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class CorrelationInsight(BaseModel):
    summary: str = Field(min_length=1, max_length=2000)
    bullets: List[str] = Field(default_factory=list)
    caveats: Optional[str] = None

class CountryInsight(BaseModel):
    summary: str = Field(min_length=1, max_length=2000)
    bullets: List[str] = Field(default_factory=list)
    caveats: Optional[str] = None

class HeadlineInsight(BaseModel):
    summary: str = Field(min_length=1, max_length=2000)
    bullets: List[str] = Field(default_factory=list)

Schemas = {
    "CorrelationInsight": CorrelationInsight,
    "CountryInsight": CountryInsight,
    "HeadlineInsight": HeadlineInsight,
}

class ValidateRequest(BaseModel):
    schema: Literal["CorrelationInsight", "CountryInsight", "HeadlineInsight"]
    data: Dict[str, Any]

class ValidateResponse(BaseModel):
    ok: bool
    errors: List[str] = []
    data: Optional[Dict[str, Any]] = None

@app.post("/validate", response_model=ValidateResponse)
async def validate_payload(req: ValidateRequest):
    Model = Schemas[req.schema]
    try:
        obj = Model(**req.data)
        return ValidateResponse(ok=True, data=obj.model_dump())
    except ValidationError as e:
        return ValidateResponse(ok=False, errors=[err['msg'] for err in e.errors()])

@app.get("/")
async def root():
    return {"status": "ok", "schemas": list(Schemas.keys())}
