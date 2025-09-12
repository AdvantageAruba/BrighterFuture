// Request throttling utility to prevent ERR_INSUFFICIENT_RESOURCES
class RequestThrottle {
  private static instance: RequestThrottle;
  private requestQueue: Array<() => Promise<any>> = [];
  private isProcessing = false;
  private readonly maxConcurrentRequests = 3;
  private activeRequests = 0;

  static getInstance(): RequestThrottle {
    if (!RequestThrottle.instance) {
      RequestThrottle.instance = new RequestThrottle();
    }
    return RequestThrottle.instance;
  }

  async throttleRequest<T>(requestFn: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      this.requestQueue.push(async () => {
        try {
          const result = await requestFn();
          resolve(result);
        } catch (error) {
          reject(error);
        }
      });
      
      this.processQueue();
    });
  }

  private async processQueue() {
    if (this.isProcessing || this.activeRequests >= this.maxConcurrentRequests) {
      return;
    }

    this.isProcessing = true;

    while (this.requestQueue.length > 0 && this.activeRequests < this.maxConcurrentRequests) {
      const request = this.requestQueue.shift();
      if (request) {
        this.activeRequests++;
        request().finally(() => {
          this.activeRequests--;
          this.processQueue();
        });
      }
    }

    this.isProcessing = false;
  }

  clearQueue() {
    this.requestQueue = [];
  }
}

export const requestThrottle = RequestThrottle.getInstance();

