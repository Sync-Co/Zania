# backend/main.py

from starlette.applications import Starlette
from starlette.responses import JSONResponse
from starlette.routing import Route
from starlette.middleware.cors import CORSMiddleware
from models import Document
from database import AsyncSessionLocal
from sqlalchemy.future import select
from sqlalchemy import insert, update
import json

app = Starlette(debug=True)

# Allow CORS for all domains and ports
app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_methods=['GET', 'POST', 'PUT', 'DELETE'],
    allow_headers=['*'],
)

@app.route('/documents', methods=['GET'])
async def get_documents(request):
    async with AsyncSessionLocal() as session:
        result = await session.execute(select(Document).order_by(Document.position))
        documents = result.scalars().all()
        docs = [{"type": doc.type, "title": doc.title, "position": doc.position} for doc in documents]
        return JSONResponse(docs)

@app.route('/documents', methods=['POST'])
async def add_document(request):
    data = await request.json()
    async with AsyncSessionLocal() as session:
        new_doc = Document(
            type=data['type'],
            title=data['title'],
            position=data['position']
        )
        session.add(new_doc)
        await session.commit()
        await session.refresh(new_doc)
        return JSONResponse({"type": new_doc.type, "title": new_doc.title, "position": new_doc.position}, status_code=201)

@app.route('/documents', methods=['PUT'])
async def update_documents(request):
    data = await request.json()  # Expecting a list of documents with updated positions
    async with AsyncSessionLocal() as session:
        for doc in data:
            stmt = (
                update(Document).
                where(Document.type == doc['type']).
                values(position=doc['position'])
            )
            await session.execute(stmt)
        await session.commit()
    return JSONResponse({"status": "updated"}, status_code=200)
