import http from 'k6/http';
import { chromium } from 'k6/browser';
import { check, sleep } from 'k6';

export const options = {
  scenarios: {
    default: {
      executor: 'shared-iterations',   // ← 여길 반드시 지정
      vus: 3,
      iterations: 5,
      maxDuration: '1m',
    },
  },
};

export default async function () {
  // 1) API 테스트
  const apiRes = http.get('http://localhost:8080/event');
  check(apiRes, { 'API 200': (r) => r.status === 200 });

  // 2) 페이지(E2E) 테스트
  const browser = chromium.launch({ headless: true });
  const context = browser.newContext();
  const page = context.newPage();

  await page.goto('http://localhost:8080/event');
  check(page, { '페이지 로드 확인': () => page.url().endsWith('/event') });

  const CLICK_COUNT = 10;
  for (let i = 0; i < CLICK_COUNT; i++) {
    await page.locator('#cntBtn').click();
    sleep(0.2);
  }

  const final = await page.locator('#count').textContent();
  check(final, { '클릭 카운트 정상': (c) => parseInt(c, 10) === CLICK_COUNT });

  await browser.close();
}
