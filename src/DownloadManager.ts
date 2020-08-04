import Bull from 'bull';
import { setQueues } from 'bull-board';

export class DownloadManager {
  private queue: Bull.Queue;
  constructor(redisOptions: string) {
    this.queue = new Bull('snood', { redis: redisOptions });
    setQueues([this.queue]);

    this.queue.process(8, async (job: Bull.Job<any>) => {
      console.log(job.data);
    })

  }

  async add(data: any) {
    return await this.queue.add(data, {
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 5000
      }
    })
  }
}