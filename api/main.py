from fastapi import FastAPI, HTTPException, Depends, Query, Response
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
    expose_headers=["x-total-count"],  # Expose the custom header
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
async def get_orders(
    response: Response,
    conn=Depends(get_db_connection),
    limit: int = Query(50, ge=1),
    offset: int = Query(0, ge=0),
    pizza_type: str = None
):
    try:
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        if pizza_type:
            cursor.execute(
                "SELECT COUNT(*) FROM pizza_orders WHERE pizza_type = %s",
                (pizza_type,)
            )
            total_count = cursor.fetchone()['count']
            cursor.execute(
                "SELECT * FROM pizza_orders WHERE pizza_type = %s ORDER BY order_timestamp LIMIT %s OFFSET %s",
                (pizza_type, limit, offset)
            )
        else:
            cursor.execute("SELECT COUNT(*) FROM pizza_orders")
            total_count = cursor.fetchone()['count']
            cursor.execute(
                "SELECT * FROM pizza_orders ORDER BY order_timestamp LIMIT %s OFFSET %s",
                (limit, offset)
            )
        orders = cursor.fetchall()
        cursor.close()
        response.headers['x-total-count'] = str(total_count)
        return orders
    except psycopg2.Error as e:
        raise HTTPException(status_code=500, detail="Error fetching orders")
    finally:
        conn.close()

@app.get("/api/pizza-types", response_model=List[Dict])
async def get_pizza_types(conn=Depends(get_db_connection)):
    try:
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        cursor.execute("""
            SELECT pizza_type, COUNT(*) as count
            FROM pizza_orders
            GROUP BY pizza_type
            ORDER BY count DESC
        """)
        pizza_types = cursor.fetchall()
        cursor.close()
        return pizza_types
    except psycopg2.Error as e:
        raise HTTPException(status_code=500, detail="Error fetching pizza types")
    finally:
        conn.close()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=5000)