# Script simple para reemplazar connectXverse
$filePath = "index.html"
$newMethodFile = "simple_connectXverse.txt"

# Leer archivos
$content = Get-Content $filePath -Raw
$newMethod = Get-Content $newMethodFile -Raw

Write-Host "Leyendo archivo original..."
Write-Host "Contenido original: $($content.Length) caracteres"

# Buscar inicio del metodo
$startPattern = "async connectXverse\(xverse\) \{"
$startMatch = [regex]::Match($content, $startPattern)

if (!$startMatch.Success) {
    Write-Host "ERROR: No se encontro el metodo connectXverse"
    exit 1
}

$startIndex = $startMatch.Index
Write-Host "Metodo encontrado en posicion: $startIndex"

# Buscar final del metodo contando llaves
$currentIndex = $startIndex
$braceCount = 0
$inMethod = $false
$endIndex = -1

for ($i = $currentIndex; $i -lt $content.Length; $i++) {
    $char = $content[$i]
    
    if ($char -eq '{') {
        $braceCount++
        $inMethod = $true
    } elseif ($char -eq '}') {
        $braceCount--
        if ($inMethod -and $braceCount -eq 0) {
            $endIndex = $i + 1
            break
        }
    }
}

if ($endIndex -eq -1) {
    Write-Host "ERROR: No se pudo encontrar el final del metodo"
    exit 1
}

Write-Host "Final del metodo en posicion: $endIndex"

# Construir nuevo contenido
$beforeMethod = $content.Substring(0, $startIndex)
$afterMethod = $content.Substring($endIndex)

# Agregar indentacion correcta
$indentedNewMethod = "            " + $newMethod.Replace("`n", "`n            ")

$newContent = $beforeMethod + $indentedNewMethod + $afterMethod

# Guardar archivo
Set-Content -Path $filePath -Value $newContent -NoNewline

Write-Host "Reemplazo completado!"
Write-Host "Tamaño antes: $($content.Length) caracteres"
Write-Host "Tamaño despues: $($newContent.Length) caracteres"
Write-Host "Reduccion: $(($content.Length - $newContent.Length)) caracteres"

# Verificacion
$verifyContent = Get-Content $filePath -Raw
if ($verifyContent.Contains("async connectXverse(xverse) {")) {
    Write-Host "EXITO: Metodo reemplazado correctamente"
} else {
    Write-Host "ERROR: Metodo no encontrado despues del reemplazo"
    exit 1
}

Write-Host "Metodo connectXverse simplificado con exito!"