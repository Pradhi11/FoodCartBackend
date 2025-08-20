import { Customer, DeliveryPartner } from "../../models/index.js";



export const updateUser = async(req,reply)=>{

      try {

        const {userId} = req.user;
        const updateData = req.body

        let user = await Customer.findById(userId) || await DeliveryPartner.findById(userId)
        if(!user){
     return reply.status(404).send({ message: "User Not found", error })
  
        }

        let userModel
        if(user.role == "Customer"){
            userModel = Customer

        }else if(user.role == "DeliveryPartner"){
            userModel = DeliveryPartner

        }else{
                     return reply.status(400).send({ message: "Invalid role" })

        }

        const updatedUser = await userModel.findByIdAndUpdate(
            userId,
            {$set: updateData},
            {new:true, runValidators : true}
        );

        if(!updatedUser){
            return reply.status(400).send({ message: "User Not Found" })
        }

        return reply.send({
            message:"User updated sucessfully",
            user:updatedUser
        })


      } catch (error) {
         return reply.status(500).send({ message: "An errror occured", error })
      }
}