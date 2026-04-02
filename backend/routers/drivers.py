import math
from fastapi import APIRouter
from sqlmodel import Session, select
from database import engine
from models import DriverXP, Trip
from pydantic import BaseModel


def calculate_driver_rating(driver_id: int):
    with Session(engine) as session:
        trips = session.exec(
            select(Trip).where(Trip.driver_id == driver_id, Trip.is_done == True)
        ).all()

        completed_trips = len(trips)

        if completed_trips == 0:
            return 0.0

        avg_score = sum(t.rating for t in trips if t.rating is not None) / completed_trips

        # Формула: рейтинг = средняя оценка * log(кол-во завершённых поездок + 1)
        rating = avg_score * math.log(completed_trips + 1)
        return rating



router = APIRouter()

@router.get("/drivers/{driver_id}")
def drivers_index(driver_id: int):
    with Session(engine) as session:
        driver = session.get(DriverXP, driver_id)
        if not driver:
            return {"error": "Driver not found"}

        driver.rating = calculate_driver_rating(driver_id)

        return {
            "id": driver.id,
            "name": driver.name,
            "is_active": driver.is_active,
            "rating": driver.rating
        }

class TripRating(BaseModel):
    trip_id: int
    rating: int  # 1-5

@router.post("/trip/rate")
def rate_trip(data: TripRating):
    with Session(engine) as session:
        trip = session.get(Trip, data.trip_id)
        if not trip:
            return {"error": "Trip not found"}
        if not trip.is_done:
            return {"error": "Trip not finished yet"}

        trip.rating = data.rating
        session.add(trip)
        session.commit()
        session.refresh(trip)

        return trip
    
@router.get("/drivers/leaderboard")
def leaderboard():
    with Session(engine) as session:
        drivers = session.exec(select(DriverXP).where(DriverXP.is_active == 1)).all()
        # Считаем рейтинг для каждого
        drivers_sorted = sorted(drivers, key=lambda d: calculate_driver_rating(d.id), reverse=True)
        # Формируем JSON
        return [
            {
                "id": d.id,
                "name": d.name,
                "is_active": d.is_active,
                "rating": round(calculate_driver_rating(d.id), 2)
            } for d in drivers_sorted
        ]

