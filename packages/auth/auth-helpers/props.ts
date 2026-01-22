import { createClient } from "../supabase/server";
import { encrypt } from "../utils/crypto";
import type { AuthConfig } from "../config";

export const getUserServerSideProps = async (config: AuthConfig) => {
    // Create authenticated Supabase Client
    const supabase = await createClient(config);
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
