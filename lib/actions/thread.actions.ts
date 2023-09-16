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


//cette fonction permet de fetcher les posts et aussi faire la pagination !!!
export async function fetchPost(pageNumber=1,pageSize=20){
    connectToDB()

    const skipsAmount=(pageNumber-1)*pageSize

    //ftech post qui non pas des parrent (top level thread ..)
    const postQuery=Thread.find({parentId:{$in:[null,undefined]}})
    .sort({createAt:'desc'}).skip(skipsAmount)
    .limit(pageSize).populate({path:'author',model:User})
    .populate({path:'childrent',populate:{
        path:'author',model:User,select:"_id name parentId image"
    }})

    const totalPostsCount=await Thread.countDocuments({parentId:{$in:[null,undefined]}})
    const posts=await postQuery.exec();

    const isNext=totalPostsCount > skipsAmount + posts.length;

    return {posts,isNext}
}

export async function fetchThreadById(id:string){
    connectToDB();

    try {
        //TODO: populaite community
        const thread=await Thread.findById(id)
        .populate({
            path:'author',
            model:User,
            select:'_id id name image'

        }).populate({
            path:'childrent',
            populate:[{
                path:'author',
                model:User,
                select:'_id id name parentId image'
            },{
                path:'childrent',
                model:Thread,
                populate:{
                    path:'author',
                    model:User,
                    select:'_id id name parentId image'
                }
            }] 
        }).exec()
        return thread
    } catch (error:any) {
        throw new Error(`Error fetching thread recursive: ${error.message}`)
    }
}