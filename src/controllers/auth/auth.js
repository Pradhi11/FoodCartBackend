import { Customer, DeliveryPartner } from '../../models/user.js'
import jwt from 'jsonwebtoken'


const genrateTokens = (user) => {
    const accessToken = jwt.sign(
        { userId: user._id, role: user.role },
        process.env.ASSESS_TOKEN_SECRATE,
        { expiresIn: '1d' }
    )

    const refreshToken = jwt.sign(
        { userId: user._id, role: user.role },
        process.env.REFRESH_TOKEN_SECRATE,
        { expiresIn: '7d' }
    )

    return { accessToken, refreshToken }
}

export const loginCustomer = async (req, reply) => {
    try {

        const phone = req.body;
        let customer = await Customer.findOne(phone); 

        if (!customer) {
            customer = new Customer({
                phone,
                role: "Customer",
                isActivated: true
            });
            await customer.save()
        }
        const { accessToken, refreshToken } = genrateTokens(customer)

        return reply.send({
            message: "Login Sucessfully",
            accessToken,
            refreshToken,
            customer

        })

    } catch (err) {
        console.log("An error encounter", err)
        return reply.status(500).send({ message: "An error encounter", err })
    }
}


export const loginDeliveryPartner = async (req, reply) => {
    try {

        const { email, password } = req.body;
        let deliveryPartner = await DeliveryPartner.findOne({ email })

        if (!deliveryPartner) {
            return reply.status(400).send({ message: "Delivery partner not found" })
        }

        const isMatch = password == deliveryPartner.password

        if (!isMatch) {
            return reply.status(400).send({ message: "Invalid credentials" })
        }

        const { accessToken, refreshToken } = genrateTokens(deliveryPartner)

        return reply.send({
            message: "Login Sucessfully",
            accessToken,
            refreshToken,
            deliveryPartner

        })

    } catch (err) {
        return reply.status(500).send({ message: "An error encounter", err })
    }
}

export const refreshToken = async (req, reply) => {
    try {

        const { refreshToken } = req.body;

        if (!refreshToken) {
            return reply.status(401).send({ message: "refresh token required" })
        }

        const decode = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRATE)
        let user;

        if (decode.role == "Customer") {
            user = await Customer.findById(decode.userId)

        } else if (decode.role == "DeliveryPartner") {
            user = await DeliveryPartner.findById(decode.userId)
        } else {
            return reply.status(403).send({ message: "Invalid role" })
        }

        if (!user) {
            return reply.status(403).send({ message: "User Not found" })
        }

        const { accessToken, refreshToken: newRefreshToken } = genrateTokens(user)

        return reply.send({
            message: "Token refreshed",
            accessToken,
            refreshToken,
            newRefreshToken

        })


    } catch (err) {
        return reply.status(401).send({ message: "refresh token required", err })
    }
}



export const fetchUser = async (req, reply) => {
    try {

        const { userId, role } = req.body;
        let user;

        if (role == "Customer") {
            user = await Customer.findById(userId)

        } else if (role == "DeliveryPartner") {
            user = await DeliveryPartner.findById(userId)
        } else {
            return reply.status(403).send({ message: "Invalid role" })
        }

        if (!user) {
            return reply.status(403).send({ message: "User Not found" })
        }


        return reply.send({
            message: "User featch sucessfully",
            user,

        })


    } catch (err) {
        return reply.status(401).send({ message: "refresh token required", err })
    }
}