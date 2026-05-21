import { Types } from "mongoose";

export interface IUser {
    _id: string;
    name: string;
    email: string;
    password?: string;
    createdAt: string;
    updatedAt: string;
}

export interface IProductImage {
  url: string;
  publicId: string;
}

export interface IProduct {
  _id: string;
  name: string;
  description?: string;
  price: number;
  category: string;
  stock: number;
  image: IProductImage;
  user: Types.ObjectId | string | IUser; 
  createdAt: Date;
  updatedAt: Date;
}