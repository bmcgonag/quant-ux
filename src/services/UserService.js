import AbstractService from './AbstractService'
import Logger from '../common/Logger'
import Cookies from 'js-cookie'

class UserService extends AbstractService{

    constructor () {
        super()
        this.logger = new Logger('UserService')
        this.language = 'en'
        this.GUEST = {
            id: -1,
            name: "Guest",
            email: "guest@quant-ux.com",
            role: "guest",
            lastlogin: 0,
            lastNotification: 0,
            tos: false,
            paidUntil: 0,
            plan: "Free"
        }
    }

    signup (data) {
        return this._post('/rest/user', data)
    }

    async login (data) {
        let user = await this._post('rest/login/', data)
        if (!user.errors) {
            this.setUser(user)
        }
        return user;
    }

    save (userID, data) {
        return this._post('rest/user/' + userID + ".json", data)
    }

    logout () {
        localStorage.removeItem('quxUser');
        Cookies.remove('quxUserLoggedIn')
        return this._delete('rest/login/')
    }

    reset (email) {
        return this._post('/rest/user/password/request', {email: email})
    }

    reset2 (email, password, token) {
        let data = {
            email: email,
            password: password,
            key: token
        }
        return this._post('/rest/user/password/set', data)
    }

    retire () {
        this.logger.error('retire', 'THIS IS DEV... Did not retire user...')
        // return this._get('/rest/retire')
    }

    load () {
        if (!this.user) {
            this.logger.info('getUser()', 'load')
            let s = localStorage.getItem('quxUser')
            if (s) {
                try {
                    let user = JSON.parse(s)
                    this.setTTL(user)
                    if (this.isValidUser(user)) {
                        this.user = user
                        this.setToken(this.getToken())
                    } else {
                        this.user = this.GUEST
                    }
                } catch (error) {
                    this.logger.error('getUser', 'could not parse', s)
                    this.user = this.GUEST
                }
            } else {
                this.user = this.GUEST
            }
        }
        return this.user
    }

    async loadById (id) {
        return await this._get('/rest/user/' + id + '.json')
    }

    getNotications () {
        return this._get('/rest/notifications.json')
    }

    setLastNotication () {
        return this._post('/rest/user/notification/last.json')
    }

    getLastNotication () {
        return this._get('/rest/user/notification/last.json')
    }

    getUser () {
        return this.user
    }

    getToken () {
        /**
         * We moght have an issue here on forst loads!. Make sure we chhecke the local storage.
         */
        if (!this.user) {
            this.load()
        }

        if (this.user && this.user.token) {
            if (this.isValidUser(this.user)) {
                return this.user.token
            } else {
                this.logger.error('getToken', 'Error > Token has timed out')
                if (this.errorHandler) {
                    this.errorHandler('', {
                        tokenTimedOut: true
                    })
                }
            }
        }
        return null;
    }

    isValidUser (u) {
        if (u.exp && u.exp > 0) {
            if (u.exp > new Date().getTime()) {
                return true
            } else {
                this.logger.error('isValidUser', 'Error > Token has timed out')
                this.logout()
                location.href= "#/"
            }
        }
        return false
    }

    setTTL (u) {
        if (u.token) {
            let jwt = this.parseJwt(u.token)
            if (jwt) {
                // JWT uses seconds
                u.exp = jwt.exp * 1000
                this.logger.log(-1, 'setTTL', 'exit > User valid until', new Date(u.exp))
            } else {
                this.logger.log(-1, 'setTTL', 'exit > NO token')
            }
        }
    }

    parseJwt (token) {
        try {
            var base64Url = token.split('.')[1];
            var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));
            return JSON.parse(jsonPayload);
        } catch (e) {
            this.logger.error('parseJwt', 'error > could not parse token', e)
        }
        return null
    }

    setUser (u) {
        this.setTTL(u)
        this.user = u
        localStorage.setItem('quxUser', JSON.stringify(u));
        if (location.hostname === 'quant-ux') {
            Cookies.set('quxUserLoggedIn', 'true', { expires: 7, secure: true, domain: '.quant-ux.com'}) 
        } else {
            Cookies.set('quxUserLoggedIn','true', { expires: 7, secure: true })
        }   
    }

    setLanguage (langauge) {
        this.language = langauge
        localStorage.setItem('quxLanguage', this.language);
    }

    getLanguage () {
        let s = localStorage.getItem('quxLanguage')
        if (s) {
            this.language = s
        } else {
            this.language = navigator.language
        }
        return this.language
    }

    contact (name, email, message) {
        return this._post("/rest/contact", {
            name: name,
            email: email,
            message: message
        })
    }

    deleteImage (user) {
        return this._delete( "/rest/user/" + user.id + "/images/" + user.image);
    }

}
export default new UserService()