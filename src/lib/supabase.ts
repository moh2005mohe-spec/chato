/// <reference types="vite/client" />
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://aqhnassfxncfvswahpua.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFxaG5hc3NmeG5jZnZzd2FocHVhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg2MTMxODUsImV4cCI6MjEwNDE4OTE4NX0.4DpGd87QqfEOk8yYbNoT8mohnWoBcAZNucg-YLf8pEA';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * ====================================================================
 * SUPABASE SQL SCHEMA FOR CHATO (PROFILES, SESSIONS, TOKENS, MESSAGES, VOICE)
 * ====================================================================
 * 
 * Run the following SQL queries in your Supabase SQL Editor:
 * 
 * 1. SESSIONS & AUTH TOKENS TABLE:
 * create table public.user_sessions (
 *   id uuid primary key default gen_random_uuid(),
 *   clerk_id text unique not null,
 *   access_token text,
 *   refresh_token text,
 *   session_data jsonb default '{}'::jsonb,
 *   expires_at timestamp with time zone,
 *   updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
 *   created_at timestamp with time zone default timezone('utc'::text, now()) not null
 * );
 * 
 * 2. PROFILES TABLE:
 * create table public.profiles (
 *   id uuid primary key default gen_random_uuid(),
 *   clerk_id text unique not null,
 *   name text not null,
 *   avatar text,
 *   native_language jsonb not null,
 *   target_language jsonb not null,
 *   country text not null,
 *   desired_countries text[] default '{}',
 *   interests text[] default '{}',
 *   bio text,
 *   created_at timestamp with time zone default timezone('utc'::text, now()) not null
 * );
 * 
 * 3. MESSAGES TABLE (Supports Text, Corrections, & Voice Audio URLs):
 * create table public.messages (
 *   id uuid primary key default gen_random_uuid(),
 *   room_id text not null,
 *   sender_id text not null,
 *   sender_name text not null,
 *   sender_avatar text,
 *   text text not null,
 *   audio_url text, -- For voice messages
 *   corrected_text text,
 *   correction_explanation text,
 *   created_at timestamp with time zone default timezone('utc'::text, now()) not null
 * );
 * 
 * 4. MATCHES TABLE:
 * create table public.matches (
 *   id uuid primary key default gen_random_uuid(),
 *   user_id_1 text not null,
 *   user_id_2 text not null,
 *   language_pair text not null,
 *   status text default 'active',
 *   created_at timestamp with time zone default timezone('utc'::text, now()) not null
 * );
 */
