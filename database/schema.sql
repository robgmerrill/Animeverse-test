set client_min_messages to warning;

-- DANGER: this is NOT how to do it in the real world.
-- `drop schema` INSTANTLY ERASES EVERYTHING.
drop schema "public" cascade;

create schema "public";

create table "todos" (
    "todoId"      serial PRIMARY KEY,
    "task"        text not null,
    "isCompleted" boolean not null,
    "createdAt"   timestamptz not null DEFAULT now(),
    "updatedAt"   timestamptz not null DEFAULT now()
);
