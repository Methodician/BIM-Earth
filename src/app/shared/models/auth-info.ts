export class AuthInfo {
    constructor(
        public $uid: string,
        public emailVerified = false,
        public displayName = 'Username',
        public email = 'filler@full.yodle',
        public photoURL = "http://fillmurray.com/300/300"
    ) { }

    isLoggedIn() {
        //console.log('uid:', this.$uid);
        return !!this.$uid;
    }

    isEmailVerified() {
        //console.log('emailVerified:', this.emailVerified);
        return !!this.emailVerified;
    }
}
