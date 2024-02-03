export const parsePathArgs = (inputPath) => {
    let isPathCorrect = true

    if (inputPath.split(' ').length === 2 && !inputPath.includes('"')) {
        isPathCorrect = true
    }

    if (inputPath.split(' ').length !== 2 && !inputPath.includes('"')) {
        isPathCorrect = false
    }

    if (inputPath.includes('"') && (inputPath.split('"').length - 1) % 2 === 1) {
        isPathCorrect = false
    }

    if (inputPath.includes('"') && (inputPath.split('"').length - 1) % 2 === 0) {
        isPathCorrect = true
    }

    let countQuotes = 0
    let countSpace = 0
    let sepIndex = 0

    for (let i = 0; i < inputPath.length; i++) {
        if (inputPath[i] === '"' && countQuotes === 0) {
            countQuotes++
            continue
        }

        if (inputPath[i] === '"' && countQuotes === 1) {
            countQuotes--
            continue
        }

        if (inputPath[i] === ' ' && countQuotes === 0 && countSpace === 0) {
            sepIndex = i
            countSpace++
            continue
        }

        if (inputPath[i] === ' ' && countQuotes === 0 && countSpace !== 0) {
            isPathCorrect = false
            break
        }
    }

    if (isPathCorrect) {
        return {
            firstArg: inputPath.substring(0, sepIndex),
            secondArg: inputPath.substring(sepIndex + 1),
        }
    } else {
        return {firstArg: null, secondArg: null}
    }
}
