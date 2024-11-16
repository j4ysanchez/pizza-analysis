from fastapi import FastAPI, HTTPException, Depends
import psycopg2
from psycopg2.extras import RealDictCursor
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Dict

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust this to your frontend's origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db_connection():
    try:
        conn = psycopg2.connect(
            dbname="pizza_orders",
            user="pizza_admin",
            password="i<3pizza",
            host="localhost",
            port="5432"
        )
        return conn
    except psycopg2.Error as e:
        raise HTTPException(status_code=500, detail="Database connection error")

@app.get("/api/orders", response_model=List[Dict])
async def get_orders(conn=Depends(get_db_connection)):
    try:
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        cursor.execute("SELECT * FROM pizza_orders")
        orders = cursor.fetchall()
        cursor.close()
        return orders
    except psycopg2.Error as e:
        raise HTTPException(status_code=500, detail="Error fetching orders")
    finally:
        conn.close()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=5000)