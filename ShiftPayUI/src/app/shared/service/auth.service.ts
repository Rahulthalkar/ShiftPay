import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<any>;
  public currentUser$: Observable<any>;

  constructor() {
    const savedUser = sessionStorage.getItem('currentUser');
    this.currentUserSubject = new BehaviorSubject<any>(savedUser ? JSON.parse(savedUser) : null);
    this.currentUser$ = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): any {
    return this.currentUserSubject.value;
  }

  saveSession(loginResult: any) {
    // loginResult.value contains ID, Name, RoleId, Token, etc.
    const userSession = {
      id: loginResult.value.id,
      firstName: loginResult.value.firstName,
      userName: loginResult.value.userName,
      email: loginResult.value.email,
      roleId: loginResult.value.roleId,
      companyId: loginResult.value.companyId,
      managerId: loginResult.value.managerId,
      token: loginResult.value.token
    };
    sessionStorage.setItem('currentUser', JSON.stringify(userSession));
    this.currentUserSubject.next(userSession);
  }

  getToken(): string | null {
    const user = this.currentUserValue;
    return user ? user.token : null;
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  getUserRole(): number | null {
    const user = this.currentUserValue;
    return user ? user.roleId : null;
  }

  logout() {
    sessionStorage.removeItem('currentUser');
    sessionStorage.clear();
    this.currentUserSubject.next(null);
  }
}
