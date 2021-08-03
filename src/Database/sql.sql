    CREATE TABLE IF NOT EXISTS companies(
    id int(6) AUTO_INCREMENT,
    name_company varchar(30) NOT NULL,
    type_services varchar(70),
    show_type_services varchar(50),
    descriptionServices varchar(500),
    email varchar(50),
    phone varchar(15),
    longitude varchar(30),
    latitude varchar(30),
    PRIMARY KEY (id)
    );

CREATE TABLE IF NOT EXISTS address(
id int(6) AUTO_INCREMENT,
zip_code varchar(15),
road varchar(40),
district varchar(40),
city varchar(40),
number_place varchar(6)
fk_id_companies int(6),
FOREIGN KEY (fk_id_companies) REFERENCES companies(id),
PRIMARY KEY (id)
);