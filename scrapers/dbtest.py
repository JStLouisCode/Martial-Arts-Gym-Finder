import sqlite3

def query_all_data():
    # Connect to the SQLite database
    conn = sqlite3.connect('clubs.db')
    cursor = conn.cursor()
    
    # Query all rows from the clubs table
    cursor.execute('SELECT * FROM clubs')
    rows = cursor.fetchall()
    
    # Display the data
    print("All Clubs:")
    for row in rows:
        print(f"ID: {row[0]}, Club Name: {row[1]}, City: {row[2]}, Organization: {row[3]}")
    
    # Close the connection
    conn.close()

def query_by_organization(organization):
    # Connect to the SQLite database
    conn = sqlite3.connect('clubs.db')
    cursor = conn.cursor()
    
    # Query rows for a specific organization
    cursor.execute('SELECT * FROM clubs WHERE organization = ?', (organization,))
    rows = cursor.fetchall()
    
    # Display the data
    print(f"Clubs under {organization}:")
    for row in rows:
        print(f"ID: {row[0]}, Club Name: {row[1]}, City: {row[2]}")
    
    # Close the connection
    conn.close()

# Example usage
if __name__ == "__main__":
    # Query all data
    query_all_data()
    
    # Query specific organization
    query_by_organization("Judo Canada")
