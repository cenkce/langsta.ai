class LlamaAI {
  private headers: Headers = new Headers();
  private queue: any[] = [];
  private abortController?: AbortController;

  constructor(
    private apiToken: string,
    private hostname = "https://api.llama-api.com",
    private domainPath = "/chat/completions",
  ) {
    this.headers.set("Authorization", `Bearer ${this.apiToken}`);
  }

  [Symbol.dispose]() {
    this.dispose();
  }

  dispose() {
    if(this.abortController)
      this.abortController.abort();
  }

  async makeRequest(apiRequestJson: Record<string, any>, abortController?: AbortController) {
    if(this.abortController)
      this.abortController.abort();
    this.abortController = abortController ?? new AbortController();

    try {
      return await fetch(`${this.hostname}${this.domainPath}`, {
        method: "POST",
        headers: this.headers,
        body: JSON.stringify(apiRequestJson),
        signal: this.abortController.signal,
      });
    } catch (error) {
      if(error instanceof Error)
        throw new Error(`Error while making request: ${error.message}`);
      throw new Error(`Error while making request: ${error}`);
    }
  }

  async doStream(apiRequestJson: Record<string, any>) {
    const response = await this.makeRequest(apiRequestJson);
    if (response.body)
      for await (const chunk of response.body) {
        this.queue.push(chunk);
      }
  }

  async *getSequences() {
    while (this.queue.length > 0) {
      yield this.queue.shift();
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  }

  async runStream(apiRequestJson: Record<string, any>) {
    await this.doStream(apiRequestJson);
    this.getSequences();
  }

  async runSync(apiRequestJson: Record<string, any>) {
    const response = await this.makeRequest(apiRequestJson);
    const data = await response.json();
    // eslint-disable-next-line no-debugger
    if (response.status !== 200) {
      throw new Error(`POST ${response.status} ${data.detail}`);
    }

    return data;
  }

  run(apiRequestJson: Record<string, any>) {
    if (apiRequestJson.stream) {
      return this.runStream(apiRequestJson);
    } else {
      return this.runSync(apiRequestJson);
    }
  }
}

export default LlamaAI;
