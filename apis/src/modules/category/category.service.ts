import { category, categoryDocument } from '@entities/category.entities';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class CategoryService { 
    constructor(
        @InjectModel(category.name)
        private categoryModel: Model<categoryDocument>,
    ){}

    async getCategory(){
        return this.categoryModel.find({deletedAt:null})
    }

    async getOne(id: string): Promise<any>{
        return this.categoryModel.findById(id).where({deletedAt: null})
    }

    async create(payload:any): Promise<any>{

        return new this.categoryModel(payload).save();
    }

    async update(id:string, payload:any): Promise<any>{
        await this.categoryModel.findByIdAndUpdate(id, payload)
        return "Success"
    }

    async softDelete(id:string): Promise<any>{
        return await this.categoryModel.findOneAndUpdate(
            { _id: id, deletedAt: { $eq: null } },
            { deletedAt: new Date() },
          )
    }
}
