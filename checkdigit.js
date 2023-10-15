function calculateEAN13(input) {
    // Check if the input is a 12-digit number
    input = input.toString().padStart(12,'0')

    if (/^\d{12}$/.test(input)) {
        // Convert the input to an array of integers
        let digits = input.split('').map(Number);

        // Calculate the check digit
        let sum = 0;
        for (let i = 0; i < digits.length; i++) {
            sum += i % 2 === 0 ? digits[i] : digits[i] * 3;
        }
        let checkDigit = (10 - (sum % 10)) % 10;

        // Return the check digit
        return input + ''+checkDigit;
    } else {
        // Return an error message if the input is not valid
        return '';
    }
}

// Example usage:
let barcodeInput = '2' // Replace with the user's input
let result = calculateEAN13(barcodeInput);
console.log(result); // Output the check digit or error message

