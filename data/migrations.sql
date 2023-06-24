CREATE TABLE "episodes" (
  "episode" INTEGER NOT NULL UNIQUE,
  "title" TEXT,
  "audio" TEXT UNIQUE,
  "link" TEXT UNIQUE,
  "image" TEXT,
  "duration" INTEGER,
  "description" TEXT,
  "pubDate" TEXT,
  "guid" TEXT UNIQUE,
  "author" TEXT,
  "path" TEXT UNIQUE,
  PRIMARY KEY("episode")
);

CREATE TABLE "words" (
  "startTime" NUMERIC NOT NULL,
  "endTime" NUMERIC NOT NULL,
  "word" TEXT NOT NULL COLLATE NOCASE,
  "probability" NUMERIC NOT NULL,
  "episode" INTEGER NOT NULL,
  FOREIGN KEY("episode") REFERENCES "episodes"("episode")
);