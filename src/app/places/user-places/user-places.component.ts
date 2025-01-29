import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Place } from '../place.model';
import { PlacesContainerComponent } from '../places-container/places-container.component';
import { PlacesComponent } from '../places.component';
import { PlacesService } from '../places.service';

@Component({
  selector: 'app-user-places',
  standalone: true,
  templateUrl: './user-places.component.html',
  styleUrl: './user-places.component.css',
  imports: [PlacesContainerComponent, PlacesComponent],
})
export class UserPlacesComponent implements OnInit {
  isFetching = signal<boolean>(false);
  private destroyRef = inject(DestroyRef);
  private placeService = inject(PlacesService);
  places = signal<Place[] | undefined>(undefined);
  error = signal<string>('');
  ngOnInit() {
    this.isFetching.set(true);
    const subscription = this.placeService.loadUserPlaces().subscribe({
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
}
