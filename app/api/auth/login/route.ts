import { generateToken, hashPassword, verifyPassword } from "@/app/lib/auth";
import prisma from "@/app/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {

        const { email, password } = await request.json();

        const findUser = await prisma.user.findUnique({
            where: {
                email: email
            },
            include: {
                team: true
            }
        });

        if (!findUser) {
            return NextResponse.json({
                error: "Enter a valid email"
            }, { status: 404 })
        }

        const comparePassword = await verifyPassword(password, findUser.password);

        if (!comparePassword) {
            return NextResponse.json(
                {
                    error: "enter a valid password"
                },
                {
                    status: 404
                }
            )
        }

        const token = generateToken(findUser.id)

        const response = NextResponse.json({
            user: {
                id: findUser.id,
                name: findUser.name,
                email: findUser.email,
                role: findUser.role,
                teamId: findUser.teamId,
                team: findUser.team,
                token,
            }
        })

        response.cookies.set("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 7
        })

        return response;


    } catch (error) {

        console.error("Logined failed")
        return NextResponse.json({
            error: "Internal server error something went wrong",
        }, { status: 500 })

    }

}