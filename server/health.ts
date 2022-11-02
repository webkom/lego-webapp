import config from "../config/env";
export default function healthCheck(req: express$Request, res: express$Response) {
  const log = req.app.get('log');
  fetch(config.baseUrl, {
    method: 'GET',
    headers: new Headers({
      'Content-Type': 'application/json'
    })
  }).then(response => {
    if (response.status === 200) {
      res.sendStatus(200);
    } else {
      // $FlowFixMe
      log.warn('unhealthy_response', response);
      res.sendStatus(500);
    }
  }).catch(err => {
    // $FlowFixMe
    log.warn('unhealthy', err);
    res.sendStatus(500);
  });
}