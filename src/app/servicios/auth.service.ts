import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError, firstValueFrom } from 'rxjs';

export interface RegisterData {
  user: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  users?: {
    user: string;
    email: string;
    [key: string]: any;
  };
  token?: string;
  success?: boolean;
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private API_URL = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  // 🔧 MÉTODO CORREGIDO - El problema estaba aquí
  async authenticateUser(
    email: string,
    password: string
  ): Promise<{ success: boolean; token?: string; id?: string; message?: string }> {
    try {
      const response: any = await firstValueFrom(
        this.http.post(`${this.API_URL}/login`, { email, password }).pipe(
          catchError(error => throwError(() => error))
        )
      );

      console.log('Respuesta completa del backend:', response);

      if (response?.token) {
        // ✅ CORRECCIÓN: Acceder al ID desde dataUser, no directamente desde response
        if (response.dataUser?.id) {
          console.log('ID recibido del backend:', response.dataUser.id);
          return {
            success: true,
            token: response.token,
            id: response.dataUser.id.toString() // ✅ Acceder correctamente al ID
          };
        } else {
          console.error('⚠️ Token recibido pero falta el ID del usuario');
          console.error('Estructura de respuesta:', JSON.stringify(response, null, 2));
          return {
            success: true,
            token: response.token,
            message: 'Login exitoso pero falta información del usuario'
          };
        }
      }

      return { success: false, message: 'No se recibió token del servidor' };
    } catch (error: any) {
      console.error('Error en authenticateUser:', error);
      
      if (error?.status === 400 || error?.status === 401) {
        return { success: false, message: error.error?.message || 'Credenciales inválidas' };
      } else {
        return { success: false, message: 'Error del servidor o de red. Intenta más tarde.' };
      }
    }
  }

  // ✅ Método para registrar usuario
  async registerUser(userData: RegisterData): Promise<AuthResponse> {
    try {
      const headers = new HttpHeaders({
        'Content-Type': 'application/json'
      });

      const response = await firstValueFrom(
        this.http.post<AuthResponse>(`${this.API_URL}/register`, userData, { headers })
      );
      
      console.log('Respuesta del backend:', response);
      return response || { success: false, message: 'Error desconocido' };

    } catch (error: any) {
      console.error('Error en registerUser:', error);
      
      if (error.status === 409) {
        return { success: false, message: 'El email ya está registrado' };
      } else if (error.status === 400) {
        return { success: false, message: 'Datos inválidos' };
      } else if (error.status === 0) {
        return { success: false, message: 'Error de conexión con el servidor' };
      }

      return {
        success: false,
        message: error.error?.message || 'Error al registrar usuario'
      };
    }
  }

  // ✅ Método para verificar si email existe
  async checkEmailExists(email: string): Promise<boolean> {
    try {
      const response = await firstValueFrom(
        this.http.get<{ exists: boolean }>(`${this.API_URL}/usuarios/check-email/${email}`)
      );
      return response?.exists || false;
    } catch (error) {
      console.error('Error checking email:', error);
      return false;
    }
  }
}