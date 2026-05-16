import type { Request, Response } from "express";
import { userService } from "./user.service";

const createUser = async (req: Request, res: Response) => {
    // console.log(req.body);
    // const { name, gmail, password, age } = req.body;
    try {
        const result = await userService.createUserIntoDb(req.body);

        res.status(201).json({
            success: true,
            message: "User Created Successfully",
            data: result.rows[0]
        })
    }
    catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message,
            error: error
        })
    }
}
const getAllUsers = async (req: Request, res: Response) => {
    try {
        const result = await userService.getAllUserIntoDb()

        res.status(200).json({
            success: true,
            message: 'Users retrived Successfully',
            data: result.rows
        })
    }
    catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message,
            error: error
        })
    }
}
const getSingleUser = async (req: Request, res: Response) => {
    const { id } = req.params;
    // console.log(id)
    try {
        const result = await userService.getSingleUserIntoDb(id as string);
        // console.log(result)
        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'User Not Found',
                data: {}
            })
        }
        res.status(200).json({
            success: true,
            message: 'User retrived Successfully',
            data: result.rows[0]
        })
    }
    catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message,
            error: error
        })
    }
}
const getSingleUserUpdated = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { name, password, age, is_active } = req.body;
        // console.log(id)
        // console.log({ name, password, age, is_active });
        const result = await userService.getSingleUserUpdatedIntoDb(req.body, id as string)

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'User Not Found',
                data: {}
            })
        }

        res.status(200).json({
            success: true,
            message: 'User Updated Successfully',
            data: result.rows[0]
        })
    }
    catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message,
            error: error
        })
    }
}
const userDeleted = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const result = await userService.userDeletedIntoDb(id as string)
        if (result.rowCount === 0) {
            return res.status(404).json({
                success: false,
                message: 'User Not Found'
            })
        }
        res.status(200).json({
            success: true,
            message: 'User Deleted Successfully',
            data: {}
        })
    }
    catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message,
            error: error
        })
    }
}


export const userController = {
    createUser,
    getAllUsers,
    getSingleUser,
    getSingleUserUpdated,
    userDeleted
}