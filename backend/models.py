# backend/models.py
from sqlalchemy import Column, Integer, String
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class Document(Base):
    __tablename__ = 'documents'
    
    id = Column(Integer, primary_key=True, index=True)
    type = Column(String, unique=True, nullable=False)
    title = Column(String, nullable=False)
    position = Column(Integer, nullable=False)
