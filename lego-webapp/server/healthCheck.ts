import type { Request, Response } from 'express';

export default function healthCheck(_: Request, res: Response) {
  fetch(process.env.BASE_URL || 'http://127.0.0.1:8000', {
    method: 'GET',
    headers: new Headers({ 'Content-Type': 'application/json' }),
  })
    .then((response) => {
      if (response.status === 200) {
        res.sendStatus(200);
      } else {
        console.warn('unhealthy_response', JSON.stringify(response));
        res.sendStatus(500);
      }
    })
    .catch((err) => {
      console.warn('unhealthy', JSON.stringify(err));
      res.sendStatus(500);
    });
}
