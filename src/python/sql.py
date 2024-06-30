vacuum = 'VACUUM;'

drop_fts_table = 'DROP TABLE IF EXISTS words_fts;'

create_fts_table = '''
    CREATE VIRTUAL TABLE
        words_fts
    USING
        fts5 (episode, title, description, words);
'''

populate_fts_table = '''
    INSERT INTO
        words_fts (episode, title, description, words)
    SELECT
        w.episode,
        e.title,
        e.description,
        GROUP_CONCAT(w.word, "") AS words
    FROM
        words w,
        episodes e
    WHERE
        w.episode = e.episode
    GROUP BY
        w.episode;
'''

select_episode_duration = '''
    SELECT
        episode, duration
    FROM
        episodes
    WHERE
        episode = ?;
'''

select_word_count = '''
    SELECT
        COUNT(*)
    FROM
        words
    WHERE
        episode = ?
    GROUP BY
        episode;
'''

delete_words = '''
    DELETE FROM
        words
    WHERE
        episode = ?;
'''

reset_word_count = '''
    UPDATE
        episodes
    SET
        wordCount = 0
    WHERE
        episode = ?;
'''

upsert_episode = '''
    INSERT INTO
        episodes
    VALUES
        (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT
        (episode)
    DO UPDATE SET
        audio = excluded.audio,
        duration = excluded.duration,
        wordCount = excluded.wordCount;
'''

def insert_words(episode_num: int):
  return f'INSERT INTO words VALUES (?, ?, ?, ?, {episode_num})'