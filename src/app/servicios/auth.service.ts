import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError, firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private API_URL = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

async authenticateUser(email: string, password: string): Promise<{ success: boolean, message?: string }> {
  try {
    const response: any = await firstValueFrom(
      this.http.post(`${this.API_URL}/login`, { email, password }).pipe(
        catchError(error => throwError(() => error))
      )
    );

    if (response?.token) {
      localStorage.setItem('token', response.token);
      return { success: true };
    }

    return { success: false, message: 'No se recibió token del servidor' };
  } catch (error: any) {
    if (error?.status === 400 || error?.status === 401) {
      return { success: false, message: error.error?.message || 'Credenciales inválidas' };
    } else {
      return { success: false, message: 'Error del servidor o de red. Intenta más tarde.' };
    }
  }
  }
}
