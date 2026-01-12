import { createClient } from "../supabase/server";
import { encrypt } from "@/utils/crypto";

export const getUserServerSideProps = async () => {
    // Create authenticated Supabase Client
    const supabase = await createClient();
    // Check if we have a session

    // const { data, error } = await supabase.auth.getClaims()

    // if (error || !data) {
    //     return {
    //         currentUser: null,
    //     };
    // }
    const {
        data: { user },
    } = await supabase.auth.getUser();

    return {
        currentUser: user,
    };
};
