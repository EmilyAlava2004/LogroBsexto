import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonCheckbox, IonHeader, IonTitle, IonToolbar, IonButton, IonIcon, IonLabel, IonItem } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { ViewChild } from '@angular/core';
import { IonInput } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { logoFacebook, logoGoogle, lockClosedOutline, mailOutline, eyeOffOutline, eyeOutline, personAddOutline, personCircleOutline, personOutline, checkmarkCircleOutline } from 'ionicons/icons';
import { AuthService } from '../servicios/auth.service';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
  standalone: true,
  imports: [IonItem, IonInput, IonLabel, IonCheckbox, IonIcon, IonButton, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})

export class RegistroPage  {
  
  user: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;
  acceptTerms: boolean = false;
  constructor(
     private router: Router,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private toastController: ToastController,
    private authService: AuthService
  ) {
     addIcons({
      logoFacebook,
      logoGoogle,
      lockClosedOutline,
      mailOutline,
      eyeOffOutline,
      eyeOutline,
      personAddOutline,
      personCircleOutline,
      personOutline,
      checkmarkCircleOutline
    });
   }

  @ViewChild('passwordInput', { static: false }) passwordInput!: IonInput;
  @ViewChild('confirmPasswordInput', { static: false }) confirmPasswordInput!: IonInput;

  togglePassword() {
    this.showPassword = !this.showPassword;
    const newType = this.showPassword ? 'text' : 'password';
    this.passwordInput.type = newType;
  }

  toggleConfirmPassword() {
    this.showConfirmPassword = !this.showConfirmPassword;
    const newType = this.showConfirmPassword ? 'text' : 'password';
    this.confirmPasswordInput.type = newType;
  }

  // Función principal de registro
  async onSignup() {
    if (!this.validateForm()) return;

    const loading = await this.loadingController.create({
      message: 'Creando cuenta...',
      spinner: 'crescent'
    });
    await loading.present();

    try {
      const result = await this.authService.registerUser({
        user: this.user,
        email: this.email,
        password: this.password
      });

      // ✅ Adaptado al backend actual
      if (result && result.users && result.token) {
        await this.showToast('¡Cuenta creada exitosamente!', 'success');
        await this.showWelcomeAlert(result.users.user);
        this.router.navigate(['/tabs/home']);
      } else {
        await this.showAlert('Error de registro', result.message || 'Error al crear la cuenta');
      }
    } catch (error) {
      console.error('Signup error:', error);
      await this.showAlert('Error', 'Ha ocurrido un error inesperado');
    } finally {
      await loading.dismiss();
    }
  }

  private validateForm(): boolean {
    if (!this.user || !this.email || !this.password || !this.confirmPassword) {
      this.showToast('Por favor, completa todos los campos', 'warning');
      return false;
    }

    if (this.user.trim().length < 2) {
      this.showToast('El nombre debe tener al menos 2 caracteres', 'warning');
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

    if (this.password !== this.confirmPassword) {
      this.showToast('Las contraseñas no coinciden', 'warning');
      return false;
    }

    if (!this.acceptTerms) {
      this.showToast('Debes aceptar los términos y condiciones', 'warning');
      return false;
    }

    return true;
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // ✅ Ahora recibe el nombre como argumento
  private async showWelcomeAlert(nombre: string) {
    const alert = await this.alertController.create({
      header: '¡Bienvenido!',
      message: `Hola ${nombre}, tu cuenta ha sido creada exitosamente. Ahora puedes iniciar sesión.`,
      buttons: ['Continuar']
    });

    await alert.present();
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }

  async signupWithGoogle() {
    const loading = await this.loadingController.create({
      message: 'Conectando con Google...',
      spinner: 'crescent'
    });
    await loading.present();

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      await this.showToast('Próximamente: Registro con Google', 'primary');
    } catch (error) {
      await this.showAlert('Error', 'No se pudo conectar con Google');
    } finally {
      await loading.dismiss();
    }
  }

  async signupWithFacebook() {
    const loading = await this.loadingController.create({
      message: 'Conectando con Facebook...',
      spinner: 'crescent'
    });
    await loading.present();

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      await this.showToast('Próximamente: Registro con Facebook', 'primary');
    } catch (error) {
      await this.showAlert('Error', 'No se pudo conectar con Facebook');
    } finally {
      await loading.dismiss();
    }
  }

  async showTermsAndConditions() {
    const alert = await this.alertController.create({
      header: 'Términos y Condiciones',
      message: 'Estimado ingeniero esta aplicación se ha hecho con mucho esfuerzo y dolores de cabeza, por favor se requiere una buena calificación :) ',
      buttons: [
        {
          text: 'Cerrar',
          role: 'cancel'
        },
        {
          text: 'Aceptar',
          handler: () => {
            this.acceptTerms = true;
          }
        }
      ]
    });

    await alert.present();
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

  private async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK']
    });
    await alert.present();
  }
}