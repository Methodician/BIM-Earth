import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { Observable } from 'rxjs/Observable';
import { Subject, BehaviorSubject } from 'rxjs';
import { AuthInfo } from '@models/auth-info';
import { Router } from '@angular/router';
import { AngularFirestore } from 'angularfire2/firestore';
import { AngularFireDatabase } from 'angularfire2/database';

@Injectable()
export class AuthService {
  static UNKNOWN_USER = new AuthInfo(null);
  user$: BehaviorSubject<firebase.User> = new BehaviorSubject<firebase.User>(null);
  authInfo$: BehaviorSubject<AuthInfo> = new BehaviorSubject<AuthInfo>(AuthService.UNKNOWN_USER);

  currentlyRegistering$ = new BehaviorSubject<boolean>(false);
  currentlyLoggingIn$ = new BehaviorSubject<boolean>(false);
  accountShowing: boolean = false;
  accountShowing$ = new BehaviorSubject<boolean>(false);

  private get uid() {
    return this.afAuth.auth.currentUser.uid;
  }

  constructor(
    public afAuth: AngularFireAuth,
    public router: Router,
    private db: AngularFirestore,
    private rtdb: AngularFireDatabase
  ) {
    this.afAuth.authState.subscribe(info => {
      if (info) {
        this.user$.next(info);
        const authInfo = new AuthInfo(info.uid, info.emailVerified, info.displayName, info.email, info.photoURL);
        this.authInfo$.next(authInfo);
      }
    });
  }

  register(email, password) {
    return this.fromFirebaseAuthPromise(this.afAuth.auth.createUserWithEmailAndPassword(email, password)
      .catch(error => {
        const errorCode = error.code;
        const errorMessage = error.message;
        if (errorCode == 'auth/weak-password') {
          alert('Your password should be stronger.');
        } else {
          alert(errorMessage);
        }
        console.log(error);
      }));
  }

  login(email, password) {
    return this.fromFirebaseAuthPromise(this.afAuth.auth.signInWithEmailAndPassword(email, password)
      .catch(error => {
        const errorCode = error.code;
        const errorMessage = error.message;
        if (errorCode == 'auth/wrong-password') {
          alert('Please enter the correct password.');
        } else if (errorCode == 'auth/user-not-found') {
          alert('We don\'t have any record of a user with that email address.')
        } else {
          alert(errorMessage);
        }
        console.log(error);
      }));
  }

  logout() {
    this.afAuth.auth.signOut();
    this.authInfo$.next(AuthService.UNKNOWN_USER);
    this.user$.next(null);
    location.reload();
  }

  setDisplayName(alias, photoURL: string = null) {
    let userToSet = this.afAuth.auth.currentUser;
    userToSet.updateProfile({ displayName: alias, photoURL: photoURL });
    this.rtdb.object(`userInfo/${userToSet.uid}`).set({ alias: alias, photoURL: photoURL });
  }

  sendVerificationEmail() {
    let user = this.afAuth.auth.currentUser;
    user.sendEmailVerification().then(() => {
    }, (error) => {
      alert('It looks like your verification email was not sent. Please try again or contact support.');
    });
  }

  isLoggedInCheck(): Observable<boolean> {
    return this.afAuth.authState.map(info => {
      return (info && info.uid) ? true : false;
    }
    ).take(1)
      .do(allowed => {
        if (!allowed) {
          if (confirm('You must be logged in to do that. Would you like to be redirected?'))
            this.router.navigate(['/login']);
        }
      });
  }

  fromFirebaseAuthPromise(promise): Observable<any> {
    const subject = new Subject<any>();

    promise
      .then(res => {
        console.log('res: ', res)
        const authInfo = new AuthInfo(this.afAuth.auth.currentUser.uid, res.emailVerified);
        this.authInfo$.next(authInfo);
        subject.next(res);
        subject.complete();
      },
      err => {
        this.authInfo$.error(err);
        subject.error(err);
        subject.complete();
      });
    return subject.asObservable();
  }

  toggleShowAccount() {
    this.accountShowing = !this.accountShowing;
    this.accountShowing$.next(this.accountShowing);
  }

  saveUser(userData) {
    this.db.doc(`users/${this.uid}`).set(userData);
  }

  updateUser(userData) {
    this.setDisplayName(userData.name);
    this.db.doc(`users/${this.uid}`).update(userData);
  }

  getCurrentUserData() {
    return this.db.doc(`users/${this.uid}`);
  }

  getUserInfo() {
    return this.rtdb.object('userInfo');
  }
}
