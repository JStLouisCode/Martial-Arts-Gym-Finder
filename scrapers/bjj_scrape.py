import sqlite3

def insert_bjj_clubs(file_path):
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

    # Define style and organization
    style = "BJJ"
    organization = "Ontario Jiu-Jitsu Association"

    # Read the text file and extract data
    with open(file_path, 'r') as file:
        for line in file:
            line = line.strip()  # Remove newline characters
            parts = line.split(', ')
            if len(parts) >= 2:  # Ensure the line contains both club name and city
                club = parts[0].replace("Club Name: ", "").strip()
                city = parts[1].replace("City: ", "").lower().strip()

                # Insert the data into the database
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
    print("BJJ clubs data insertion completed.")

# File path to the BJJ data file
file_path = r'C:Martial Arts Gym Finder\scrapers\bjj.txt'

# Insert BJJ clubs into the database
insert_bjj_clubs(file_path)
