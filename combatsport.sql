-- Create the table with a UNIQUE constraint to prevent duplicates
CREATE TABLE IF NOT EXISTS clubs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    club_name TEXT NOT NULL,
    city TEXT NOT NULL,
    style TEXT NOT NULL,
    organization TEXT NOT NULL, -- New column to store the organization name
    UNIQUE(club_name, city, organization) -- Prevent duplicates across organizations
);

