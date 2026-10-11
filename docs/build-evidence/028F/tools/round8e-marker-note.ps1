$ErrorActionPreference = 'Stop'
$repoRoot = 'C:\Users\joe\website_creator'
$historyPath = Join-Path $repoRoot 'docs\build-evidence\028F\checks\stale-coordinator-marker.json'
$markerPath = Join-Path $repoRoot 'docs\build-evidence\028F\checks\uniqueness-browser-active.json'
if (Test-Path -LiteralPath $markerPath) { throw 'A coordinator marker exists; stop without deleting it.' }
if (Get-Process -Id 54228 -ErrorAction SilentlyContinue) { throw 'PID 54228 is running; stop.' }
$active = @(Get-CimInstance Win32_Process -Filter "Name = 'node.exe'" | Where-Object { $_.CommandLine -like '*saved-replay-final-validation.mjs*' })
if ($active.Count -ne 0) { throw 'A coordinator is running; stop.' }
$historyWriteUtc = (Get-Item -LiteralPath $historyPath).LastWriteTimeUtc.ToString('o')
$history = Get-Content -Raw -LiteralPath $historyPath | ConvertFrom-Json
if (-not ($history.PSObject.Properties.Name -contains 'markers')) { throw 'Expected history.markers array is missing.' }
if (@($history.markers | Where-Object pid -eq 54228).Count -ne 0) { throw 'PID 54228 already has a record; stop rather than duplicate it.' }
$contents = '{"pid":54228,"owner":"028F saved-version final validation"}'
$record = [pscustomobject]@{
    path = $markerPath
    pid = 54228
    contents = $contents
    contentsBase64 = [Convert]::ToBase64String([Text.Encoding]::UTF8.GetBytes($contents))
    removedDuringRound = '8d'
    removedAtUtcApprox = $historyWriteUtc
    removalTimeBasis = 'History file write immediately preceded the marker deletion in the round-8d command; exact deletion timestamp was not captured.'
    reason = 'Stale marker from round 8c; PID 54228 and all node coordinator command lines were confirmed absent before deletion. No process was killed.'
    confirmedDeadBeforeDeletion = $true
    confirmationEvidence = 'checks/round8d-stop.log; round-8d process query returned no PID 54228 and no active coordinator'
    note = 'Backfilled in round 8e because the round-8d audit append used the nonexistent records property. The actual collection is markers.'
    recordedUtc = [DateTime]::UtcNow.ToString('o')
}
$previousCount = @($history.markers).Count
$history.markers = @($history.markers) + $record
[IO.File]::WriteAllText($historyPath, ($history | ConvertTo-Json -Depth 20), [Text.UTF8Encoding]::new($false))
$verified = Get-Content -Raw -LiteralPath $historyPath | ConvertFrom-Json
$found = @($verified.markers | Where-Object pid -eq 54228)
if (@($verified.markers).Count -ne ($previousCount + 1) -or $found.Count -ne 1 -or $found[0].contents -cne $contents -or -not $found[0].confirmedDeadBeforeDeletion) { throw 'Marker audit verification failed.' }
$found[0] | ConvertTo-Json -Depth 10
Write-Output 'PASS marker audit parses and contains the missing record.'
