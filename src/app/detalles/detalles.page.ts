import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonCardHeader, IonCard, IonCardTitle, IonCardSubtitle, IonCardContent, IonButton, IonIcon } from '@ionic/angular/standalone';
import { MovesService } from '../servicios/moves.service';
import { inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-detalles',
  templateUrl: './detalles.page.html',
  styleUrls: ['./detalles.page.scss'],
  standalone: true,
  imports: [IonIcon, IonButton, IonCardContent, IonCardSubtitle, IonCardTitle, IonCard, IonCardHeader, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class DetallesPage implements OnInit {
   private moviesService = inject(MovesService);
   private route: ActivatedRoute = inject(ActivatedRoute);
   private idMovie !: string; ;
  searchTerm: string = '';
  movie: any = null ;
  constructor() {
    this.idMovie = this.route.snapshot.paramMap.get('id')?.toString()!;
   }
  

  ngOnInit() {
    this.getMovieDetails(this.idMovie);
  }
 getMovieDetails(movieId: string) {
    this.moviesService.getMovieDetails(movieId).subscribe({
      next: (datos: any) => {
        console.log('Datos recibidos:', datos);
        this.movie = datos;
      },
      error: (error: any) => {
        console.error('Error al obtener detalles:', error);
      }
    });
  }
}
