import { Injectable, inject } from '@angular/core';
import { FlightService } from '../flight.service';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { ticketingActions, ticketingApiActions } from './actions';
import { catchError, map, of, switchMap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TicketingEffects {
  flightService = inject(FlightService);
  actions$ = inject(Actions);

  loadFlights = createEffect(() =>
    this.actions$.pipe(
      ofType(ticketingActions.loadFlights),
      switchMap((a) => this.flightService.find(a.from, a.to)),
      map((flights) => ticketingActions.flightsLoaded({ flights }))
    )
  );

  loadFlight = createEffect(() =>
    this.actions$.pipe(
      ofType(ticketingActions.loadFlight),
      switchMap((a) => this.flightService.findById(a.id)),
      map((flight) => ticketingApiActions.flightLoaded({ flight }))
    )
  );

  updateFlight = createEffect(() =>
    this.actions$.pipe(
      ofType(ticketingActions.updateFlight),
      switchMap((a) => this.flightService.updateFlight(a.flight)),
      map((flight) => ticketingApiActions.updateFlightSuccess({ flight })),
      catchError(() => of(ticketingApiActions.updateFlightError()))
    )
  );
}
