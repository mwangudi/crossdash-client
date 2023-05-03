import { roundUp } from '../../utils';

test('Round up', () => {
  expect(roundUp(10.56, 1)).toBe(10.6);
  expect(roundUp(10.53, 1)).toBe(10.5);
});
