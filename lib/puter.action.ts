import puter from "@heyputer/puter.js";
import { getOrCreateHostingConfig, uploadImageHosting } from "./puter.hosting";
import { isHostedUrl } from "./utils";

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

export const createProject = async ({
  item,
}: CreateProjectParams): Promise<DesignItem | null | undefined> => {
  const projectId = item.id;
  const hosting = await getOrCreateHostingConfig();
  const hostedSource = projectId
    ? await uploadImageHosting({
        hosting,
        url: item.sourceImage,
        projectId,
        label: "source",
      })
    : null;

  const hostedRender =
    projectId && item.renderedImage
      ? await uploadImageHosting({
          hosting,
          url: item.renderedImage,
          projectId,
          label: "rendered",
        })
      : null;
  const resolvedSource =
    hostedSource?.url ||
    (isHostedUrl(item.sourceImage) ? item.sourceImage : "");
  if (!resolvedSource) {
    console.warn("Failed to resolve source image, skkiping save");
    return null;
  }

  const resolvedRender = hostedRender?.url
    ? hostedRender.url
    : item.renderedImage && isHostedUrl(item.renderedImage)
      ? item.renderedImage
      : undefined;

  const {
    sourcePath: _sourcePath,
    renderedPath: _renderedPath,
    publicPath: _publicPath,
    ...rest
  } = item;

  const payload = {
    ...rest,
    sourceImage: resolvedSource,
    renderedImage: resolvedRender,
  };

  try {
    //Call the Puter worker to save the project in kv
    return payload;
  } catch (error) {
    console.log("Failed to save project", error);
  }
};
