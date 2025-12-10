import Image from "next/image";

export default function Quark(props) {
    return (
        <div {...props}>
            <Image src="https://lh3.googleusercontent.com/a9B1KrZ1HklW8xahde0u191CZcR682G_fv4l6OlmEoGytmVxc-HnN9CkhKxunzZryLsaV85gddVQ2k6M8OrGVhtsrA=s60" alt="Quark" width={25} height={25} />
        </div>
    );
}

