$body = @{
    text = "一只可爱的猫咪"
    type = "image" 
    width = 1024
    height = 1024
    nologo = $true
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "https://text2image-api.peyoba660703.workers.dev/api/generate" -Method Post -ContentType "application/json" -Body $body
    Write-Host "API调用成功！"
    Write-Host "响应类型: $($response.type)"
    Write-Host "格式: $($response.format)"
    Write-Host "内容类型: $($response.content_type)"
    if ($response.data) {
        Write-Host "数据长度: $($response.data.Length) 字符"
    }
} catch {
    Write-Host "API调用失败: $($_.Exception.Message)"
    if ($_.Exception.Response) {
        $errorResponse = $_.Exception.Response.GetResponseStream()
        $reader = New-Object System.IO.StreamReader($errorResponse)
        $errorBody = $reader.ReadToEnd()
        Write-Host "Error details: $errorBody"
    }
}
