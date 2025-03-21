from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import openai
import os
from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.orm import sessionmaker, declarative_base

# Initialize FastAPI
app = FastAPI()

# OpenAI API Key
openai.api_key = "your-openai-api-key"

# Database setup
DATABASE_URL = "postgresql://user:password@localhost/legal_docs"
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Database Model
class LegalDocument(Base):
    __tablename__ = "documents"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    content = Column(String)

Base.metadata.create_all(bind=engine)

# Request Model
class DocumentRequest(BaseModel):
    title: str
    description: str

# AI-Powered Document Generation
@app.post("/generate/")
def generate_document(request: DocumentRequest):
    try:
        response = openai.ChatCompletion.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "You are a legal expert generating professional legal documents."},
                {"role": "user", "content": f"Generate a legal document titled '{request.title}' based on: {request.description}"}
            ]
        )
        document_content = response['choices'][0]['message']['content']

        # Store in DB
        db = SessionLocal()
        new_doc = LegalDocument(title=request.title, content=document_content)
        db.add(new_doc)
        db.commit()
        db.refresh(new_doc)
        db.close()

        return {"id": new_doc.id, "title": request.title, "content": document_content}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Retrieve a document
@app.get("/document/{doc_id}")
def get_document(doc_id: int):
    db = SessionLocal()
    document = db.query(LegalDocument).filter(LegalDocument.id == doc_id).first()
    db.close()
    if not document:
        raise HTTPException(status_code=404, detail="Document not found")
    return {"id": document.id, "title": document.title, "content": document.content}
