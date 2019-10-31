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
    UserID uuid PRIMARY KEY,
    Password text NOT NULL
);

CREATE TABLE FranchiseOwner (
    UserID uuid PRIMARY KEY REFERENCES Account ON DELETE CASCADE,
    FNAME varchar(100)
);

CREATE TABLE Restaurant (
    Location varchar(100),
    UserID uuid, 
    Capacity integer NOT NULL,
    Area varchar(100) NOT NULL,
    Opening_hours time NOT NULL default '09:00:00', 
    Closing_hours time NOT NULL default '21:00:00', 
    PRIMARY KEY (Location, UserID),
    FOREIGN KEY (UserID) REFERENCES FranchiseOwner ON DELETE CASCADE
);

CREATE TABLE Food (
    Location varchar(100) NOT NULL,
    UserID uuid NOT NULL,
    Name varchar(100),
    Cuisine varchar(100),
    Type varchar(100),
    Price real NOT NULL CHECK (Price >= 0), 
    PRIMARY KEY (Name, Location, UserID), -- is this correct? 
    FOREIGN KEY (Location, UserID) REFERENCES Restaurant ON DELETE CASCADE
);

CREATE TABLE Tables (
    Location varchar(100) NOT NULL,
    UserID uuid NOT NULL,
    TableNum integer,
    Capacity integer NOT NULL CHECK (Capacity >= 0), 
    PRIMARY KEY (TableNum, Location, UserID), -- is this correct? 
    FOREIGN KEY (Location, UserID) REFERENCES Restaurant ON DELETE CASCADE
);

CREATE TABLE Special_Operating_Hrs (
    Location varchar(100) NOT NULL,
    UserID uuid NOT NULL,
    Day_of_week integer, 
    Opening_hours time NOT NULL,
    Closing_hours time NOT NULL, 
    PRIMARY KEY (Day_of_week, Location, UserID),
    FOREIGN KEY (Location, UserID) REFERENCES Restaurant ON DELETE CASCADE
);

CREATE TABLE Customer ( 
    UserID uuid PRIMARY KEY REFERENCES Account ON DELETE CASCADE,
    Name varchar(100) NOT NULL, -- the name does not have to be primary key anymore right? 
    Points integer 
);

CREATE TABLE Possible_voucher (
    Voucher_code uuid PRIMARY KEY,
    Description Character(1000),
    Cost real NOT NULL
);

CREATE TABLE Customer_voucher (
    Voucher_code uuid REFERENCES Possible_voucher ON DELETE CASCADE, 
    UserID uuid REFERENCES Customer ON DELETE CASCADE,
    SerialNum varchar(100),
    Is_used boolean DEFAULT FALSE,
    PRIMARY KEY (Voucher_code, UserID, SerialNum) -- Help check cos it has 2 owning entity
);

CREATE TABLE Reservation (
    Customer_UserID uuid REFERENCES Customer ON DELETE CASCADE,
    TableNum integer,
    Location varchar(100),
    Restaurant_UserID uuid, 
    Pax integer NOT NULL,
    DateTime time NOT NULL,
    PRIMARY KEY (Customer_UserID, Restaurant_UserID, TableNum, Location),
    FOREIGN KEY (TableNum, Location, Restaurant_UserID) REFERENCES Tables
);

CREATE TABLE Ratings (
    Rating integer PRIMARY KEY,
    CHECK (Rating >= 0 and Rating <= 5)
);