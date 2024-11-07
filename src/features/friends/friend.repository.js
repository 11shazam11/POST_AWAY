import mongoose from "mongoose";
//Schema
import { friendSchema } from "./friend.schema.js";
import { userModel } from "../User/user.repository.js";
import { ApplicationError } from "../error-handeler/application_error.js";

//friend Schema
const friendModel = mongoose.model("Friend",friendSchema);

export class FriendRepo{
    //add Friend
    async addFriend(userId,friendId){
        try{

             // Check if a request already exists
             const existingRequestSender = await friendModel.findOne({
                userId: new mongoose.Types.ObjectId(userId),
                "sent.userId": new mongoose.Types.ObjectId(friendId),
            });

            const existingRequestReceiver = await friendModel.findOne({
                userId: new mongoose.Types.ObjectId(friendId),
                "recived.userId": new mongoose.Types.ObjectId(userId),
            });

            // If request exists, remove for both sender and receiver
            if (existingRequestSender && existingRequestReceiver) {
                await friendModel.updateOne(
                    { userId: new mongoose.Types.ObjectId(userId) },
                    { $pull: { sent: { userId: new mongoose.Types.ObjectId(friendId) } } }
                );

                await friendModel.updateOne(
                    { userId: new mongoose.Types.ObjectId(friendId) },
                    { $pull: { recived: { userId: new mongoose.Types.ObjectId(userId) } } }
                );

                return { success: true, msg: "Friend request removed successfully" };
            }

            //Otherwise
            //1.Add sent request
            let sendRequest = await friendModel.findOneAndUpdate(
                {userId: new mongoose.Types.ObjectId(userId)},
                { $setOnInsert:                                              //Create new Document if not present
                    {
                        userId:new mongoose.Types.ObjectId(userId),
                        recived:[],
                        friends:[]
                    },
                    $addToSet:{sent:{userId:new mongoose.Types.ObjectId(friendId),status:true}}         //add only if not present no duplicate
                },
                {upsert:true,new:true}
            );

            //2.Add Recived request
            let reciveRequest = await friendModel.findOneAndUpdate(
                {userId: new mongoose.Types.ObjectId(friendId)},
                {$setOnInsert:
                    {
                        userId:new mongoose.Types.ObjectId(friendId),
                        sent:[],
                        friends:[]
                    },
                    $addToSet:{recived:{userId:new mongoose.Types.ObjectId(userId),status:true}}
                },
                {upsert:true,new:true}
            );

            return {success:true,msg:"Requeest Sent Successfully"};

        }catch(error){
            throw error;
        }
    }

    //Get user Friends
    async getFriends(userId) {
        try {
            // Find the user's friend document and populate the userId in the friends array
            let user = await friendModel
                .findOne({ userId: userId })
                .populate("friends.userId", "name email"); // Populate userId and specify fields you want to return
    
            if (!user) throw new ApplicationError("User not Found",404);
    
            return { success: true, resp: user.friends };
        } catch (error) {
            throw error;
        }
    }
    


    //Accept request or Reject
    async handelRequest(userId,friendId,action){
        try{
            //Reciver document
            let request = await friendModel.findOne({userId:new mongoose.Types.ObjectId(userId),"recived.userId":new mongoose.Types.ObjectId(friendId)});
            //Sender Document
            let sender = await friendModel.findOne({userId: new mongoose.Types.ObjectId(friendId),"sent.userId":new mongoose.Types.ObjectId(userId)}); 
            //If request is not present
            if(!request) throw new ApplicationError("Unable to find Request",404);
            //In sender sent[] array find the index
            let senderIndex = sender.sent.findIndex(r => r.userId.toString() === userId);
            //in Reciver recived[] array recive user index
            let requestIndex = request.recived.findIndex(r => r.userId.toString() === friendId);
            //If user accepets request
            if(action === 'accept'){
                //1.Remove from recived
                //2.Add to friends
                request.recived[requestIndex].status = true;
                request.recived.splice(requestIndex,1);
                request.friends.push({userId:new mongoose.Types.ObjectId(friendId)});

                //On Sender Side
                //1.Remove from sent
                //2.Add to friend
                sender.sent.splice(senderIndex,1);
                sender.friends.push({userId: new mongoose.Types.ObjectId(userId)});

            }else if(action === "reject"){
                request.recived.splice(index,1)
            }

            //Save both Data
            await request.save();
            await sender.save();

            return {success:true,msg:`Request ${action}ed Successfully`};
        }catch(error){
            throw error;
        }
    }

    //get user Recived request
    async recivedRequest(userId){
        try{
            let user = await friendModel.findOne({userId:new mongoose.Types.ObjectId(userId)},{userId:1,_id:0}).populate({
                path:'recived.userId',
                select:'name'
            });
            let reciverList = user.recived;
            if(reciverList.length==0){
                return {success:true,msg:"No Requests yet"}
            }
            return {success:true,reciverList};
        }catch(error){
            throw error;
        }
    }

    //get Sent Requests
    async sentRequest(userId){
        try{
            let user = await friendModel.findOne({userId:new mongoose.Types.ObjectId(userId)},{userId:1,_id:0}).populate({
                path:'recived.userId',
                select:'name'
            });
            let sentList = user.sent;
            if(sentList.length==0){
                return {success:true,msg:"No Requests Sent yet"}
            }
            return {success:true,sentList};
        }catch(error){
            throw error;
        }
    }
}