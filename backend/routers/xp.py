from fastapi import APIRouter, HTTPException
from sqlmodel import Session, select
from database import engine
from models import DriverXP
from models import User

router = APIRouter(prefix="/driver", tags=["driver"])

TOP_LIMIT = 10


@router.post("/xp/add/{user_id}/{amount}")
def add_xp(user_id: int, amount: int):
    with Session(engine) as session:

        user = session.get(DriverXP, user_id)

        if not user:
            user = DriverXP(user_id=user_id, xp=0)
            session.add(user)

        user.xp += amount
        session.commit()
        session.refresh(user)

        return user


@router.get("/top")
def get_top():
    with Session(engine) as session:

        statement = select(DriverXP).order_by(DriverXP.xp.desc()).limit(TOP_LIMIT)

        users = session.exec(statement).all()

        return users
    
@router.post("/become_driver")
def become_driver(user_id: int):
    with Session(engine) as session:
        user = session.get(User, user_id)
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        if user.is_driver:
            raise HTTPException(status_code=400, detail="Already a driver")
        
        user.is_driver = True
        # Создаем запись в DriverXP
        driver_xp = DriverXP(user_id=user.user_id, xp=0)
        session.add(driver_xp)
        session.add(user)
        session.commit()
        session.refresh(user)
        return {"status": "ok", "user_id": user.user_id, "is_driver": user.is_driver}

@router.post("/retire_driver")
def resign_driver(user_id: int):
    with Session(engine) as session:
        user = session.get(User, user_id)
        if not user or not user.is_driver:
            raise HTTPException(status_code=404, detail="User not a driver")
        
        user.is_driver = False
        # Удаляем запись из DriverXP
        driver_xp = session.get(DriverXP, user.user_id)
        if driver_xp:
            session.delete(driver_xp)
        
        session.add(user)
        session.commit()
        return {"status": "ok", "user_id": user.user_id, "is_driver": user.is_driver}