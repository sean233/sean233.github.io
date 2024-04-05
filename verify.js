async function calculateChecksum(randomPart, saltValues) {
    // Combine the operations as in the Python code, adjusted for JS
    const part1 = parseInt(randomPart.substring(0, randomPart.length / 2), 10);
    const part2 = parseInt(randomPart.substring(randomPart.length / 2), 10);
    const part1Result = (part1 * saltValues[0]) % 1000;
    const part2Result = (part2 + saltValues[1]) % 1000;
    const combined = (part1Result + part2Result) * saltValues[2];

    // Using SubtleCrypto for SHA-256 hash
    const encoder = new TextEncoder();
    const data = encoder.encode(combined.toString());
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex.substring(0, 5);
}

async function verifySerialNumber() {
    const saltValues = [77, 11, 33]; // Should match the Python 'salt_values'
    const serialInput = document.getElementById('serialInput').value;
    const randomPart = serialInput.slice(0, -5);
    const checksum = serialInput.slice(-5);

    const calculatedChecksum = await calculateChecksum(randomPart, saltValues);

    if (calculatedChecksum === checksum) {
        document.getElementById('result').textContent = 'Valid Serial Number.';
        document.getElementById('result').style.color = 'green';
        document.getElementById('result').style.fontWeight = 'bold';
    } else {
        document.getElementById('result').textContent = 'Invalid Serial Number.';
        document.getElementById('result').style.color = 'red';
        document.getElementById('result').style.fontWeight = 'bold';
    }
    
}
