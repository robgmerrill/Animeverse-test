set client_min_messages to warning;

-- DANGER: this is NOT how to do it in the real world.
-- `drop schema` INSTANTLY ERASES EVERYTHING.
drop schema "public" cascade;

create schema "public";

create table "animes" (
    "id"        serial PRIMARY KEY,
    "title"     text not null,
    "synopsis"  text not null,
    "image"     text not null,
    "episodes"  number not null,
    "score"     number not null
    "createdAt"   timestamptz not null DEFAULT now(),
    "updatedAt"   timestamptz not null DEFAULT now()
);

create table "users" (
    "id"        serial PRIMARY KEY,
    "username"     text not null,
    "password"  text not null,
    "createdAt"   timestamptz not null DEFAULT now(),
    "updatedAt"   timestamptz not null DEFAULT now()
);
