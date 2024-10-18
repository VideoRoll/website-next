import { createClient } from "../supabase/server";

export const getUserServerSideProps = async () => {
  // Create authenticated Supabase Client
  const supabase = createClient();
  // Check if we have a session

  const {
    data: { user },
  } = await supabase.auth.getUser()

  return {
    currentUser: user,
  };
};
