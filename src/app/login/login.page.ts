import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonIcon, IonLabel, IonItem } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { ViewChild } from '@angular/core';
import { IonInput } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { logoFacebook, logoGoogle, lockClosedOutline, mailOutline, eyeOffOutline, logInOutline } from 'ionicons/icons'; // Importar icono de Facebook
import { AuthService } from '../servicios/autch.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonItem, IonLabel, IonIcon, IonButton, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class LoginPage {
  email: string = '';
  password: string = '';
  showPassword: boolean = false;
  rememberMe: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private toastController: ToastController,
  ) {
     addIcons({logoFacebook,logoGoogle, lockClosedOutline, mailOutline, eyeOffOutline, logInOutline}); // Añadir iconos de Ionicons
  }
 @ViewChild('passwordInput', { static: false }) passwordInput!: IonInput;

  togglePassword() {
    this.showPassword = !this.showPassword;
    const newType = this.showPassword ? 'text' : 'password';
    this.passwordInput.type = newType;
  }
 // Alternar visibilidad de contraseña
 
  // Función principal de login
  async onLogin() {
  if (!this.validateForm()) {
    return;
  }

  const loading = await this.loadingController.create({
    message: 'Iniciando sesión...',
    spinner: 'crescent'
  });
  await loading.present();

  try {
    // Llamada real al backend
    const response = await this.authService.login(this.email, this.password).toPromise();

    if (response && response.token) {
      this.authService.saveToken(response.token); // guarda el token en localStorage

      await this.showToast('¡Bienvenido! Sesión iniciada correctamente', 'success');

      if (this.rememberMe) {
        this.saveUserCredentials();
      }

      this.router.navigate(['/tabs']);
    } else {
      await this.showAlert('Error de autenticación', 'Credenciales incorrectas. Por favor, verifica tu email y contraseña.');
    }
  } catch (error: any) {
    await this.showAlert('Error', error.error?.message || 'Error en el inicio de sesión.');
    console.error('Login error:', error);
  } finally {
    await loading.dismiss();
  }
}

  // Validar formulario
  private validateForm(): boolean {
    if (!this.email || !this.password) {
      this.showToast('Por favor, completa todos los campos', 'warning');
      return false;
    }

    if (!this.isValidEmail(this.email)) {
      this.showToast('Por favor, ingresa un email válido', 'warning');
      return false;
    }

    if (this.password.length < 6) {
      this.showToast('La contraseña debe tener al menos 6 caracteres', 'warning');
      return false;
    }

    return true;
  }

  // Validar formato de email
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Simular autenticación (reemplazar con tu lógica real)
  private async authenticateUser(email: string, password: string): Promise<boolean> {
    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Aquí implementarías la llamada real a tu API
    // return this.authService.login(email, password);
    
    // Por ahora, simular éxito si el email contiene "@"
    return email.includes('@') && password.length >= 6;
  }

  // Guardar credenciales para recordar sesión
  private saveUserCredentials() {
    // Implementar lógica de almacenamiento seguro
    // localStorage.setItem('userEmail', this.email);
    // Nota: Nunca guardes contraseñas en texto plano
    console.log('Guardando credenciales para recordar sesión');
  }

  // Recuperar contraseña
  async forgotPassword() {
    const alert = await this.alertController.create({
      header: 'Recuperar Contraseña',
      message: 'Ingresa tu email para recibir instrucciones de recuperación',
      inputs: [
        {
          name: 'email',
          type: 'email',
          placeholder: 'tu@email.com',
          value: this.email
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Enviar',
          handler: async (data) => {
         if (data.email && this.isValidEmail(data.email)) {
         // Implementar lógica de recuperación
         await this.showToast('Instrucciones enviadas a tu email', 'success');
         return true; // <- Añadido
         } else {
         await this.showToast('Por favor, ingresa un email válido', 'warning');
         return false;
         }
         }
        }
      ]
    });

    await alert.present();
  }

  // Ir a registro
  goToSignup() {
    this.router.navigate(['/signup']);
  }

  // Login con Google
  async loginWithGoogle() {
    const loading = await this.loadingController.create({
      message: 'Conectando con Google...',
      spinner: 'crescent'
    });
    await loading.present();

    try {
      // Implementar lógica de Google Sign-In
      // const result = await this.googleAuth.signIn();
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simular delay
      
      await this.showToast('Próximamente: Login con Google', 'primary');
    } catch (error) {
      await this.showAlert('Error', 'No se pudo conectar con Google');
    } finally {
      await loading.dismiss();
    }
  }

  // Login con Facebook
  async loginWithFacebook() {
    const loading = await this.loadingController.create({
      message: 'Conectando con Facebook...',
      spinner: 'crescent'
    });
    await loading.present();

    try {
      // Implementar lógica de Facebook Login
      // const result = await this.facebookAuth.login();
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simular delay
      
      await this.showToast('Próximamente: Login con Facebook', 'primary');
    } catch (error) {
      await this.showAlert('Error', 'No se pudo conectar con Facebook');
    } finally {
      await loading.dismiss();
    }
  }

  // Mostrar toast
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

  // Mostrar alerta
  private async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK']
    });
    await alert.present();
  }
}