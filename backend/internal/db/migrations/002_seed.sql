INSERT INTO users (id, name, email, role)
VALUES
  ('00000000-0000-0000-0000-000000000001', 'Kristian', 'kristian@example.com', 'Primary on-call engineer'),
  ('00000000-0000-0000-0000-000000000002', 'Maya', 'maya@example.com', 'Secondary engineer'),
  ('00000000-0000-0000-0000-000000000003', 'Sam', 'sam@example.com', 'Engineering manager');

INSERT INTO shifts (id, user_id, starts_at, ends_at, role)
VALUES
  (
    '10000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000001',
    now() - interval '1 hour',
    now() + interval '8 hours',
    'Primary on-call'
  );
