import psycopg2
import random

def connect_to_db():
    conn = psycopg2.connect(
        dbname="pizza_orders",
        user="pizza_admin",
        password="i<3pizza",
        host="localhost",
        port="5432"
    )
    return conn

def update_pizza_distribution(conn):
    cursor = conn.cursor()
    
    # Define the desired distribution
    desired_distribution = {
        "Pepperoni": 0.325,  # Average of 30-35%
        "Margherita": 0.175,  # Average of 15-20%
        "Meat Lovers": 0.15,  # 15%
        "Supreme": 0.11,  # Average of 10-12%
        "Hawaiian": 0.1,  # Average of 8-10%
        "Vegetarian": 0.08  # Average of 8-10%
    }
    
    # Calculate the total number of orders
    cursor.execute("SELECT COUNT(*) FROM pizza_orders")
    total_orders = cursor.fetchone()[0]
    
    # Calculate the desired number of orders for each pizza type
    desired_counts = {pizza_type: int(total_orders * percentage) for pizza_type, percentage in desired_distribution.items()}
    
    # Get all order IDs
    cursor.execute("SELECT id FROM pizza_orders")
    order_ids = [row[0] for row in cursor.fetchall()]
    
    # Shuffle order IDs to randomize the update process
    random.shuffle(order_ids)
    
    # Update the pizza orders to reflect the desired distribution
    index = 0
    for pizza_type, desired_count in desired_counts.items():
        for _ in range(desired_count):
            cursor.execute("UPDATE pizza_orders SET pizza_type = %s WHERE id = %s", (pizza_type, order_ids[index]))
            index += 1
    
    conn.commit()
    cursor.close()

def main():
    conn = connect_to_db()
    update_pizza_distribution(conn)
    conn.close()

if __name__ == "__main__":
    main()