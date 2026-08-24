$kvUrl = "https://up-gopher-78213.upstash.io"
$kvToken = "gQAAAAAAATGFAAIgcDJkNTM1MDMxMmQxYTg0YzIzOWFiMWRmNGQzYmY1MGFmMA"

$jsonFile = Join-Path -Path $PSScriptRoot -ChildPath "..\data\db.json"
$fileContent = [System.IO.File]::ReadAllText($jsonFile)

Write-Host "Syncing data/db.json to Upstash Cloud Redis..." -ForegroundColor Cyan

$command = @("SET", "phq_database", $fileContent)
$bodyJson = ConvertTo-Json -Compress -InputObject $command

$headers = @{
    "Authorization" = "Bearer $kvToken"
    "Content-Type"  = "application/json"
}

try {
    $response = Invoke-RestMethod -Uri "$kvUrl/" -Method Post -Headers $headers -Body $bodyJson
    Write-Host "Upstash Cloud Response: $($response | ConvertTo-Json -Compress)" -ForegroundColor Green
    Write-Host "✅ Database successfully updated in the Cloud and live on Vercel!" -ForegroundColor Green
} catch {
    Write-Host "Error updating cloud database: $_" -ForegroundColor Red
}
