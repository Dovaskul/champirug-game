# Script mejorado para reemplazar el método connectXverse

$filePath = "index.html"
$newMethodFile = "simple_connectXverse.txt"

# Leer archivos
$content = Get-Content $filePath -Raw
$newMethod = Get-Content $newMethodFile -Raw

Write-Host "📋 Contenido original: $($content.Length) caracteres"
Write-Host "📋 Nuevo método: $($newMethod.Length) caracteres"

# Buscar el inicio del método
$pattern = "async connectXverse\(xverse\) \{"
$startMatch = [regex]::Match($content, $pattern)

if (!$startMatch.Success) {
    Write-Host "❌ No se encontró el método connectXverse"
    exit 1
}

$startIndex = $startMatch.Index
Write-Host "✅ Método encontrado en posición: $startIndex"

# Buscar el final del método contando llaves
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
    Write-Host "❌ No se pudo encontrar el final del método"
    exit 1
}

Write-Host "✅ Final del método en posición: $endIndex"

# Calcular el contenido a reemplazar
$methodLength = $endIndex - $startIndex
$oldMethod = $content.Substring($startIndex, $methodLength)

Write-Host "📊 Método original: $($oldMethod.Length) caracteres"
Write-Host "📊 Primeras líneas del método original:"
Write-Host ($oldMethod.Substring(0, [Math]::Min(200, $oldMethod.Length)))

# Construir el nuevo contenido
$beforeMethod = $content.Substring(0, $startIndex)
$afterMethod = $content.Substring($endIndex)

# Asegurar que el nuevo método tenga la indentación correcta
$indentedNewMethod = "            " + $newMethod.Replace("`n", "`n            ")

$newContent = $beforeMethod + $indentedNewMethod + $afterMethod

# Verificar que no hay errores obvios
if (!$newContent.Contains("async connectXverse(xverse) {")) {
    Write-Host "❌ Error: El nuevo contenido no contiene el método esperado"
    exit 1
}

# Guardar el archivo
Set-Content -Path $filePath -Value $newContent -NoNewline

Write-Host "✅ Reemplazo completado exitosamente!"
Write-Host "📊 Tamaño antes: $($content.Length) caracteres"
Write-Host "📊 Tamaño después: $($newContent.Length) caracteres"
Write-Host "📉 Reducción: $(($content.Length - $newContent.Length)) caracteres"

# Verificación final
$verifyContent = Get-Content $filePath -Raw
$verifyMatch = [regex]::Match($verifyContent, "async connectXverse\(xverse\) \{")

if ($verifyMatch.Success) {
    Write-Host "✅ Verificación exitosa: Método encontrado en el archivo actualizado"
    
    # Mostrar un extracto del método nuevo
    $newMethodStart = $verifyMatch.Index
    $extract = $verifyContent.Substring($newMethodStart, [Math]::Min(300, $verifyContent.Length - $newMethodStart))
    Write-Host "📋 Extracto del nuevo método:"
    Write-Host $extract
} else {
    Write-Host "❌ Error: Método no encontrado después del reemplazo"
    exit 1
}

Write-Host "`n🎉 Método connectXverse simplificado con éxito!"