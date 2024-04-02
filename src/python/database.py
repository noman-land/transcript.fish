import sql
import sqlite3
from classes import RssEpisode, DbEpisode
from typing import Optional

con = sqlite3.connect('db/transcript.db')

with open('db/migrations.sql') as migrations:
    cur = con.cursor()
    cur.executescript(migrations.read())
    con.commit()

def recreate_fts_table():
    cur = con.cursor()
    cur.execute(sql.drop_fts_table)
    cur.execute(sql.create_fts_table)
    cur.execute(sql.populate_fts_table)
    con.commit()

def make_episode_row(episode: RssEpisode, word_count: int):
    return (
        episode.episode_num, # episode
        episode.title, # title
        episode.audio, # audio
        episode.link, # link
        episode.image, # image
        episode.duration, # duration
        episode.description, # description
        episode.pub_date, # pubDate
        episode.guid, # guid
        word_count, # wordCount
        None, # presenter1
        None, # presenter2
        None, # presenter3
        None, # presenter4
        None, # presenter5
        None, # venue
        None, # live
        None, # compilation
        None # event
    )

def vacuum():
    cur = con.cursor()
    cur.execute(sql.vacuum)
    cur = con.commit()

def select_episode(episode_num: int):
    cur = con.cursor()
    result = cur.execute(sql.select_episode_duration, [episode_num]).fetchone()
    return DbEpisode(result) if result else None

def select_word_count(episode_num: int) -> int:
    cur = con.cursor()
    result = cur.execute(sql.select_word_count, [episode_num]).fetchone()
    word_count = result[0] if result and result[0] > 0 else 0
    return word_count

def delete_transcription(episode_num: int):
    cur = con.cursor()
    cur.execute(sql.delete_words, [episode_num])
    cur.execute(sql.reset_word_count, [episode_num])

def insert_words(episode_num: int, words):
    cur = con.cursor()
    cur.executemany(sql.insert_words(episode_num), words)

def upsert_episode(episode: RssEpisode, word_count: int):
    cur = con.cursor()
    episode_row = make_episode_row(episode, word_count)
    cur.execute(sql.upsert_episode, episode_row)

def commit():
    con.commit()

def close(rebuild_fts: Optional[bool] = False):
    if rebuild_fts:
        recreate_fts_table()
        vacuum()
    con.close()
