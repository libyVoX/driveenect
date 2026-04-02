from fastapi import APIRouter
from sqlmodel import Session,select
from database import engine
from models import Trip, User
from pydantic import BaseModel
from datetime import datetime
from sqlmodel import select

router = APIRouter()


class TripCreate(BaseModel):
    from_address: str
    to_address: str
    price: int
    passenger_id: int

class TripTake(BaseModel):
    trip_id: int
    driver_id: int


@router.post("/trip/create")
def create_trip(data: TripCreate):

    with Session(engine) as session:

        trip = Trip(
            from_address=data.from_address,
            to_address=data.to_address,
            price=data.price,
            passenger_id=data.passenger_id
        )

        session.add(trip)
        session.commit()
        session.refresh(trip)

        return trip



# --------------ДЛЯ ПРОТОТИПА ЗАВЕРШАЕТСЯ СРАЗУ!!!!!!!!!!--------------
@router.post("/trip/take")
def take_trip(data: TripTake):

    with Session(engine) as session:

        trip = session.get(Trip, data.trip_id)

        if not trip:
            return {"error": "Trip not found"}

        if trip.driver_id:
            return {"error": "Trip already taken"}

        trip.driver_id = data.driver_id
        trip.start_time = datetime.utcnow()



        #ЗАВЕРШЕНИЕ СРАЗУ!!!!!!!!
        trip.end_time = datetime.utcnow()
        trip.is_done = True

        passanger = session.get(User, trip.passenger_id)
        driver = session.get(User, data.driver_id)
        passanger.points += 50
        driver.points += 50
        session.add(passanger)
        session.add(driver)




        session.add(trip)
        session.commit()
        session.refresh(trip)

        return trip


@router.post("/trip/finish/{trip_id}")
def finish_trip(trip_id: int):

    with Session(engine) as session:

        trip = session.get(Trip, trip_id)

        if not trip:
            return {"error": "Trip not found"}

        trip.is_done = True
        trip.end_time = datetime.utcnow()

        session.add(trip)
        session.commit()
        session.refresh(trip)

        return trip
    
@router.get("/trip/available")
def available_trips():

    with Session(engine) as session:

        trips = session.exec(
            select(Trip).where(Trip.is_done == False, Trip.driver_id == None)
        ).all()

        return trips
