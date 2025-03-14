-- Drop tables if they exist (in reverse order of dependencies)
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS payments CASCADE;
DROP TABLE IF EXISTS appointment_services CASCADE;
DROP TABLE IF EXISTS appointments CASCADE;
DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS services CASCADE;
DROP TABLE IF EXISTS barbers CASCADE;
DROP TABLE IF EXISTS auth_tokens CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS roles CASCADE;

-- Create roles table
CREATE TABLE IF NOT EXISTS roles (
    id SERIAL PRIMARY KEY,
    role_type VARCHAR(50) NOT NULL UNIQUE
);

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL UNIQUE,  
    email VARCHAR(255) NOT NULL UNIQUE,
    coins INT NOT NULL DEFAULT 0,
    name VARCHAR(255),
    last_login TIMESTAMP,
    phone_number VARCHAR(50) DEFAULT '',
    address VARCHAR(255),
    role_id INT REFERENCES roles(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create auth_tokens table
CREATE TABLE IF NOT EXISTS auth_tokens (
    id SERIAL PRIMARY KEY,
    auth_token VARCHAR(255) NOT NULL,
    token_expiry TIMESTAMP NOT NULL
);

-- Create barbers table
CREATE TABLE IF NOT EXISTS barbers (
    id SERIAL PRIMARY KEY,
    barber_id VARCHAR(255) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE
);

-- Create services table (Note: MongoDB uses "Service" but your API is looking for "service")
CREATE TABLE IF NOT EXISTS services (
    id SERIAL PRIMARY KEY,
    service_name VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    price DECIMAL(10, 2) NOT NULL     -- MongoDB stores in cents, PSQL can use decimal
);

-- Alias "service" table to maintain backward compatibility with existing code
CREATE VIEW service AS SELECT * FROM services;

-- Create appointments table
CREATE TABLE IF NOT EXISTS appointments (
    id SERIAL PRIMARY KEY,
    date TIMESTAMP NOT NULL,
    user_id VARCHAR(255) REFERENCES users(user_id) ON DELETE CASCADE,
    barber_id VARCHAR(255) NOT NULL REFERENCES barbers(barber_id) ON DELETE CASCADE,
    guest_name VARCHAR(255),          -- From nested guestDetails
    guest_email VARCHAR(255),         -- From nested guestDetails
    guest_phone VARCHAR(50),          -- From nested guestDetails
    guest_address VARCHAR(255)        -- From nested guestDetails
);

-- Create appointment_services junction table (for the many-to-many relationship)
CREATE TABLE IF NOT EXISTS appointment_services (
    appointment_id INT REFERENCES appointments(id) ON DELETE CASCADE,
    service_id INT REFERENCES services(id) ON DELETE CASCADE,
    PRIMARY KEY (appointment_id, service_id)
);

-- Create payments table
CREATE TABLE IF NOT EXISTS payments (
    id SERIAL PRIMARY KEY,
    payment_id VARCHAR(255) NOT NULL UNIQUE,
    payment_method VARCHAR(50) NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    payment_status VARCHAR(50) NOT NULL,
    appointment_id INT REFERENCES appointments(id) ON DELETE CASCADE
);

-- Create reviews table
CREATE TABLE IF NOT EXISTS reviews (
    id SERIAL PRIMARY KEY,
    review_id VARCHAR(255) NOT NULL UNIQUE,
    review_date TIMESTAMP NOT NULL,
    review TEXT NOT NULL,
    user_id VARCHAR(255) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
    id SERIAL PRIMARY KEY,
    notification_id VARCHAR(255) NOT NULL UNIQUE,
    message TEXT NOT NULL,
    scheduled_time TIMESTAMP NOT NULL,
    user_id VARCHAR(255) REFERENCES users(user_id) ON DELETE CASCADE,
    appointment_id INT REFERENCES appointments(id) ON DELETE CASCADE
);