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
    id?: string | number;
    user: string;
    email: string;
    [key: string]: any;
  };
  token?: string;
  success?: boolean;
  message?: string;
  id?: string | number; // Por si el ID viene directamente en la respuesta
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private API_URL = 'https://baselogrob-production.up.railway.app/api';

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

  // ✅ MÉTODO MEJORADO PARA REGISTRAR USUARIO
  async registerUser(userData: RegisterData): Promise<AuthResponse> {
    try {
      const headers = new HttpHeaders({
        'Content-Type': 'application/json'
      });

      const response: any = await firstValueFrom(
        this.http.post(`${this.API_URL}/register`, userData, { headers })
      );
      
      console.log('Respuesta completa del registro:', response);

      // ✅ VERIFICAR QUE LA RESPUESTA CONTENGA LOS DATOS NECESARIOS
      if (response?.token && response?.users) {
        return {
          success: true,
          token: response.token,
          users: {
            id: response.users.id || response.id, // ID puede venir de diferentes lugares
            user: response.users.user || response.users.nombre || userData.user,
            email: response.users.email || userData.email,
            ...response.users // Incluir cualquier otro dato adicional
          },
          message: 'Registro exitoso'
        };
      } else if (response?.token) {
        // Si solo viene el token pero no los datos del usuario
        return {
          success: true,
          token: response.token,
          users: {
            user: userData.user,
            email: userData.email,
            id: response.id || null
          },
          message: 'Registro exitoso'
        };
      }

      // Si no hay token, es un error
      return { 
        success: false, 
        message: response?.message || 'Error en el registro - no se recibió token' 
      };

    } catch (error: any) {
      console.error('Error en registerUser:', error);
      
      // ✅ MANEJO DETALLADO DE ERRORES
      if (error.status === 409) {
        return { success: false, message: 'El email ya está registrado' };
      } else if (error.status === 400) {
        return { 
          success: false, 
          message: error.error?.message || 'Datos inválidos. Verifica tu información.' 
        };
      } else if (error.status === 0) {
        return { success: false, message: 'Error de conexión con el servidor' };
      } else if (error.status >= 500) {
        return { success: false, message: 'Error interno del servidor. Intenta más tarde.' };
      }

      return {
        success: false,
        message: error.error?.message || 'Error desconocido al registrar usuario'
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

  // ✅ MÉTODO ADICIONAL PARA OBTENER DATOS DEL USUARIO GUARDADO
  getCurrentUserData() {
    return {
      token: localStorage.getItem('token'),
      email: localStorage.getItem('userEmail'),
      id: localStorage.getItem('id'),
      userName: localStorage.getItem('userName')
    };
  }

  // ✅ MÉTODO PARA LIMPIAR DATOS DE SESIÓN (LOGOUT)
  clearUserData() {
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('id');
    localStorage.removeItem('userName');
    console.log('Datos de usuario eliminados del almacenamiento');
  }

  // ✅ MÉTODO PARA VERIFICAR SI EL USUARIO ESTÁ AUTENTICADO
  isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('id');
    return !!(token && userId);
  }
}