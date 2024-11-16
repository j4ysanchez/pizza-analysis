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

# Example usage
conn = connect_to_db()
cursor = conn.cursor()
cursor.execute("SELECT version();")
print(cursor.fetchone())
cursor.close()
conn.close()