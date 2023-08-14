import decode from 'jwt-decode';

class AuthService {
    getToken() {
        return localStorage.getItem('id_token');
    }

    login(id_token) {
        localStorage.setItem('id_token', id_token);
        window.location.assign('/');
    }

    loggedIn() {
        const token = this.getToken();
        console.log(token);
        return token && !this.isTokenExpired(token);
    }

    logout() {
        localStorage.removeItem('id_token');
        window.location.reload();
    }

    isAdmin() {
        console.log('Running isAdmin() now...');
        var token = this.getToken();
        const decodedToken = decode(token);
        console.log("Token: ", decodedToken);
        console.log('Checking Admin Access...: ', decodedToken.data.adminAccess);
        return decodedToken.data.adminAccess;
    }

    isTokenExpired(token) {
        const decodedToken = decode(token);

        if (decodedToken.exp < Date.now() / 1000) {
            console.log("Token is expired.");
            localStorage.removeItem('id_token');
            return true;
        }
        console.log("Toekn is not expired.");
        return false;
    }
};

export default new AuthService();