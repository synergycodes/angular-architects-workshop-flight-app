import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoggerService } from '@demo/shared/util-logger';
import { selectPassengersWithTickets } from '@demo/ticketing/data';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-passenger-search',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './passenger-search.component.html',
  styleUrls: ['./passenger-search.component.css'],
})
export class PassengerSearchComponent {
  store = inject(Store);
  passengers = this.store.selectSignal(selectPassengersWithTickets);

  constructor(logger: LoggerService) {
    logger.info('passenger search', 'info');
  }
}
