import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
  vus: 500, // 동시 사용자 수
  iterations: 1000, // 총 요청 수 (GET+POST 합쳐서)
};

export default function () {
  // 1. 페이지 접속 (GET /event)
  let getRes = http.get('http://localhost:8080/event');
  check(getRes, {
    'GET /event status is 200': (r) => r.status === 200,
  });

  // 2. sleep 0.5초 (유저가 페이지 보는 시간 흉내)
  sleep(0.5);

  // 3. 클릭 이벤트 발생 (POST /event/click)
  let postRes = http.post('http://localhost:8080/event/click');
  check(postRes, {
    'POST /event/click status is 200': (r) => r.status === 200,
  });
}
