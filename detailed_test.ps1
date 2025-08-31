$body = '{"text":"一只可爱的猫咪","type":"image","width":1024,"height":1024,"nologo":true}'

Write-Host "Testing API endpoint..."
Write-Host "URL: https://text2image-api.peyoba660703.workers.dev/api/generate"
Write-Host "Body: $body"
Write-Host ""

try {
    $response = Invoke-WebRequest -Uri "https://text2image-api.peyoba660703.workers.dev/api/generate" -Method Post -ContentType "application/json" -Body $body -TimeoutSec 30
    Write-Host "Status Code: $($response.StatusCode)"
    Write-Host "Status Description: $($response.StatusDescription)"
    
    $jsonResponse = $response.Content | ConvertFrom-Json
    Write-Host "Response Type: $($jsonResponse.type)"
    if ($jsonResponse.data) {
        Write-Host "Success! Data length: $($jsonResponse.data.Length) characters"
    } else {
        Write-Host "No data received"
    }
} catch {
    Write-Host "Error occurred:"
    Write-Host "  Message: $($_.Exception.Message)"
    if ($_.Exception.Response) {
        Write-Host "  Status Code: $($_.Exception.Response.StatusCode.value__)"
        Write-Host "  Status Description: $($_.Exception.Response.StatusDescription)"
        try {
            $errorStream = $_.Exception.Response.GetResponseStream()
            $reader = New-Object System.IO.StreamReader($errorStream)
            $errorContent = $reader.ReadToEnd()
            Write-Host "  Error Content: $errorContent"
        } catch {
            Write-Host "  Could not read error content"
        }
    }
}
