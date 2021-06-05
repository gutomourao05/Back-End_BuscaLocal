CREATE TABLE pessoa_fisica(
id int(4) AUTO_INCREMENT,
nome varchar(30) NOT NULL,
email varchar(50),
nascimento varchar(10),
sexo varchar(1),
senha varchar(100),
celular varchar(15),
PRIMARY KEY (id)
);

    CREATE TABLE pessoa_juridica(
    id int(4) AUTO_INCREMENT,
    nome_empresa varchar(30) NOT NULL,
    tipo_servico varchar(50),
    email varchar(50),
    celular varchar(15),
    longitude varchar(30),
    latitude varchar(30),
    PRIMARY KEY (id)
    );

CREATE TABLE IF NOT EXISTS enderecos(
id int(4) AUTO_INCREMENT,
cep varchar(15),
rua varchar(40),
bairro varchar(40),
cidade varchar(40),
fk_id_fisicas int(4),
fk_id_juridicas int(4),
FOREIGN KEY (fk_id_fisicas) REFERENCES pessoa_fisica(id),
FOREIGN KEY (fk_id_juridicas) REFERENCES pessoa_juridica(id),
PRIMARY KEY (id)
);