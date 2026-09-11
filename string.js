function convertToUpperCase(str) {
    return str.toUpperCase()
}

function convertToLowerCase(str) {
    return str.toLowerCase()
}

function checkPalindrome(str) {
    let text = str.toLowerCase().trim()
    return text === text.split("").reverse().join("") ? "Palindrome" : "Not Palindrome"
}

export { convertToUpperCase, convertToLowerCase, checkPalindrome }