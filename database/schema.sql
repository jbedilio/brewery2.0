DROP DATABASE beersDb;
CREATE DATABASE beersDB;

USE beersDb;

CREATE TABLE beer (

    `id` INT NOT NULL AUTO_INCREMENT,

    `beer` VARCHAR(100) NOT NULL,

    `chugged` BOOLEAN DEFAULT false,

    PRIMARY KEY (`id`)
);