import { createClient } from "../supabase/server";
import { encrypt } from "@/utils/crypto";

export const getUserServerSideProps = async () => {
    // Create authenticated Supabase Client
    const supabase = await createClient();
    // Check if we have a session

    const {
        data: { user },
    } = await supabase.auth.getUser();

    // Encrypt user email if user exists
    // if (user && !user.user_metadata.user_key) {
    //     const dataToEncrypt = { email: user.email };
    //     const password = "597cfe62-8cff-11ef-b2b0-9a51a50e";

    //     const dataToEncryptString = JSON.stringify(dataToEncrypt);
    //     const encryptedData = encrypt(dataToEncryptString, password);

    //     const res = await fetch(
    //         "https://api.kodepay.io/sandbox/api/external/sync_client_user",
    //         {
    //             method: "POST",
    //             headers: {
    //                 "Content-Type": "application/json",
    //             },
    //             body: JSON.stringify({
    //                 client_key: "429e48ee-768a-11ef-9cf3-928f62f479bc",
    //                 encrypt_data: encryptedData,
    //             }), // 将 name 作为 JSON 数据传递
    //         }
    //     );

    //     const result = await res.json();

    //     if (result.code === 100000) {
    //         const { error } = await supabase.auth.updateUser({
    //             data: {
    //                 user_key: result.data.user_key,
    //             },
    //         });

    //         console.log(error, "error");

    //         if (error) {
    //             return {
    //                 error: error.message,
    //                 currentUser: user,
    //             };
    //         }
    //     } else {
    //         return {
    //             error: result.message,
    //             currentUser: user,
    //         };
    //     }
    // }

    return {
        currentUser: user,
    };
};
