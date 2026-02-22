# Database Password Issue

The backend cannot connect because the password is incorrect.

## Get Your Correct Database Password

1. Go to: https://supabase.com/dashboard/project/dyscxlxkrvmjgdvhdyaq/settings/database
2. Look for "Database password" section
3. Click "Reset database password" if you don't remember it
4. Copy the new password

## Update .env File

Edit `backend/.env` and replace:
```
SUPABASE_DB_PASSWORD=sarthak verma
```

With your actual database password from Supabase.

## Then Restart Backend

```bash
cd backend
mvn spring-boot:run
```
