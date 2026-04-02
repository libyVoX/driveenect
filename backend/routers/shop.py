import random
from fastapi import APIRouter
from sqlmodel import Session, select
from database import engine
from models import Goods, User, Purchase

router = APIRouter()

@router.get("/shop")
def get_goods():
    with Session(engine) as session:
        goods = session.exec(select(Goods)).all()
        return goods
    
@router.get("/shop/get_balance")
def get_balance(user_id: int):
    with Session(engine) as session:
        user = session.get(User, user_id)
        return user.points
    
@router.get("/shop/get_lootboxes")
def get_lootboxes(user_id: int):
    with Session(engine) as session:
        user = session.get(User, user_id)
        return user.lootboxes

@router.post("/shop/buy")
def buy_goods(user_id: int, goods_id: int):
    with Session(engine) as session:

        user = session.get(User, user_id)
        goods = session.get(Goods, goods_id)

        if user.points < goods.price:
            return {"error": "not enough points"}

        user.points -= goods.price

        purchase = Purchase(
            user_id=user_id,
            goods_id=goods_id
        )

        session.add(purchase)
        session.add(user)
        session.commit()

        return {"status": "success"}

@router.get("/shop/purchases")
def get_purchases(user_id: int):

    with Session(engine) as session:

        statement = (
            select(Purchase, Goods)
            .join(Goods, Goods.id == Purchase.goods_id)
            .where(Purchase.user_id == user_id)
        )

        results = session.exec(statement).all()

        return [
            {
                "purchase_id": purchase.id,
                "name": goods.name,
                "discription": goods.discription,
                "price": goods.price
            }
            for purchase, goods in results
        ]

@router.post("/shop/open_lootbox")
def open_lootbox(user_id: int):

    with Session(engine) as session:

        user = session.get(User, user_id)

        if user.lootboxes <= 0:
            return {"error": "no lootboxes"}

        # уменьшаем количество лутбоксов
        user.lootboxes -= 1

        # получаем список всех товаров
        goods = session.exec(select(Goods)).all()

        if not goods:
            return {"error": "no goods in shop"}

        # случайный товар (равный шанс)
        reward = random.choice(goods)

        purchase = Purchase(
            user_id=user_id,
            goods_id=reward.id
        )

        session.add(purchase)
        session.add(user)
        session.commit()

        return {
            "reward_name": reward.name,
            "reward_description": reward.discription,
            "reward_price": reward.price
        }