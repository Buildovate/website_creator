param([int]$RootProcessId)
$ErrorActionPreference = 'Stop'
$taskProcesses = @(Get-CimInstance Win32_Process | Select-Object ProcessId,ParentProcessId,Name)
$taskIds = [System.Collections.Generic.HashSet[int]]::new()
$null = $taskIds.Add($RootProcessId)
do {
    $taskFound = $false
    foreach ($taskProcess in $taskProcesses) {
        if ($taskIds.Contains([int]$taskProcess.ParentProcessId) -and $taskIds.Add([int]$taskProcess.ProcessId)) { $taskFound = $true }
    }
} while ($taskFound)
$taskRows = @()
foreach ($taskProcess in $taskProcesses) {
    if ($taskIds.Contains([int]$taskProcess.ProcessId) -and $taskProcess.Name -in @('node.exe','chrome.exe')) {
        $taskRunning = Get-Process -Id $taskProcess.ProcessId -ErrorAction SilentlyContinue
        if ($null -ne $taskRunning) { $taskRows += [pscustomobject]@{id=[int]$taskProcess.ProcessId;parent=[int]$taskProcess.ParentProcessId;name=$taskProcess.Name;cpuSeconds=$taskRunning.TotalProcessorTime.TotalSeconds} }
    }
}
ConvertTo-Json -InputObject $taskRows -Depth 4 -Compress
