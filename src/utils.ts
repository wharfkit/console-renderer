export function countdown(expirationTimeString?: string, interval = 10000) {
    const expirationTime = expirationTimeString
        ? Date.parse(expirationTimeString)
        : Date.now() + 120000
    const startTime = Date.now()
    const remainingTime = expirationTime - startTime
    const remainingSeconds = Math.ceil(remainingTime) / 1000

    const minutes = Math.floor(remainingSeconds / 60)
    const seconds = remainingSeconds % 60
    console.log(`\nTime remaining: ${minutes}:${seconds.toString().padStart(2, '0')}`)

    const intervalId = setInterval(() => {
        const elapsedTime = Date.now() - startTime
        const remainingSeconds = Math.ceil((remainingTime - elapsedTime) / 1000)

        if (remainingSeconds <= 0) {
            clearInterval(intervalId)
            console.log('\nTime is up!')

            return process.exit(1)
        }

        const minutes = Math.floor(remainingSeconds / 60)
        const seconds = remainingSeconds % 60
        console.log(`\nTime remaining: ${minutes}:${seconds.toString().padStart(2, '0')}`)
    }, interval)

    return () => clearInterval(intervalId)
}

export function printLink(url) {
    console.log(`\n\u001b]8;;${url}\u001b\\${url}\u001b]8;;\u001b\\`)
}
