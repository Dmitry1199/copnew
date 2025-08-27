-- TrainerPro Database Schema for Supabase
-- Run this in Supabase SQL Editor to create the database structure

-- Таблиця тренерів
CREATE TABLE trainers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    phone TEXT,
    bio TEXT,
    avatar_url TEXT,
    business_name TEXT,
    business_address TEXT,
    business_website TEXT,
    business_instagram TEXT,
    work_hours TEXT DEFAULT 'Пн-Пт: 07:00-22:00',
    liqpay_public_key TEXT,
    liqpay_private_key TEXT,
    default_currency TEXT DEFAULT 'UAH',
    timezone TEXT DEFAULT 'Europe/Kiev',
    language TEXT DEFAULT 'uk',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Таблиця клієнтів
CREATE TABLE clients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    trainer_id UUID NOT NULL REFERENCES trainers(id) ON DELETE CASCADE,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    date_of_birth DATE,
    gender TEXT CHECK (gender IN ('male', 'female', 'other')),
    emergency_contact TEXT,
    emergency_phone TEXT,
    medical_conditions TEXT,
    fitness_goals TEXT,
    experience_level TEXT DEFAULT 'beginner' CHECK (experience_level IN ('beginner', 'intermediate', 'advanced')),
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'archived')),
    notes TEXT,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Таблиця тренувальних програм
CREATE TABLE training_programs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    trainer_id UUID NOT NULL REFERENCES trainers(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL,
    difficulty TEXT DEFAULT 'beginner' CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
    duration_weeks INTEGER NOT NULL DEFAULT 4,
    exercises_count INTEGER DEFAULT 0,
    status TEXT DEFAULT 'draft' CHECK (status IN ('active', 'draft', 'archived')),
    price DECIMAL(10,2),
    currency TEXT DEFAULT 'UAH',
    cover_image_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Таблиця сесій (тренувань)
CREATE TABLE sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    trainer_id UUID NOT NULL REFERENCES trainers(id) ON DELETE CASCADE,
    client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    program_id UUID REFERENCES training_programs(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    description TEXT,
    scheduled_at TIMESTAMPTZ NOT NULL,
    duration_minutes INTEGER DEFAULT 60,
    status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'in_progress', 'completed', 'cancelled', 'no_show')),
    location TEXT,
    notes TEXT,
    client_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Таблиця платежів
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    trainer_id UUID NOT NULL REFERENCES trainers(id) ON DELETE CASCADE,
    client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    session_id UUID REFERENCES sessions(id) ON DELETE SET NULL,
    program_id UUID REFERENCES training_programs(id) ON DELETE SET NULL,
    amount DECIMAL(10,2) NOT NULL,
    currency TEXT DEFAULT 'UAH',
    description TEXT NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'cancelled', 'refunded')),
    payment_method TEXT DEFAULT 'liqpay' CHECK (payment_method IN ('liqpay', 'cash', 'bank_transfer', 'other')),
    liqpay_order_id TEXT,
    liqpay_transaction_id TEXT,
    due_date TIMESTAMPTZ,
    paid_at TIMESTAMPTZ,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Індекси для кращої продуктивності
CREATE INDEX idx_clients_trainer_id ON clients(trainer_id);
CREATE INDEX idx_training_programs_trainer_id ON training_programs(trainer_id);
CREATE INDEX idx_sessions_trainer_id ON sessions(trainer_id);
CREATE INDEX idx_payments_trainer_id ON payments(trainer_id);

-- Тригери для оновлення updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_trainers_updated_at BEFORE UPDATE ON trainers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON clients
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security
ALTER TABLE trainers ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE training_programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Політики RLS
CREATE POLICY "Trainers can view own profile" ON trainers
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Trainers can view own clients" ON clients
    FOR SELECT USING (trainer_id = auth.uid());

CREATE POLICY "Trainers can insert own clients" ON clients
    FOR INSERT WITH CHECK (trainer_id = auth.uid());

-- Демо дані
INSERT INTO trainers (id, email, first_name, last_name, phone, bio) VALUES
('00000000-0000-0000-0000-000000000001', 'demo@trainerpro.com', 'Олексій', 'Тренер', '+380 67 123 4567', 'Сертифікований тренер');

INSERT INTO clients (trainer_id, first_name, last_name, email, phone) VALUES
('00000000-0000-0000-0000-000000000001', 'Марина', 'Коваленко', 'marina@email.com', '+380 67 123 4567'),
('00000000-0000-0000-0000-000000000001', 'Андрій', 'Петров', 'andrii@email.com', '+380 95 234 5678');
