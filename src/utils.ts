export function countdown(countdownTime: number = 120, interval: number = 10000) {
    let remainingSeconds = countdownTime

    const intervalId = setInterval(() => {
        const minutes = Math.floor(remainingSeconds / 60)
        const seconds = remainingSeconds % 60
        console.log(`Time remaining: ${minutes}:${seconds.toString().padStart(2, '0')}`)
        remainingSeconds--
        if (remainingSeconds < 0) {
            clearInterval(intervalId)
            console.log('Time is up!')
        }
    }, interval)
}

export function printLink(url) {
    console.log(`\u001b]8;;${url}\u001b\\${url}\u001b]8;;\u001b\\`)
}
