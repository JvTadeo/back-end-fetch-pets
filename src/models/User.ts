export class User {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
    phone: string;
    birthDate: Date;
    gender: string;
    address: string;
    stateAndCity: string;
    zip: string;
    image: string;
    politycs: boolean;
    houseNumber: number;

    constructor(
        name: string = "",
        email: string = "",
        password: string = "",
        confirmPassword: string = "",
        phone: string = "",
        birthDate: Date,
        gender: string = "",
        address: string = "",
        stateAndCity: string = "",
        zip: string = "",
        image: string = "",
        politycs: boolean = false,
        houseNumber = 0
    ) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.confirmPassword = confirmPassword;
        this.phone = phone;
        this.birthDate = birthDate;
        this.gender = gender;
        this.address = address;
        this.stateAndCity = stateAndCity;
        this.zip = zip;
        this.image = image;
        this.politycs = politycs;
        this.houseNumber = houseNumber;
    }
}