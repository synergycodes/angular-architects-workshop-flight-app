import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlightBookingFacade } from '@demo/ticketing/data';
import { LoggerService } from '@demo/shared/util-logger';

@Component({
  selector: 'app-passenger-search',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './passenger-search.component.html',
  styleUrls: ['./passenger-search.component.css'],
})
export class PassengerSearchComponent {
  facade = inject(FlightBookingFacade);
  passengers = this.facade.selectPassengers();

  constructor(logger: LoggerService) {
    logger.info('passenger search', 'info');
  }
}
