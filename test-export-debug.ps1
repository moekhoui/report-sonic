try {
    Write-Host "🧪 Testing export API..." -ForegroundColor Yellow
    
    $body = @{
        report = @{
            name = "test-debug.xlsx"
            analysis = @{
                summary = "Test summary for debugging"
                insights = @("Test insight 1", "Test insight 2")
            }
        }
        rawData = @(
            @("Name", "Value"),
            @("A", 1),
            @("B", 2)
        )
        headers = @("Name", "Value")
        format = "pdf"
    } | ConvertTo-Json -Depth 10
    
    Write-Host "📤 Sending request..." -ForegroundColor Blue
    
    $response = Invoke-RestMethod -Uri "http://localhost:3000/api/reports/export" -Method POST -ContentType "application/json" -Body $body -OutFile "test-debug.pdf"
    
    Write-Host "✅ Export successful!" -ForegroundColor Green
    Write-Host "File saved as test-debug.pdf" -ForegroundColor Green
    
    if (Test-Path "test-debug.pdf") {
        $fileSize = (Get-Item "test-debug.pdf").Length
        Write-Host "📊 File size: $fileSize bytes" -ForegroundColor Cyan
    }
    
} catch {
    Write-Host "❌ Export failed:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    
    if ($_.Exception.Response) {
        $statusCode = $_.Exception.Response.StatusCode
        Write-Host "📊 Status Code: $statusCode" -ForegroundColor Yellow
    }
}
