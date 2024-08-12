import {Column, Entity, PrimaryGeneratedColumn} from "typeorm"

@Entity({name:"users"})
export class User {
    @PrimaryGeneratedColumn()
    id:number

    @Column({type:"varchar", length:50})
    name:string

    @Column({type:"varchar", length:100})
    email:string

    @Column({type:"varchar", length:20})
    password:string
}
