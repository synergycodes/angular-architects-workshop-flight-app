import { createActionGroup, props, emptyProps } from '@ngrx/store';
import { Flight } from '../flight';

export const ticketingActions = createActionGroup({
  source: 'ticketing',
  events: {
    'flights loaded': props<{ flights: Flight[] }>(),
    'load flights': props<{ from: string; to: string }>(),
    'load flight': props<{ id: string }>(),
    'update flight': props<{ flight: Flight }>(),
    'clear flights': emptyProps(),
  },
});

export const ticketingApiActions = createActionGroup({
  source: 'ticketing API',
  events: {
    'flight loaded': props<{ flight: Flight }>(),
    'update flight success': props<{ flight: Flight }>(),
    'update flight error': emptyProps(),
  },
});
