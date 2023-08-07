PRAGMA page_size = 16384;

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
  "wordCount" INTEGER,
  PRIMARY KEY ("episode")
);

CREATE UNIQUE INDEX "episodes_episode" ON "episodes" ("episode");

CREATE TABLE "words" (
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

CREATE INDEX "words_episode" ON "words" ("episode");

CREATE INDEX "words_startTime" ON "words" ("startTime");

CREATE INDEX "words_endTime" ON "words" ("endTime");

CREATE INDEX "words_word" ON "words" ("word");

CREATE UNIQUE INDEX "words_unique" ON "words" (
  "episode",
  "startTime",
  "endTime",
  "word",
  "probability"
);