import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonCardHeader, IonCard, IonCardTitle, IonCardSubtitle, IonCardContent, IonButton, IonIcon, IonItem, IonInput, IonSegmentButton, IonSegment, IonItemGroup, IonLabel, IonTextarea, IonAvatar, IonNote, IonList, IonText } from '@ionic/angular/standalone';
import { MovesService } from '../servicios/moves.service';
import { inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RouterModule } from '@angular/router';
import { Comment} from '../interface/IComment';
import { ToastController } from '@ionic/angular';

// ✅ IMPORTAR TODOS LOS ICONOS NECESARIOS
import { addIcons } from 'ionicons';
import { 
  sendOutline, 
  addOutline, 
  star, 
  filmOutline, 
  chevronBackOutline, 
  openOutline,
  languageOutline, 
  cashOutline, 
  globeOutline,
  addCircleOutline, 
  personOutline 
} from 'ionicons/icons';

@Component({
  selector: 'app-detalles',
  templateUrl: './detalles.page.html',
  styleUrls: ['./detalles.page.scss'],
  standalone: true,
  imports: [IonText, IonList, IonNote, IonAvatar, IonTextarea, IonLabel, IonItemGroup, IonSegment, IonSegmentButton, IonInput, IonItem, IonIcon, IonButton,IonCardContent, IonCardSubtitle, IonCardTitle, IonCard, IonCardHeader, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, RouterModule]
})
export class DetallesPage implements OnInit {
         
  searchTerm: string = '';
  movie: any = null;
  private serviceMovies = inject(MovesService);
  private activatedRoute = inject(ActivatedRoute);
  private toastController = inject(ToastController);
  private idMovie: string = '';
  private idUser: string = '';
  public detailMovie: any;
  public userComment: string = '';
  public comments: Comment[] = [];
  stateComent: boolean = false; // ✅ INICIALIZAR CORRECTAMENTE
     
  constructor() {
    // ✅ REGISTRAR TODOS LOS ICONOS AL INICIO
    addIcons({
      'send-outline': sendOutline,
      'add-outline': addOutline,
      'star': star,
      'chevron-back-outline': chevronBackOutline,
      'film-outline': filmOutline,
      'language-outline': languageOutline,
      'cash-outline': cashOutline,
      'globe-outline': globeOutline,
      'open-outline': openOutline,
      'add-circle-outline': addCircleOutline,
      'person-outline': personOutline
      
    });

    // Validación más robusta
    const movieId = this.activatedRoute.snapshot.paramMap.get('id');
    const userId = localStorage.getItem('id');
    
    if (movieId) {
      this.idMovie = movieId;
    } else {
      console.error('No se encontró ID de película en la ruta');
    }
    
    if (userId) {
      this.idUser = userId;
    } else {
      console.error('No se encontró ID de usuario en localStorage');
    }
    
    console.log('IDs inicializados:', { movieId: this.idMovie, userId: this.idUser });
  }

  ngOnInit() {
    if (this.idMovie) {
      this.getMovieDetails(this.idMovie);
      this.getComments();
    } else {
      this.showToast('Error: No se pudo cargar la película', 'danger');
    }
  }

  getstateComment() {
    this.stateComent = !this.stateComent;
    console.log('Estado del comentario:', this.stateComent);
  }

  async saveComment() {
    // Validación del comentario
    if (!this.userComment.trim()) {
      await this.showToast('El comentario no puede estar vacío', 'warning');
      return;
    }

    // Validación de IDs - MÁS ESPECÍFICA
    if (!this.idUser) {
      await this.showToast('Error: Usuario no identificado. Inicia sesión nuevamente.', 'danger');
      console.error('idUser vacío:', this.idUser);
      return;
    }

    if (!this.idMovie) {
      await this.showToast('Error: Película no identificada', 'danger');
      console.error('idMovie vacío:', this.idMovie);
      return;
    }

    // Validación adicional: Verificar que sean números válidos
    const userIdNum = parseInt(this.idUser);
    const movieIdNum = parseInt(this.idMovie);

    if (isNaN(userIdNum) || isNaN(movieIdNum)) {
      await this.showToast('Error: IDs inválidos', 'danger');
      console.error('IDs no son números válidos:', { userIdNum, movieIdNum });
      return;
    }

    console.log('Enviando comentario:', {
      userId: userIdNum,
      movieId: movieIdNum,
      comment: this.userComment.trim()
    });

    this.serviceMovies.saveComment(
      userIdNum,
      movieIdNum,
      this.userComment.trim()
    ).subscribe({
      next: async (response) => {
        console.log('Comentario guardado:', response);
        await this.showToast('Comentario guardado exitosamente', 'success');
        this.userComment = '';
        this.stateComent = false; // ✅ CERRAR EL FORMULARIO DESPUÉS DE ENVIAR
        this.getComments();
      },
      error: async (error: any) => {
        console.error('Error completo:', error);
        
        let errorMessage = 'Error al guardar comentario';
        
        if (error.status === 400) {
          errorMessage = error.error?.message || 'Datos inválidos';
        } else if (error.status === 401) {
          errorMessage = 'No autorizado. Inicia sesión nuevamente';
        } else if (error.status === 404) {
          errorMessage = 'Usuario no encontrado';
        } else if (error.status === 0) {
          errorMessage = 'Error de conexión con el servidor';
        }
        
        await this.showToast(errorMessage, 'danger');
      }
    });
  }

  getComments() {
    if (!this.idMovie) {
      console.error('No se puede obtener comentarios: idMovie vacío');
      return;
    }

    const movieIdNum = parseInt(this.idMovie);
    if (isNaN(movieIdNum)) {
      console.error('idMovie no es un número válido:', this.idMovie);
      return;
    }

    this.serviceMovies.getComment(movieIdNum).subscribe({
      next: (response: Comment[]) => {
        this.comments = response || [];
        console.log('Comentarios obtenidos:', response);
      },
      error: (error: any) => {
        console.error('Error al obtener los comentarios:', error);
        this.comments = [];
      }
    });
  }

  getMovieDetails(movieId: string) {
    this.serviceMovies.getMovieDetails(movieId).subscribe({
      next: (datos: any) => {
        console.log('Datos recibidos:', datos);
        this.movie = datos;
      },
      error: async (error: any) => {
        console.error('Error al obtener detalles:', error);
        await this.showToast('Error al cargar detalles de la película', 'danger');
      }
    });
  }

  private async showToast(message: string, color: string = 'primary') {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      position: 'top',
      color,
      buttons: [
        {
          text: 'Cerrar',
          role: 'cancel'
        }
      ]
    });
    await toast.present();
  }
}