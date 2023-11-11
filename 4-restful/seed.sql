create table pets (
    id serial primary key,
    age integer,
    kind varchar,
    name varchar
);

insert into pets (age,kind,name)
    values (7,'dog','fido');
insert into pets (age,kind,name)
    values (5,'snake','buttons');