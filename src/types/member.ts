export type TMember = {
    id: number
    name: string
    date_of_birth: string
    phone: string
    whatsapp: string
    gender: string
    email: string
    address: string
    occupation: string
    marital_status: string
    img_url: string
}

export type TMemberRequest = {
    id: number
    member_name: string
    date_of_birth: string
    email: string
    phone: string
    gender: string
    marital_status: string
    occupation: string
    address: string
    location: string
    picture: File
    whatsapp: string
}

/*
address
: 
"Summit Close 3"
bacenta_id
: 
13
basonta_id
: 
6
date_of_birth
: 
Sat Jan 01 2000 00:00:00 GMT+0000 (Greenwich Mean Time) {}
email
: 
"albert.mensahansah@gmail.com"
location
: 
{lat: 5.636096, lng: -0.1769472}
marital_status
: 
"married"
member_name
: 
"Mabena Quason"
occupation
: 
"Software Engineer"
phone
: 
"+233548238146"
picture
: 
File {name: 'joana.png', lastModified: 1672186184961, lastModifiedDate: Wed Dec 28 2022 00:09:44 GMT+0000 (Greenwich Mean Time), webkitRelativePath: '', size: 271543, …}
whatsapp
: 
"+233541293823"
*/