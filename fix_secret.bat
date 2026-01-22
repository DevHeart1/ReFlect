@echo off
if exist .env.example (
    powershell -Command "(Get-Content .env.example -Raw) -replace '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', 'your-groq-api-key-here' | Set-Content .env.example -NoNewline"
)
