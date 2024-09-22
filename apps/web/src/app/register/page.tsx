import RegisterForm from "@/components/Register";
import Wrapper from "@/components/Wrapper";

export default function RegisterPage () {
    return (
        <Wrapper>
            <div className="flex justify-center w-full ">
                <RegisterForm />
            </div>
        </Wrapper>
    )
}