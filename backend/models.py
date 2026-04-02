from sqlmodel import SQLModel, Field
from typing import Optional

class User(SQLModel, table=True):
    __tablename__ = "users"
    user_id: Optional[int] = Field(default=None, primary_key=True)
    phone: str  # номер телефона, уникальный
    name: str
    is_driver: bool = False
    points: Optional[int] = 0
    lootboxes: Optional[int] = 0

class DriverXP(SQLModel, table=True):
    __tablename__ = "drivers_xp"
    user_id: Optional[int] = Field(default=None, primary_key=True)
    xp: int = 0
    is_active: bool = True

class Trip(SQLModel, table=True):
    __tablename__ = "trips"
    trip_id: Optional[int] = Field(default=None, primary_key=True)
    from_address: str
    to_address: str
    price: int
    passenger_id: int
    driver_id: Optional[int] = None
    start_time: Optional[str] = None
    end_time: Optional[str] = None
    is_done: bool = False
    canceled_reason: Optional[str] = None

class Goods(SQLModel, table=True):
    __tablename__ = "goods"
    id: Optional[int] = Field(default=None, primary_key=True)
    name: Optional[str]
    discription: Optional[str]
    price: int

class Purchase(SQLModel, table=True):
    __tablename__ = "purchases"

    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int
    goods_id: int