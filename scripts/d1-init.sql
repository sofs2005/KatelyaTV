-- KatelyaTV D1 Database Schema
-- Version: 2.0
-- Description: This script defines the complete schema for the KatelyaTV application,
-- ensuring compatibility with the latest application code.

-- Drop existing tables to start fresh
DROP TABLE IF EXISTS play_records;
DROP TABLE IF EXISTS favorites;
DROP TABLE IF EXISTS user_settings;
DROP TABLE IF EXISTS search_history;
DROP TABLE IF EXISTS skip_configs;
DROP TABLE IF EXISTS admin_configs;
DROP TABLE IF EXISTS users;

-- Users table to store user credentials and basic information
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Play records for tracking user's viewing history
CREATE TABLE play_records (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    record_key TEXT NOT NULL,
    title TEXT NOT NULL,
    source_name TEXT,
    cover_url TEXT,
    year TEXT,
    episode_index INTEGER,
    total_episodes INTEGER,
    current_time REAL,
    duration REAL,
    search_title TEXT,
    type TEXT, -- 'video' or 'audiobook'
    album_id TEXT,
    source TEXT,
    intro TEXT,
    video_url TEXT,
    episode_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE(user_id, record_key)
);

-- Favorites table for storing user's favorite videos/audiobooks
CREATE TABLE favorites (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    favorite_key TEXT NOT NULL,
    title TEXT NOT NULL,
    cover_url TEXT,
    video_url TEXT,
    rating TEXT,
    year TEXT,
    area TEXT,
    category TEXT,
    actors TEXT,
    director TEXT,
    description TEXT,
    source_name TEXT,
    total_episodes INTEGER,
    search_title TEXT,
    type TEXT, -- 'video' or 'audiobook'
    album_id TEXT,
    source TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE(user_id, favorite_key)
);

-- User settings
CREATE TABLE user_settings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    username TEXT NOT NULL,
    filter_adult_content INTEGER DEFAULT 1,
    theme TEXT DEFAULT 'auto',
    language TEXT DEFAULT 'zh-CN',
    auto_play INTEGER DEFAULT 1,
    video_quality TEXT DEFAULT 'auto',
    audiobook_playback_speed REAL DEFAULT 1.0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE(user_id, username)
);

-- Search history
CREATE TABLE search_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    keyword TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Skip configurations for episodes (opening/ending)
CREATE TABLE skip_configs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    config_key TEXT NOT NULL,
    source TEXT,
    title TEXT,
    segments TEXT, -- JSON array of skip segments
    start_time REAL,
    end_time REAL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE(user_id, config_key)
);

-- Admin configurations
CREATE TABLE admin_configs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    config_key TEXT NOT NULL UNIQUE,
    config_value TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_play_records_user_id ON play_records(user_id);
CREATE INDEX idx_favorites_user_id ON favorites(user_id);
CREATE INDEX idx_search_history_user_id ON search_history(user_id);
