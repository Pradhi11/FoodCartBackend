import { Customer, DeliveryPartner } from "../../models/user.js";
import Branch from "../../models/branch.js";
import  Order  from "../../models/order.js";


export const createOrder = async (req, reply) => {
    try {
        const { userId } = req.user;
        const { items, branch, totalPrice } = req.body

        const customerData = await Customer.findById(userId)
        const branchData = await Branch.findById(branch)

        if (!customerData) {
            return reply.status(400).send({ message: "User Not Found" })
        }

        const newOrder = new Order({
            customer: userId,
            items: items.map((item) => ({
                id: item.id,
                item: item.item,
                count: item.count
            })),
            branch,
            totalPrice,
            deliveryLocation: {
                latitude: customerData.liveLocation.latitude,
                longitude: customerData.liveLocation.longitude,
                address: customerData.address || "No Address avaliable",
            },
            pickupLocation: {
                latitude: branchData.liveLocation.latitude,
                longitude: branchData.liveLocation.longitude,
                address: branchData.address || "No Address avaliable",
            }
        });
        const saveOrder = await newOrder.save()
        return reply.send(201).send(saveOrder)

    } catch (error) {
        return reply.status(500).send({ message: "An errror occured", error })

    }
}

export const confirmOrder = async (req, reply) => {
    try {
        const { orderId } = req.params;
        const { userId } = req.user;
        const { deliveryPersonLocation } = req.body

        const deliveryPerson = await DeliveryPartner.findById(userId)

        if (!deliveryPerson) {
            return reply.status(400).send({ message: "Delivery Person Not Found" })
        }
        const order = await Order.findById(orderId)
        if (!order) {
            return reply.status(400).send({ message: "order Not Found" })
        }
        if (order.status !== "available") {
            return reply.status(400).send({ message: "order Not Found" })
        }

        order.status == "confirmed"

        order.deliveryPartner = userId;
        order.deliveryPersonLocation = {
            latitude: deliveryPersonLocation.liveLocation.latitude,
            longitude: deliveryPersonLocation.liveLocation.longitude,
            address: deliveryPersonLocation.address || "No Address avaliable",
        };

        req.server.io.to(orderId).emit('orderConfirmed', order);
        await order.save()

        return reply.send(order)

    } catch (error) {
        return reply.status(500).send({ message: "An errror occured", error })

    }

}

export const updateOrderStatus = async (req, reply) => {
    try {

        const { orderId } = req.params;
        const { userId } = req.user;
        const { status, deliveryPersonLocation } = req.body

        const deliveryPerson = await DeliveryPartner.findById(userId)

        if (!deliveryPerson) {
            return reply.status(400).send({ message: "Delivery Person Not Found" })
        }

        const order = await Order.findById(orderId)
        if (!order) {
            return reply.status(400).send({ message: "order Not Found" })
        }

        if (["cancelled", "delivered"].includes(order.status)) {
            return reply.status(400).send({ message: "order Cannot be updated" })
        }

        if (order.deliveryPartner.toString() !== userId) {
            return reply.status(403).send({ message: "Unauthorised" })
        }

        order.status = status
        order.deliveryPersonLocation = deliveryPersonLocation
        await order.save();
        req.server.io.to(orderId).emit("liveTrackingUpdates", order);
        return reply.send(order)

    } catch (error) {
        return reply.status(500).send({ message: "An errror occured", error })

    }
}

export const getOrders = async (req, reply) => {
    try {
        const { status, customerId, deliveryPartnerId, branchId } = req.query
        let query = {}

        if (status) {
            query.status = status
        }
        if (customerId) {
            query.customer = customerId
        }
        if (deliveryPartnerId) {
            query.deliveryPartner = deliveryPartnerId
            query.branch = branchId
        }


        const orders = await Order.find(query).populate("Customer branch items.item.deliveryPartner");
        return reply.send(orders)
    } catch (error) {
        return reply.status(500).send({ message: "An errror occured", error })
    }
}

export const getOrderById = async (req, reply) => {
    try {
        const { orderId } = req.params

        const order = await Order.findById(orderId).populate("Customer branch items.item.deliveryPartner");

        if (!order) {
            return reply.status(400).send({ message: "order Not Found" })
        }

        return reply.send(order)

    } catch (error) {
        return reply.status(500).send({ message: "An errror occured", error })
    }
}