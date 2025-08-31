$body = '{"text":"一只可爱的猫咪","type":"image","width":1024,"height":1024,"nologo":true}'

try {
    $response = Invoke-RestMethod -Uri "https://text2image-api.peyoba660703.workers.dev/api/generate" -Method Post -ContentType "application/json" -Body $body
    Write-Host "Success! Response type: $($response.type)"
    if ($response.data) {
        Write-Host "Data length: $($response.data.Length) characters"
    }
} catch {
    Write-Host "Failed: $($_.Exception.Message)"
}
