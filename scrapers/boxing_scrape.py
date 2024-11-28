import sqlite3

def insert_boxing_clubs(file_path):
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
    style = "Boxing"
    organization = "Boxing Ontario"

    # Extract data from the text file
    with open(file_path, 'r') as file:
        for line in file:
            line = line.strip()  # Remove newline characters
            parts = line.split(', ')
            if len(parts) >= 2:  # Ensure the line contains both club name and city
                club = parts[0].replace("Club Name: ", "")
                city = parts[1].replace("City: ", "").lower()

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
    print("Boxing clubs data insertion completed.")

# File path to the boxing data file
file_path = r'C:\Users\Jared\OneDrive - Carleton University\Desktop\Personal Projects\Martial Arts Gym Finder\scrapers\boxing.txt'

# Insert boxing clubs into the database
insert_boxing_clubs(file_path)


