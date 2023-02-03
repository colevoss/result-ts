import { Result } from '../src';

// function myFunction(): Res<number, string> {
function myFunction(pass: boolean): Result<number, string> {
  return Result.ok(1);
}
