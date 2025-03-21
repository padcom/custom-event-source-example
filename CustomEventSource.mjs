export class CustomEventSource {
  onopen
  onclose
  onerror
  onmessage

  #stream
  #reader

  /**
   * @param {RequestInfo | URL} input
   * @param {RequestInit} init
   */
  constructor(input, init = undefined) {
    fetch(input, init).then(response => {
      this.#stream = response.body;
      this.#reader = this.#stream.getReader();
      void this.#readChunk();
    })
  }

  async #readChunk() {
    try {
      const { value, done } = await this.#reader.read()
      if (done) {
        this.onclose && this.onclose()
        return
      }

      const chunk = new TextDecoder().decode(value)
      const event = new MessageEvent('message', { data: chunk })
      this.onmessage && this.onmessage(event)
      void this.#readChunk();
    } catch (error) {
      this.onerror && this.onerror(error)
    }
  }
}
