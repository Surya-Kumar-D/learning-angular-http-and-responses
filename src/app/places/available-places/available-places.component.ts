import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Place } from '../place.model';
import { PlacesContainerComponent } from '../places-container/places-container.component';
import { PlacesComponent } from '../places.component';
import { PlacesService } from '../places.service';

@Component({
  selector: 'app-available-places',
  standalone: true,
  templateUrl: './available-places.component.html',
  styleUrl: './available-places.component.css',
  imports: [PlacesComponent, PlacesContainerComponent],
})
export class AvailablePlacesComponent implements OnInit {
  places = signal<Place[] | undefined>(undefined);
  private httpClient = inject(HttpClient);
  private destroyRef = inject(DestroyRef);
  private placesService = inject(PlacesService);
  error = signal<string>('');
  isFetching = signal(false);
  ngOnInit() {
    this.isFetching.set(true);
    const subscription = this.placesService.loadAvailablePlaces().subscribe({
      next: (res) => {
        this.places.set(res);
        console.log(this.places());
      },
      error: (error: Error) => {
        console.log(error);
        this.error.set(error.message);
      },
      complete: () => {
        this.isFetching.set(false);
      },
    });
    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    });
  }
  onSelect(place: Place) {
    this.httpClient
      .put('http://localhost:3000/user-places', {
        placeId: place.id,
      })
      .subscribe();
  }
}
