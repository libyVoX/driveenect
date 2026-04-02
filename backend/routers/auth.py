# routers/auth.py
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from jose import jwt
from pydantic import BaseModel

from models import User
from database import engine

router = APIRouter(prefix="/auth", tags=["auth"])

SECRET_KEY = "ENG54_MPIT_REP2026_driveenect^-^"
ALGORITHM = "HS256"

def get_session():
    with Session(engine) as session:
        yield session

def create_access_token(phone: str, name: str):
    to_encode = {"sub": phone, "sub": name}
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

class AuthRequest(BaseModel):
    phone: str
    name: str = None

@router.post("/")
def login_or_register(data: AuthRequest, session: Session = Depends(get_session)):
    user = session.exec(select(User).where(User.phone == data.phone)).first()
    if not user:
        if not data.name:
            raise HTTPException(status_code=400, detail="Name required for first login")
        # создаём нового пользователя
        user = User(phone=data.phone, name=data.name)
        session.add(user)
        session.commit()
        session.refresh(user)
        session.commit()
    token = create_access_token(data.phone, data.name)
    return {"access_token": token, "user_name": user.name, "user_id": user.user_id, "is_driver": user.is_driver}
