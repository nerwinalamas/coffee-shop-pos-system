-- Create a simple test table
CREATE TABLE IF NOT EXISTS test_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  stock INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add index for faster queries
CREATE INDEX idx_test_products_name ON test_products(name);

-- Add some sample data
INSERT INTO test_products (name, price, stock) VALUES
  ('Espresso', 120.00, 50),
  ('Cappuccino', 150.00, 30),
  ('Latte', 160.00, 25);
