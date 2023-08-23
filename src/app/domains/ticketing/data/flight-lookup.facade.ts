import { inject, Injectable } from '@angular/core';
import {
  BehaviorSubject,
  catchError,
  combineLatest,
  distinctUntilChanged,
  filter,
  interval,
  map,
  Observable,
  of,
  shareReplay,
  startWith,
  switchMap,
  tap,
} from 'rxjs';
import { Flight } from './flight';
import { FlightService } from './flight.service';

@Injectable({ providedIn: 'root' })
export class FlightLookupFacade {
  flightService = inject(FlightService);

  // Source
  private input$ = new BehaviorSubject<string>('');

  private loadingSubject = new BehaviorSubject<boolean>(false);
  private errorSubject = new BehaviorSubject<unknown>({});

  // Sinks
  readonly loading$ = this.loadingSubject.asObservable();
  readonly error$ = this.errorSubject.asObservable();

  readonly online$ = interval(2000).pipe(
    startWith(-1),
    tap((v) => console.log('counter', v)),
    map(() => Math.random() < 0.5),
    distinctUntilChanged(),
    shareReplay({ bufferSize: 1, refCount: true })
  );

  readonly flights$ = combineLatest({
    input: this.input$,
    online: this.online$,
  }).pipe(
    filter((combined) => combined.online),
    tap(() => this.loadingSubject.next(true)),
    switchMap((combined) => this.load(combined.input)),
    tap(() => this.loadingSubject.next(false))
  );

  private load(filter: string): Observable<Flight[]> {
    if (!filter) {
      return of([]);
    }

    return this.flightService.find(filter, '').pipe(
      catchError((err) => {
        this.errorSubject.next(err);
        return of([]);
      })
    );
  }

  lookup(filter: string): void {
    this.input$.next(filter);
  }
}

/*
  1. input -> lookup -> combineLatest (emits always because startWith on online$) -> if (online) -> loading indicator + load method -> flightService.find
  2. producers encapsulation, no observables overwrite
  3. turns subject into observable
  4. keep one producer for all observers + replay last value after new subscription (BehaviorSubject like behavior, change cold observable in the hot one)
  5. how many items should be re-emitted, refCount for avoiding memory leaks
  6. emits set of values whenever any of them change, but only after each has emitted at least once
  7. to unsubscribe from previous stream and subscribe to new one (load)
  8. flightService.find is the only method that can fail here and error would be pushed in the error stream
  9. switchMap ending with an error would break whole flights stream
 */
