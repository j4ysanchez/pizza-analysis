from fastapi import FastAPI
import psycopg2
from psycopg2.extras import RealDictCursor
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust this to your frontend's origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def connect_to_db():
    conn = psycopg2.connect(
        dbname="pizza_orders",
        user="pizza_admin",
        password="i<3pizza",
        host="localhost",
        port="5432"
    )
    return conn

@app.get("/api/orders")
async def get_orders():
    conn = connect_to_db()
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    cursor.execute("SELECT * FROM pizza_orders")
    orders = cursor.fetchall()
    cursor.close()
    conn.close()
    return orders

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=5000)