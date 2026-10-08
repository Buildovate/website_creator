$ErrorActionPreference = 'Stop'
$taskRepo = 'C:\Users\joe\website_creator'
$taskOut = Join-Path $taskRepo 'docs\build-evidence\MERGE-1\round2'
$taskResults = Join-Path $taskOut 'generated\028F\full-checks.json'
$taskRunner = Join-Path $taskRepo 'docs\build-evidence\028F\tools\parallel-suite.mjs'
$taskPreload = Join-Path $taskOut 'tools\preserve-and-mock.mjs'
$taskBefore = @{}
foreach ($taskPath in @('public\planning-films.json','tests\roofing-polish-part1.mjs','src\roofing-critical-css.js')) {
 $taskBefore[$taskPath] = [IO.File]::ReadAllBytes((Join-Path $taskRepo $taskPath))
}
$taskProcess = $null
$taskStarted = Get-Date
$taskSeen = 0
try {
 $taskProcess = Start-Process -FilePath (Get-Command node).Source -ArgumentList @('--import=file:///C:/Users/joe/website_creator/docs/build-evidence/MERGE-1/round2/tools/preserve-and-mock.mjs', $taskRunner) -WorkingDirectory $taskRepo -WindowStyle Hidden -PassThru -RedirectStandardOutput (Join-Path $taskOut 'suite102.log') -RedirectStandardError (Join-Path $taskOut 'suite102-error.log')
 $null = $taskProcess.Handle
 Write-Output ('Suite PID '+$taskProcess.Id)
 while (-not $taskProcess.HasExited) {
  Start-Sleep -Seconds 2
  $taskProcess.Refresh()
  if (Test-Path -LiteralPath $taskResults) {
   $taskRows = $null
   try { $taskRows = @(Get-Content -Raw -LiteralPath $taskResults | ConvertFrom-Json) } catch { }
   if ($null -ne $taskRows -and $taskRows.Count -gt $taskSeen) {
    foreach ($taskRow in $taskRows[$taskSeen..($taskRows.Count-1)]) { Write-Output ($taskRow.label+': '+$taskRow.outcome+' ('+$taskRows.Count+'/102)') }
    $taskSeen = $taskRows.Count
    if (@($taskRows | Where-Object status -ne 0).Count -gt 0) {
     if (-not $taskProcess.HasExited) { & taskkill /PID $taskProcess.Id /T /F | Out-Null }
     break
    }
   }
  }
 }
 $taskProcess.WaitForExit()
} finally {
 $taskRestored = @()
 foreach ($taskPath in $taskBefore.Keys) {
  $taskFile = Join-Path $taskRepo $taskPath
  $taskBytes = [IO.File]::ReadAllBytes($taskFile)
  if (-not [System.Linq.Enumerable]::SequenceEqual([byte[]]$taskBytes,[byte[]]$taskBefore[$taskPath])) {
   [IO.File]::WriteAllBytes($taskFile,$taskBefore[$taskPath])
   $taskRestored += $taskPath
  }
 }
 [pscustomobject]@{restored=$taskRestored;exitCode=$taskProcess.ExitCode;durationSeconds=((Get-Date)-$taskStarted).TotalSeconds} | ConvertTo-Json -Depth 5 | Set-Content -LiteralPath (Join-Path $taskOut 'supervisor.json') -Encoding utf8
}
$taskRows = if (Test-Path -LiteralPath $taskResults) { @(Get-Content -Raw -LiteralPath $taskResults | ConvertFrom-Json) } else { @() }
$taskTotals = [pscustomobject]@{pass=@($taskRows|Where-Object outcome -eq 'PASS').Count;passWithWarning=@($taskRows|Where-Object outcome -eq 'PASS-WITH-WARNING').Count;failed=@($taskRows|Where-Object status -ne 0).Count;incomplete=102-$taskRows.Count;durationSeconds=((Get-Date)-$taskStarted).TotalSeconds;exitCode=$taskProcess.ExitCode}
$taskTotals | ConvertTo-Json -Depth 10 | Set-Content -LiteralPath (Join-Path $taskOut 'suite102-totals.json') -Encoding utf8
$taskTotals | ConvertTo-Json -Depth 10 | Write-Output
if ($taskTotals.failed -gt 0 -or $taskTotals.incomplete -gt 0 -or $taskProcess.ExitCode -ne 0) { exit 1 }
