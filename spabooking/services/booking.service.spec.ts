import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BookingService } from './booking.service';

describe('BookingService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      HttpClientTestingModule
    ]
  }));

  it('should be created', () => {
    const service: BookingService = TestBed.get(BookingService);
    expect(service).toBeTruthy();
  });
});
