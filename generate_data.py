import random
import pandas as pd
import psycopg2

def generate_random_pizza_orders(num_orders):
    # Define time buckets and days in month
    time_buckets = [
        {"start": 0, "end": 6, "percentage": 0.1},
        {"start": 6, "end": 12, "percentage": 0.2},
        {"start": 12, "end": 18, "percentage": 0.4},
        {"start": 18, "end": 24, "percentage": 0.3}
    ]
    days_in_month = 30

    # Generate orders
    orders = []
    for _ in range(num_orders):
        # Select a time bucket based on weights
        bucket = random.choices(time_buckets, weights=[b["percentage"] for b in time_buckets], k=1)[0]
        
        # Random day of the month (1-30)
        day = random.randint(1, days_in_month)
        
        # Random hour within the selected bucket
        hour = random.randint(bucket["start"], bucket["end"] - 1)
        
        # Random minute and second
        minute = random.randint(0, 59)
        second = random.randint(0, 59)
        
        # Create a timestamp (assuming all orders happen in the same month and year)
        timestamp = pd.Timestamp(year=2024, month=11, day=day, hour=hour, minute=minute, second=second)
        orders.append(timestamp)

    # Convert to a DataFrame
    orders_df = pd.DataFrame(orders, columns=["order_timestamp"])
    return orders_df

def connect_to_db():
    conn = psycopg2.connect(
        dbname="pizza_orders",
        user="pizza_admin",
        password="i<3pizza",
        host="localhost",
        port="5432"
    )
    return conn

def insert_orders_to_db(orders_df):
    conn = connect_to_db()
    cursor = conn.cursor()
    
    # Create table if not exists
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS pizza_orders (
        id SERIAL PRIMARY KEY,
        order_timestamp TIMESTAMP
    )
    """)
    
    # Insert data
    for index, row in orders_df.iterrows():
        cursor.execute("INSERT INTO pizza_orders (order_timestamp) VALUES (%s)", (row['order_timestamp'],))
    
    conn.commit()
    cursor.close()
    conn.close()

# Generate 100,000 orders
num_orders = 100000
orders_df = generate_random_pizza_orders(num_orders)

# Insert orders into the database
insert_orders_to_db(orders_df)

# Display the first few orders
print(orders_df.head())

# Optional: Save to CSV if needed
# orders_df.to_csv("simulated_pizza_orders.csv", index=False)