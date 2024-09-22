import LoginForm from "@/components/Login";
import Wrapper from "@/components/Wrapper";
import { Suspense } from "react";

export default function LoginPage () {
    return(
        <Wrapper>
            <div className="flex justify-center w-full ">
                <Suspense>
                    <LoginForm />
                </Suspense>
            </div>
        </Wrapper>
    )
}