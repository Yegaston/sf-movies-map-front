import { AfterViewInit, Component, OnInit } from '@angular/core';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { marker, tileLayer, map, Control } from 'leaflet';
import { MoviesService } from '../../services/movies.service';
import { Movie } from '../../../types/Movies.type';
import 'leaflet-control-geocoder';
import { NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [LeafletModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit, AfterViewInit {
  map: any;
  movies: Movie[] = [];
  filteredMovies: Movie[] = [];
  search: string = '';

  constructor(private moviesService: MoviesService) {}

  ngOnInit() {
    this.getMovies();
    console.log(this.movies);
  }

  ngAfterViewInit(): void {
    this.initMap();
  }

  private initMap(): void {
    this.map = map('map', {
      center: [37.7749, -122.4194], // Center on San Francisco
      zoom: 16,
    });

    tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
    }).addTo(this.map);

    (Control as any).geocoder().addTo(this.map);
  }

  getMovies() {
    this.moviesService.getMovies().subscribe({
      next: (res) => {
        this.movies = res;
        this.filteredMovies = res;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  markAddresses() {
    this.movies.forEach((movie) => {
      this.addMarkerByAddress(movie.locations);
    });
  }

  addMarkerByAddress(address: string): void {
    const geocoder = (Control as any).Geocoder.nominatim();

    geocoder.geocode(address, (results: any) => {
      if (results.length > 0) {
        const latlng = results[0].center;
        marker(latlng).addTo(this.map).bindPopup(address).openPopup();
        this.map.panTo(latlng);
      } else {
        console.error('Geocoding failed for the address:', address);
      }
    });
  }

  handleMovieClick(movie: Movie): void {
    this.addMarkerByAddress(`${movie.locations}, CA`);
  }

  searchMovie(event: any) {
    console.log(this.search);
    this.filteredMovies = this.movies.filter((movie) =>
      movie.title.toLowerCase().includes(event.target.value.toLowerCase())
    );
  }
}
