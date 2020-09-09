import { of, OperatorFunction } from 'rxjs';
import { map, startWith, catchError } from 'rxjs/operators';

export function addProgress<T>(): OperatorFunction<T, Progress<T, string>> {
    return input$ => input$.pipe(
      map((x: T) => Progress.fromValue<T, string>(x)),
      startWith(Progress.forLoading<T, string>()),
      catchError(e => {
        return of(Progress.fromError<T, string>(typeof(e.error) == "string" ? e.error : e.error.detail));
      })
    );
  }

export type StatusType = 'notstarted' | 'loading' | 'value' | 'error';
export class Progress<TValue, TError> {
  private constructor(public status: StatusType, public value: TValue | undefined, public error: TError | undefined) { }

  static notStarted<TValue, TError>() {
    return new Progress<TValue, TError>('notstarted', undefined, undefined);
  }

  static forLoading<TValue, TError>() {
    return new Progress<TValue, TError>('loading', undefined, undefined);
  }

  static fromValue<TValue, TError>(value: TValue) {
    return new Progress<TValue, TError>('value', value, undefined);
  }

  static fromError<TValue, TError>(error: TError) {
    return new Progress<TValue, TError>('error', undefined, error);
  }

  get isLoading() {
    return this.status === 'loading';
  }
  get hasResult() {
      return this.hasValue || this.isError;
  }
  get hasValue() {
    return this.status === 'value';
  }
  get isError() {
    return this.status === 'error';
  }
}