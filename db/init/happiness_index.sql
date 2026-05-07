-- Tabelle erstellen
CREATE TABLE IF NOT EXISTS world_happiness (
    year INTEGER,
    rank_in_year INTEGER,
    country VARCHAR(255),
    region VARCHAR(255),
    happiness_score NUMERIC(5,3),
    lower_whisker NUMERIC(10,3),
    upper_whisker NUMERIC(10,3),
    gdp_per_capita NUMERIC(10,3),
    social_support NUMERIC(10,3),
    healthy_life_expectancy NUMERIC(10,3),
    freedom_to_make_choices NUMERIC(10,3),
    generosity NUMERIC(10,3),
    perceptions_of_corruption NUMERIC(10,3),
    dystopia_plus_residual NUMERIC(10,3)
);

-- Daten aus der CSV kopieren
-- Da die CSV im gleichen Ordner gemountet ist, findet Postgres sie unter /docker-entrypoint-initdb.d/
COPY world_happiness(year, rank_in_year, country, region, happiness_score, lower_whisker, upper_whisker, gdp_per_capita, social_support, healthy_life_expectancy, freedom_to_make_choices, generosity, perceptions_of_corruption, dystopia_plus_residual)
FROM '/docker-entrypoint-initdb.d/world_happiness_report_2005_2025.csv'
WITH (FORMAT csv, HEADER true, DELIMITER ',');