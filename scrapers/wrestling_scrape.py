import requests
import sqlite3
from bs4 import BeautifulSoup

def scrape_wrestling_clubs(url):
    # Establish a database connection and create the cursor
    conn = sqlite3.connect('clubs.db')  # Ensure 'clubs.db' matches your database file
    cursor = conn.cursor()

    # Create the table if it doesn't exist
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS clubs (
        club_name TEXT NOT NULL,
        city TEXT NOT NULL,
        style TEXT NOT NULL,
        organization TEXT NOT NULL,
        UNIQUE(club_name, city, style, organization)  -- Avoid duplicate entries
    )
    ''')

    # Fetch the data from the website
    response = requests.get(url)
    soup = BeautifulSoup(response.text, 'html.parser')
    table = soup.find('tbody')  # Adjust based on the actual structure of the Wrestling table

    if not table:
        print(f"No table data available on {url}")
        conn.close()
        return

    for row in table.find_all('tr'):
        columns = row.find_all('td')
        if len(columns) >= 3:  # Ensure there are enough columns to avoid errors
            club_name = columns[2].text.strip()
            city = columns[1].text.strip().lower()  # Normalize case for consistency
            style = "Wrestling"  # Hardcoded style for Wrestling
            organization = "Ontario Amateur Wrestling Association"  # Hardcoded organization

            # Insert the data into the database
            try:
                cursor.execute('''
                INSERT OR IGNORE INTO clubs (club_name, city, style, organization)
                VALUES (?, ?, ?, ?)
                ''', (club_name, city, style, organization))
                print(f"Inserted: {club_name}, {city}")
            except Exception as e:
                print(f"Error inserting {club_name}: {e}")

    # Commit changes and close the connection
    conn.commit()
    conn.close()
    print("Data insertion completed.")

# URL for the Wrestling club data
url = 'https://www.oawa.ca/oawa-club-listing'

# Run the scraping function
scrape_wrestling_clubs(url)
