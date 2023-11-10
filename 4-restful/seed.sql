create table pets (
    id serial primary key,
    age integer,
    type varchar,
    name varchar
);

insert into pets (age,type,name)
    values (7,'dog','fido');
insert into pets (age,type,name)
    values (5,'snake','buttons');