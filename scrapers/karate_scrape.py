import pandas as pd
import sqlite3

def insert_karate_clubs(csv_file):
    # Connect to the database
    conn = sqlite3.connect('clubs.db')
    cursor = conn.cursor()

    # Ensure the table exists
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS clubs (
        club_name TEXT NOT NULL,
        city TEXT NOT NULL,
        style TEXT NOT NULL,
        organization TEXT NOT NULL,
        UNIQUE(club_name, city, style, organization)  -- Avoid duplicate entries
    )
    ''')

    # Load the CSV file into a DataFrame
    df = pd.read_csv(csv_file)

    # Extract relevant columns
    location = df['DOJO LOCATION TOWN/CITY'].str.lower().tolist()
    club_name = df['DOJO NAME'].tolist()

    # Define style and organization
    style = "Karate"
    organization = "Karate Ontario"

    # Insert each club into the database
    for club, city in zip(club_name, location):
        try:
            cursor.execute('''
            INSERT OR IGNORE INTO clubs (club_name, city, style, organization)
            VALUES (?, ?, ?, ?)
            ''', (club, city, style, organization))
            print(f"Inserted: {club}, {city}")
        except Exception as e:
            print(f"Error inserting {club}: {e}")

    # Commit changes and close the connection
    conn.commit()
    conn.close()
    print("Karate clubs data insertion completed.")

# Path to the Karate clubs CSV file
csv_file = r'C:Martial Arts Gym Finder\scrapers\karate_clubs.csv'

# Insert Karate clubs into the database
insert_karate_clubs(csv_file)




