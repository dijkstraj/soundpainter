import { TestBed, async } from '@angular/core/testing';
import { AppComponent } from './app.component';
import * as math from 'mathjs';

describe('math', () => {
  it('bla', () => {
    const points = [
      [0, 0],
      [1, 1],
      [2, 1],
      [3, 4]
    ];
    const matrix = [
      [ 0,  2,  0,  0],
      [-1,  0,  1,  0],
      [ 2, -5,  4, -1],
      [-1,  3, -3,  1]
    ];
    const t = 0.95;
    const step1 = math.multiply(0.5, [1.0, t, t * t, t * t * t]);
    const step2 = math.multiply(step1, matrix);
    console.log(math.multiply(step2, points));
  });
});
