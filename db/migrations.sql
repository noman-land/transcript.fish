PRAGMA page_size = 16384;

CREATE TABLE IF NOT EXISTS "episodes" (
  "episode" INTEGER NOT NULL UNIQUE,
  "title" TEXT,
  "audio" TEXT UNIQUE,
  "link" TEXT UNIQUE,
  "image" TEXT,
  "duration" INTEGER,
  "description" TEXT,
  "pubDate" TEXT,
  "guid" TEXT UNIQUE,
  "wordCount" INTEGER,
  "presenter1" INTEGER,
  "presenter2" INTEGER,
  "presenter3" INTEGER,
  "presenter4" INTEGER,
  "presenter5" INTEGER,
  "venue" INTEGER,
  "live" INTEGER,
  "compilation" INTEGER,
  "event" INTEGER,
  FOREIGN KEY("presenter1") REFERENCES "presenters"("id"),
  FOREIGN KEY("presenter2") REFERENCES "presenters"("id"),
  FOREIGN KEY("presenter3") REFERENCES "presenters"("id"),
  FOREIGN KEY("presenter4") REFERENCES "presenters"("id"),
  FOREIGN KEY("presenter5") REFERENCES "presenters"("id"),
  FOREIGN KEY("venue") REFERENCES "venues"("id"),
  FOREIGN KEY("event") REFERENCES "events"("id"),
  PRIMARY KEY("episode")
);

CREATE UNIQUE INDEX IF NOT EXISTS "episodes_episode" ON "episodes" ("episode");

CREATE TABLE IF NOT EXISTS "events" (
  "id" INTEGER NOT NULL UNIQUE,
  "name" TEXT NOT NULL,
  "city" TEXT NOT NULL,
  "country" TEXT NOT NULL,
  PRIMARY KEY("id" AUTOINCREMENT)
);

CREATE UNIQUE INDEX IF NOT EXISTS "events_index" ON "events" ("id");

CREATE TABLE IF NOT EXISTS "presenters" (
  "id" INTEGER NOT NULL UNIQUE,
  "firstName" TEXT NOT NULL,
  "middleName" TEXT,
  "lastName" TEXT NOT NULL,
  "qiElf" INTEGER,
  "guest" INTEGER,
  PRIMARY KEY("id" AUTOINCREMENT),
  UNIQUE("firstName", "middleName", "lastName")
);

CREATE UNIQUE INDEX IF NOT EXISTS "presenters_index" ON "presenters" (
  "firstName",
  "middleName",
  "lastName",
  "qiElf",
  "guest"
);

CREATE TABLE IF NOT EXISTS "venues" (
  "id" INTEGER NOT NULL UNIQUE,
  "name" TEXT,
  "streetAddress" TEXT,
  "region" TEXT,
  "city" TEXT,
  "state" TEXT,
  "country" TEXT,
  PRIMARY KEY("id" AUTOINCREMENT)
);

CREATE UNIQUE INDEX IF NOT EXISTS "venues_index" ON "venues" ("id");

CREATE TABLE IF NOT EXISTS "words" (
  "startTime" NUMERIC NOT NULL,
  "endTime" NUMERIC NOT NULL,
  "word" TEXT NOT NULL COLLATE NOCASE,
  "probability" NUMERIC NOT NULL,
  "episode" INTEGER NOT NULL,
  PRIMARY KEY (
    "episode",
    "startTime",
    "endTime",
    "word",
    "probability"
  ),
  FOREIGN KEY ("episode") REFERENCES "episodes" ("episode")
);

CREATE INDEX IF NOT EXISTS "words_episode" ON "words" ("episode");

CREATE INDEX IF NOT EXISTS "words_startTime" ON "words" ("startTime");

CREATE INDEX IF NOT EXISTS "words_endTime" ON "words" ("endTime");

CREATE INDEX IF NOT EXISTS "words_word" ON "words" ("word");

CREATE UNIQUE INDEX IF NOT EXISTS "words_unique" ON "words" (
  "episode",
  "startTime",
  "endTime",
  "word",
  "probability"
);