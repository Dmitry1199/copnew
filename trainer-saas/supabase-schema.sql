-- TrainerPro Database Schema for Supabase
-- Оптимізована версія з RLS та тригером на створення профілю

-- =============== TABLES ===============

-- Таблиця тренерів (id = auth.uid())
CREATE TABLE IF NOT EXISTS trainers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(), -- буде замінено тригером при signup
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
CREATE TABLE IF NOT EXISTS clients (
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
CREATE TABLE IF NOT EXISTS training_programs (
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
CREATE TABLE IF NOT EXISTS sessions (
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
CREATE TABLE IF NOT EXISTS payments (
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

-- =============== INDEXES ===============
CREATE INDEX IF NOT EXISTS idx_clients_trainer_id ON clients(trainer_id);
CREATE INDEX IF NOT EXISTS idx_training_programs_trainer_id ON training_programs(trainer_id);
CREATE INDEX IF NOT EXISTS idx_sessions_trainer_id ON sessions(trainer_id);
CREATE INDEX IF NOT EXISTS idx_payments_trainer_id ON payments(trainer_id);

-- =============== TRIGGERS ===============
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_trainers_updated_at BEFORE UPDATE ON trainers
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON clients
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============== RLS ENABLE ===============
ALTER TABLE trainers ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE training_programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- =============== RLS POLICIES ===============
-- TRAINERS
CREATE POLICY "Trainers can view own profile" ON trainers FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Trainers can update own profile" ON trainers FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Trainers can delete own profile" ON trainers FOR DELETE USING (auth.uid() = id);

-- CLIENTS
CREATE POLICY "Trainers can view own clients" ON clients FOR SELECT USING (trainer_id = auth.uid());
CREATE POLICY "Trainers can insert own clients" ON clients FOR INSERT WITH CHECK (trainer_id = auth.uid());
CREATE POLICY "Trainers can update own clients" ON clients FOR UPDATE USING (trainer_id = auth.uid());
CREATE POLICY "Trainers can delete own clients" ON clients FOR DELETE USING (trainer_id = auth.uid());

-- TRAINING PROGRAMS
CREATE POLICY "Trainers can view own programs" ON training_programs FOR SELECT USING (trainer_id = auth.uid());
CREATE POLICY "Trainers can insert own programs" ON training_programs FOR INSERT WITH CHECK (trainer_id = auth.uid());
CREATE POLICY "Trainers can update own programs" ON training_programs FOR UPDATE USING (trainer_id = auth.uid());
CREATE POLICY "Trainers can delete own programs" ON training_programs FOR DELETE USING (trainer_id = auth.uid());

-- SESSIONS
CREATE POLICY "Trainers can view own sessions" ON sessions FOR SELECT USING (trainer_id = auth.uid());
CREATE POLICY "Trainers can insert own sessions" ON sessions FOR INSERT WITH CHECK (trainer_id = auth.uid());
CREATE POLICY "Trainers can update own sessions" ON sessions FOR UPDATE USING (trainer_id = auth.uid());
CREATE POLICY "Trainers can delete own sessions" ON sessions FOR DELETE USING (trainer_id = auth.uid());

-- PAYMENTS
CREATE POLICY "Trainers can view own payments" ON payments FOR SELECT USING (trainer_id = auth.uid());
CREATE POLICY "Trainers can insert own payments" ON payments FOR INSERT WITH CHECK (trainer_id = auth.uid());
CREATE POLICY "Trainers can update own payments" ON payments FOR UPDATE USING (trainer_id = auth.uid());
CREATE POLICY "Trainers can delete own payments" ON payments FOR DELETE USING (trainer_id = auth.uid());

-- =============== TRIGGER: AUTO-CREATE TRAINER PROFILE ===============
CREATE OR REPLACE FUNCTION public.create_trainer_after_signup()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO trainers (id, email, first_name, last_name, created_at)
    VALUES (NEW.id, NEW.email, 'Новий', 'Тренер', NOW());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_create_trainer
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.create_trainer_after_signup();

-- =============== DEMO DATA ===============
INSERT INTO trainers (id, email, first_name, last_name, phone, bio) VALUES
('00000000-0000-0000-0000-000000000001', 'demo@trainerpro.com', 'Олексій', 'Тренер', '+380671234567', 'Сертифікований тренер');

INSERT INTO clients (trainer_id, first_name, last_name, email, phone) VALUES
('00000000-0000-0000-0000-000000000001', 'Марина', 'Коваленко', 'marina@email.com', '+380671234567'),
('00000000-0000-0000-0000-000000000001', 'Андрій', 'Петров', 'andrii@email.com', '+380952345678');
