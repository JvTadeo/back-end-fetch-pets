export class UserData {
    private profile : Object
    private token : string

    constructor(user : Object, token : string) {
        this.profile = user;
        this.token = token;
    }

    public getUserData() : Object {
        return this.profile;
    }

    public getToken() : string {
        return this.token;
    }

    public setUserData(user : Object) : void {
        this.profile = user;
    }	

    public setToken(token : string) : void {
        this.token = token;
    }
}