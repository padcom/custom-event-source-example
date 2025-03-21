import { CustomEventSource } from "./CustomEventSource.mjs"

console.log('This is a client')

// const events = new EventSource('http://localhost:8080/api/events')
const events = new CustomEventSource('http://localhost:8080/api/events', {
  method: 'POST',
})

events.onmessage = (e) => {
  const message = document.createElement('div')
  message.innerText = e.data
  document.getElementById('output')?.appendChild(message)
}

events.onopen = (e) => {
  console.log('Events open', e)
}

events.onerror = (e) => {
  console.log('Events error', e)
}
