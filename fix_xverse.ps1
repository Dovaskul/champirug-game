# Script para arreglar el método connectXverse simplificándolo

$filePath = "index.html"
$content = Get-Content $filePath -Raw

# Encontrar el inicio del método
$startPattern = "async connectXverse\(xverse\) \{"
$endPattern = "            \}\s*\n\s*// Get display name"

# Método simplificado
$newMethod = @"
async connectXverse(xverse) {
                try {
                    console.log('🔗 Connecting to Xverse wallet...');
                    
                    if (!window.XverseProviders?.BitcoinProvider) {
                        throw new Error('Xverse wallet not found. Please install Xverse extension.');
                    }

                    console.log('📢 Requesting addresses from Xverse...');
                    const response = await window.XverseProviders.BitcoinProvider.request('getAddresses');
                    console.log('📋 Xverse response:', response);

                    if (!response || (!response.addresses && !response.result)) {
                        throw new Error('No addresses returned from Xverse wallet');
                    }

                    const addresses = response.addresses || response.result?.addresses || response.result;
                    
                    if (!addresses || addresses.length === 0) {
                        throw new Error('No Bitcoin addresses found in Xverse wallet');
                    }

                    // Get the payment address
                    let address;
                    if (Array.isArray(addresses)) {
                        const paymentAddr = addresses.find(addr => 
                            addr.purpose === 'payment' || addr.type === 'payment'
                        );
                        address = paymentAddr ? paymentAddr.address : addresses[0].address || addresses[0];
                    } else {
                        address = addresses.address || addresses;
                    }

                    if (!address) {
                        throw new Error('Could not extract Bitcoin address from wallet');
                    }

                    this.address = address;
                    this.connectedWallet = 'xverse';
                    this.signature = 'xverse_connected_' + Date.now();

                    console.log('✅ Xverse wallet connected:', this.address);

                    return {
                        address: this.address,
                        wallet: 'Xverse',
                        signature: this.signature
                    };
                    
                } catch (error) {
                    console.error('❌ Xverse connection failed:', error);
                    throw new Error('Xverse connection failed: ' + error.message);
                }
            }

            // Get display name"@

# Buscar y reemplazar todo el método
$startIndex = $content.IndexOf("async connectXverse(xverse) {")
if ($startIndex -eq -1) {
    Write-Host "❌ No se encontró el método connectXverse"
    exit 1
}

# Buscar el final del método
$searchStart = $startIndex
$braceCount = 0
$inMethod = $false
$endIndex = -1

for ($i = $searchStart; $i -lt $content.Length; $i++) {
    if ($content[$i] -eq '{') {
        $braceCount++
        $inMethod = $true
    } elseif ($content[$i] -eq '}') {
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

# Reemplazar el método
$beforeMethod = $content.Substring(0, $startIndex)
$afterMethod = $content.Substring($endIndex)

$newContent = $beforeMethod + $newMethod + $afterMethod

# Guardar el archivo
Set-Content -Path $filePath -Value $newContent -NoNewline

Write-Host "✅ Método connectXverse simplificado exitosamente"
Write-Host "📊 Tamaño original: $($content.Length) caracteres"
Write-Host "📊 Tamaño nuevo: $($newContent.Length) caracteres"
Write-Host "📉 Reducción: $(($content.Length - $newContent.Length)) caracteres"

# Verificar que el método existe en el nuevo archivo
$verifyContent = Get-Content $filePath -Raw
if ($verifyContent.Contains("async connectXverse(xverse) {")) {
    Write-Host "✅ Verificación exitosa: Método connectXverse encontrado en el archivo actualizado"
} else {
    Write-Host "❌ Error: Método connectXverse no encontrado después del reemplazo"
}
"@