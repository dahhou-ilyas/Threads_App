"use server"
//si use server n'est pas ajouter il donne une erreure au niveau de 
//mongoose.models.Thread (cannot read propriéter of undifined)
import { revalidatePath } from "next/cache";
import Thread from "../models/Thread.model";
import User from "../models/user.model";
import { connectToDB } from "../mongoose";

interface Params{
    text:string,
    author:string,
    communityId:string | null;
    path:string
}
export async function createThread({
text,author,communityId,path
}:Params){
    try {
        connectToDB();
        const createThread=await Thread.create({
            text,author,community:null
        });

        await User.findByIdAndUpdate(author,{
            $push:{threads:createThread._id}
        })

        revalidatePath(path);
    } catch (error) {
        throw new Error('Eroor creating thread')
    }

}