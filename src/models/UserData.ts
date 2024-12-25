export class UserData {
    private user : Object
    private token : string

    constructor(user : Object, token : string) {
        this.user = user;
        this.token = token;
    }

    public getUserData() : Object {
        return { user: this.user, token: this.token };
    }

    public getToken() : string {
        return this.token;
    }

    public setUserData(user : Object) : void {
        this.user = user;
    }	

    public setToken(token : string) : void {
        this.token = token;
    }
}