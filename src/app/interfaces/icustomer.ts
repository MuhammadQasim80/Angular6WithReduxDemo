export interface Icustomer {
    customerID: number;
    name: Iname;
    birthday: any;
    gender: string;
    lastContact: any;
    customerLifetimeValue: number;
}

export interface Iname {
    first: string;
    last: string;
}
