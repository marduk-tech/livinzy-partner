import { UIKitSettingsBuilder } from "@cometchat/uikit-shared";
import {
  CometChatUIKit,
  CometChatUsersWithMessages,
} from "@cometchat/chat-uikit-react";
import React, { useEffect, useState } from "react";

const COMETCHAT_CONSTANTS = {
  APP_ID: "258793fd81c9a784", //Replace with your App ID
  REGION: "in", //Replace with your App Region
  AUTH_KEY: "3c4c8700f18e1f20e426070b60bab921b0df064c", //Replace with your Auth Key
};

//create the builder
const UIKitSettings = new UIKitSettingsBuilder()
  .setAppId(COMETCHAT_CONSTANTS.APP_ID)
  .setRegion(COMETCHAT_CONSTANTS.REGION)
  .setAuthKey(COMETCHAT_CONSTANTS.AUTH_KEY)
  .subscribePresenceForAllUsers()
  .build();

const CustomCometChat: React.FC = () => {
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);

  useEffect(() => {
    //Initialize CometChat UI Kit
    CometChatUIKit.init(UIKitSettings)!
      .then(() => {
        console.log("Initialization completed successfully");
        CometChatUIKit.getLoggedinUser().then((user: CometChat.User | null) => {
          if (!user) {
            //Login user
            CometChatUIKit.login("superhero1")
              .then((user: CometChat.User) => {
                setIsUserLoggedIn(true);
                console.log("Login Successful:", { user });
                //mount your app
              })
              .catch(console.log);
          } else {
            setIsUserLoggedIn(true);
          }
        });
      })
      .catch(console.log);
  });
  if (!isUserLoggedIn) {
    return "Loading..";
  }

  return <CometChatUsersWithMessages />;
};

export default CustomCometChat;
