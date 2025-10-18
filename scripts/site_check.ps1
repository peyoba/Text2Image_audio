Param(
  [string]$TargetDir
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

if (-not $TargetDir) {
  $TargetDir = Join-Path $PSScriptRoot '..' | Resolve-Path | ForEach-Object { $_.Path }
  $TargetDir = Join-Path $TargetDir 'frontend'
}

if (-not (Test-Path $TargetDir)) {
  Write-Error "Target directory not found: $TargetDir"
  exit 1
}

$htmlFiles = Get-ChildItem -Path $TargetDir -Filter '*.html' -File

# Collections for results
$brokenLinks = @{}
$jsonLdErrors = @{}
$metaMissing = @{}

$requiredOg = @('og:type','og:title','og:description','og:url','og:image')
$requiredTw = @('twitter:card','twitter:title','twitter:description','twitter:image')
$mustCheckMeta = @('blog.html','blog_ai_guide.html','blog_prompt_engineering.html','blog_tutorial.html','blog_faq.html')

foreach ($file in $htmlFiles) {
$content = Get-Content -Path $file.FullName -Raw -Encoding UTF8

  # 1) Internal anchor links
  $hrefMatches = [regex]::Matches($content, '<a\s+[^>]*?href\s*=\s*"([^"]+)"', [System.Text.RegularExpressions.RegexOptions]::IgnoreCase)
  foreach ($m in $hrefMatches) {
    $href = $m.Groups[1].Value
    if ([string]::IsNullOrWhiteSpace($href)) { continue }
    if ($href -match '^(#|mailto:|tel:|javascript:|https?://)') { continue }

    $clean = $href -replace '\?.*$', '' -replace '#.*$', ''
    if ([string]::IsNullOrWhiteSpace($clean)) { continue }

    if ($clean.StartsWith('/')) {
      $targetPath = Join-Path $TargetDir ($clean.TrimStart('/'))
    } else {
      $targetPath = Join-Path $file.DirectoryName $clean
    }

    if (-not (Test-Path -Path $targetPath)) {
      if (-not $brokenLinks.ContainsKey($file.FullName)) { $brokenLinks[$file.FullName] = @() }
      $brokenLinks[$file.FullName] += $href
    }
  }

  # 2) JSON-LD validation
  $jsonLdMatches = [regex]::Matches($content, '<script\s+[^>]*type\s*=\s*"application/ld\+json"[^>]*>([\s\S]*?)</script>', [System.Text.RegularExpressions.RegexOptions]::IgnoreCase)
  foreach ($j in $jsonLdMatches) {
    $jsonText = $j.Groups[1].Value.Trim()
    if (-not [string]::IsNullOrWhiteSpace($jsonText)) {
      try { $null = $jsonText | ConvertFrom-Json -ErrorAction Stop } catch {
        if (-not $jsonLdErrors.ContainsKey($file.FullName)) { $jsonLdErrors[$file.FullName] = @() }
        $jsonLdErrors[$file.FullName] += $_.Exception.Message
      }
    }
  }

  # 3) OG/Twitter meta tags for specific pages
  if ($mustCheckMeta -contains $file.Name) {
    $missing = @()
    foreach ($p in $requiredOg) {
      if ($content -notmatch ('property\s*=\s*"' + [regex]::Escape($p) + '"')) { $missing += $p }
    }
    foreach ($p in $requiredTw) {
      if ($content -notmatch ('name\s*=\s*"' + [regex]::Escape($p) + '"')) { $missing += $p }
    }
    if ($missing.Count -gt 0) { $metaMissing[$file.FullName] = $missing }
  }
}

# 4) XML validation for sitemap.xml and rss.xml
$xmlFilesToCheck = @('sitemap.xml','rss.xml') | ForEach-Object { Join-Path $TargetDir $_ }
$xmlResults = @()
foreach ($x in $xmlFilesToCheck) {
  if (-not (Test-Path $x)) { $xmlResults += "MISSING: $x"; continue }
  try { [xml]$loaded = Get-Content -Path $x -Raw -Encoding UTF8; $xmlResults += "OK: $x" } catch { $xmlResults += "ERROR: $x -> $($_.Exception.Message)" }
}

# Output summary
Write-Host "--- Site Check Summary ---"
Write-Host "Scanned HTML files:`t$($htmlFiles.Count)"

Write-Host "Broken internal links files:`t$($brokenLinks.Keys.Count)"
foreach ($k in $brokenLinks.Keys) {
  $list = ($brokenLinks[$k] | Select-Object -Unique) -join ', '
  Write-Host "  - $k" -ForegroundColor Yellow
  Write-Host "    -> $list"
}

Write-Host "JSON-LD errors files:`t$($jsonLdErrors.Keys.Count)"
foreach ($k in $jsonLdErrors.Keys) {
  Write-Host "  - $k" -ForegroundColor Yellow
  ($jsonLdErrors[$k] | Select-Object -Unique) | ForEach-Object { Write-Host "    -> $_" }
}

Write-Host "Meta (OG/Twitter) missing files:`t$($metaMissing.Keys.Count)"
foreach ($k in $metaMissing.Keys) {
  $list = ($metaMissing[$k] | Select-Object -Unique) -join ', '
  Write-Host "  - $k" -ForegroundColor Yellow
  Write-Host "    -> Missing: $list"
}

Write-Host "XML validation:"
foreach ($r in $xmlResults) { Write-Host "  $r" }

# Exit 0 always, just reporting
exit 0


