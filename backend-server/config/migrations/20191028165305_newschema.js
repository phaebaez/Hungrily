
const upSQL = 
`
DROP TABLE IF EXISTS FranchiseOwner CASCADE; 
DROP TABLE IF EXISTS Restaurant CASCADE;
DROP TABLE IF EXISTS Food CASCADE;
DROP TABLE IF EXISTS Tables CASCADE;
DROP TABLE IF EXISTS Customer CASCADE;
DROP TABLE IF EXISTS Reservation Cascade; 
DROP TABLE IF EXISTS Account Cascade; 
DROP TABLE IF EXISTS Special_Operating_Hrs Cascade;
DROP TABLE IF EXISTS Customer_voucher Cascade; 
DROP TABLE IF EXISTS Possible_voucher Cascade;
DROP TABLE IF EXISTS Ratings Cascade; 

CREATE TABLE Account(
    UserID varchar(100) PRIMARY KEY,
    Password varchar(60) NOT NULL
);

CREATE TABLE FranchiseOwner (
    UserID varchar(100) PRIMARY KEY REFERENCES Account ON DELETE CASCADE,
    FNAME varchar(100)
);

CREATE TABLE Restaurant (
    Store_Name varchar(100),
    Location varchar(100),
    UserID varchar(100), 
    Capacity integer NOT NULL,
    Area varchar(100) NOT NULL,
    Opening_hours time NOT NULL default '09:00:00', 
    Closing_hours time NOT NULL default '21:00:00', 
    url varchar(300) UNIQUE NOT NULL ,
    PRIMARY KEY (Location, UserID),
    FOREIGN KEY (UserID) REFERENCES FranchiseOwner ON DELETE CASCADE
);

CREATE TABLE Food (
    Location varchar(100) NOT NULL,
    UserID varchar(100) NOT NULL,
    Name varchar(100),
    Cuisine varchar(100),
    Type varchar(100),
    Price real NOT NULL CHECK (Price >= 0), 
    PRIMARY KEY (Name, Location, UserID), -- is this correct? 
    FOREIGN KEY (Location, UserID) REFERENCES Restaurant ON DELETE CASCADE
);

CREATE TABLE Tables (
    Location varchar(100) NOT NULL,
    UserID varchar(100) NOT NULL,
    TableNum integer,
    Capacity integer NOT NULL CHECK (Capacity >= 0), 
    PRIMARY KEY (TableNum, Location, UserID), -- is this correct? 
    FOREIGN KEY (Location, UserID) REFERENCES Restaurant ON DELETE CASCADE
);

CREATE TABLE Special_Operating_Hrs (
    Location varchar(100) NOT NULL,
    UserID varchar(100) NOT NULL,
    Day_of_week integer, 
    Opening_hours time NOT NULL,
    Closing_hours time NOT NULL, 
    PRIMARY KEY (Day_of_week, Location, UserID),
    FOREIGN KEY (Location, UserID) REFERENCES Restaurant ON DELETE CASCADE,
    CHECK (Day_of_week >= 0 and Day_of_week <= 6), 
    CHECK (Opening_hours < Closing_hours )
);

CREATE TABLE Customer ( 
    UserID varchar(100) PRIMARY KEY REFERENCES Account ON DELETE CASCADE,
    Name varchar(100) NOT NULL, -- the name does not have to be primary key anymore right? 
    Points integer NOT NULL DEFAULT 0
    CHECK (Points >=0 )
);

CREATE TABLE Possible_voucher (
    Voucher_code varchar(30) PRIMARY KEY,
    Discount int,
    Description Character(1000),
    Cost int NOT NULL
    CHECK(Discount > 0 AND Discount <=100)
);

CREATE TABLE Customer_voucher (
    Voucher_code varchar(30) REFERENCES Possible_voucher ON DELETE CASCADE, 
    UserID varchar(100) REFERENCES Customer ON DELETE CASCADE,
    Is_used boolean DEFAULT FALSE,
    SerialNum uuid DEFAULT uuid_generate_v1(), --to handle multiple instances of the same voucher
    PRIMARY KEY (Voucher_code, UserID, SerialNum) -- Help check cos it has 2 owning entity
);

CREATE TABLE Reservation (
    Customer_UserID varchar(100) REFERENCES Customer ON DELETE CASCADE,
    TableNum integer,
    Location varchar(100),
    Restaurant_UserID varchar(100), 
    Pax integer NOT NULL,
    DateTime timestamp with time zone NOT NULL,
    Rating integer,
    PRIMARY KEY (Customer_UserID, Restaurant_UserID, TableNum, Location, DateTime),
    FOREIGN KEY (TableNum, Location, Restaurant_UserID) REFERENCES Tables,
    CHECK ((Rating >= 0 and Rating <= 5) or Rating IS NULL)
);


CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE OR REPLACE FUNCTION test(x timestamp) RETURNS void AS $test$
    DECLARE
        dayofweek integer := EXTRACT(DOW FROM x);
        dateofbooking timestamp := date_trunc('day', x);
        sometime time := make_time(1, 0, 0);
    BEGIN
        RAISE NOTICE 'DAy: (%)', dayofweek;
        RAISE NOTICE 'test called(%)', dateofbooking;
        RAISE NOTICE 'test called(%)', (dateofbooking+sometime);
    END;
$test$ LANGUAGE plpgsql;

`
const downSQL =
`
DROP TABLE IF EXISTS FranchiseOwner CASCADE; 
DROP TABLE IF EXISTS Restaurant CASCADE;
DROP TABLE IF EXISTS Food CASCADE;
DROP TABLE IF EXISTS Tables CASCADE;
DROP TABLE IF EXISTS Customer CASCADE;
DROP TABLE IF EXISTS Reservation Cascade; 
DROP TABLE IF EXISTS Account Cascade; 
DROP TABLE IF EXISTS Special_Operating_Hrs Cascade;
DROP TABLE IF EXISTS Customer_voucher Cascade; 
DROP TABLE IF EXISTS Possible_voucher Cascade;
DROP TABLE IF EXISTS Ratings Cascade; 
DROP FUNCTION IF EXISTS test;
DROP FUNCTION IF EXISTS attemptReserve;
`
exports.up = function(knex) {
    return knex.schema
    .dropTableIfExists('Booking')
    .dropTableIfExists('Customer')
    .dropTableIfExists('Seating')
    .dropTableIfExists('Seating')
    .dropTableIfExists('Food')
    .dropTableIfExists('Restaurant')
    .dropTableIfExists('Area')
    .dropTableIfExists('Franchisor') //These statements remove the old knex stuff
    .raw(upSQL);
};

exports.down = function(knex) {
    return knex.schema
    .raw(downSQL);
};
