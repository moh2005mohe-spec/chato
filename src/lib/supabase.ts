/// <reference types="vite/client" />
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * SUPABASE SQL TABLES SCHEMA REQUIRED FOR CHATO:
 * 
 * Run these SQL queries in your Supabase SQL Editor:
 * 
 * 1. PROFILES TABLE:
 * create table public.profiles (
 *   id uuid primary key default gen_random_uuid(),
 *   clerk_id text unique not null,
 *   name text not null,
 *   avatar text,
 *   native_language text not null,
 *   target_language text not null,
 *   country text not null,
 *   desired_countries text[] default '{}',
 *   interests text[] default '{}',
 *   bio text,
 *   created_at timestamp with time zone default timezone('utc'::text, now()) not null
 * );
 * 
 * 2. MESSAGES TABLE:
 * create table public.messages (
 *   id uuid primary key default gen_random_uuid(),
 *   room_id text not null,
 *   sender_id text not null,
 *   sender_name text not null,
 *   sender_avatar text,
 *   text text not null,
 *   corrected_text text,
 *   correction_explanation text,
 *   created_at timestamp with time zone default timezone('utc'::text, now()) not null
 * );
 * 
 * 3. MATCHES TABLE:
 * create table public.matches (
 *   id uuid primary key default gen_random_uuid(),
 *   user_id_1 text not null,
 *   user_id_2 text not null,
 *   language_pair text not null,
 *   status text default 'active',
 *   created_at timestamp with time zone default timezone('utc'::text, now()) not null
 * );
 */
