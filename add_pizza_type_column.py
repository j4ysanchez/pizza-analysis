import random
import psycopg2

def connect_to_db():
    conn = psycopg2.connect(
        dbname="pizza_orders",
        user="pizza_admin",
        password="i<3pizza",
        host="localhost",
        port="5432"
    )
    return conn

def update_pizza_types():
    pizza_types = ["Margherita", "Pepperoni", "Hawaiian", "Veggie", "Meat Lovers", "Supreme"]
    
    conn = connect_to_db()
    cursor = conn.cursor()
    
    # Add the new column if it doesn't exist
    cursor.execute("""
    ALTER TABLE pizza_orders ADD COLUMN IF NOT EXISTS pizza_type VARCHAR(50);
    """)
    
    # Update existing rows with random pizza types
    cursor.execute("SELECT id FROM pizza_orders")
    order_ids = cursor.fetchall()
    
    for order_id in order_ids:
        pizza_type = random.choice(pizza_types)
        cursor.execute("UPDATE pizza_orders SET pizza_type = %s WHERE id = %s", (pizza_type, order_id))
    
    conn.commit()
    cursor.close()
    conn.close()

# Update pizza types for existing orders
update_pizza_types()