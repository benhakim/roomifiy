import puter from "@heyputer/puter.js";

export const signIn = async () => {
  console.log("Starting Puter sign in...");
  try {
    const result = await puter.auth.signIn();
    console.log("Sign in successful");
    return result;
  } catch (error) {
    console.error("Sign in error:", error);
    throw error;
  }
};

export const signOut = async () => {
  console.log("Starting Puter sign out...");
  try {
    const result = await puter.auth.signOut();
    console.log("Sign out successful");
    return result;
  } catch (error) {
    console.error("Sign out error:", error);
    throw error;
  }
};

export const getCurrentUser = async () => {
  try {
    return await puter.auth.getUser();
  } catch (error) {
    console.error("Get user error:", error);
    return null;
  }
};
