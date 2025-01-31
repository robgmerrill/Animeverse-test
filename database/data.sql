-- Use SQL insert statements to add any
-- starting/dummy data to your database tables

-- EXAMPLE:

 insert into "animeDetails" ("title", "synopsis", "image", "episodes", "score")
   values
     ('Learn to code', false, false, 0, 0),
     ('Build projects', false, false, 0, 0),
     ('Get a job', false, false, 0, 0);

  insert into "users" ("username", "password")
    values
     ('Learn to code', false),
     ('Build projects', false),
     ('Get a job', false);
