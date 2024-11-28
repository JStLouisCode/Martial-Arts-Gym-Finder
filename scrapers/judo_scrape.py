import requests
import sqlite3
from bs4 import BeautifulSoup

def scrape_clubs(pages):
    # Establish a database connection and create the cursor
    conn = sqlite3.connect('clubs.db')  # Make sure 'clubs.db' matches your database file
    cursor = conn.cursor()
    
    for page_url in pages:
        result = requests.get(page_url)
        soup = BeautifulSoup(result.text, "html.parser")
        table = soup.find('tbody', id='calendar_list')
        
        if not table:
            print(f"No more data available on {page_url}")
            continue
        
        for row in table.find_all('tr'):
            club_div = row.find('div', class_='flex')
            if club_div:
                club_name = club_div.text.strip()
                location = row.find_all('td')[1].text.strip().lower() if len(row.find_all('td')) > 1 else "Location not found"
                style = "Judo"  # Hardcoded style for Judo
                organization = "Judo Canada"  # Hardcoded organization
                
                # Insert the data into the database
                try:
                    cursor.execute('''
                    INSERT OR IGNORE INTO clubs (club_name, city, style, organization)
                    VALUES (?, ?, ?, ?)
                    ''', (club_name, location, style, organization))
                except Exception as e:
                    print(f"Error inserting {club_name}: {e}")
    
    # Commit changes and close the connection
    conn.commit()
    conn.close()

# URLs for the pages
pages = [
    'https://registration.judocanada.org/clubs/page/1/',
    'https://registration.judocanada.org/clubs/page/2/'
]

# Run the scraping function
scrape_clubs(pages)
