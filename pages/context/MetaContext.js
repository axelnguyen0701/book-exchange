import React, { createContext, useEffect, useState, useRef } from "react";
import { webClient } from "../utils/identity";
import Router from "next/router";
export const AppContext = createContext();

// This creates the context wrapper around the entire app allowing the users info to be accessible everywhere

const MetaProvider = ({ children }) => {
  const [name, setName] = useState("");
  const [pic, setPic] = useState("");
  const [profile, setProfile] = useState({});
  const [localDid, setDid] = useState(null);
  const [selfId, setSelfId] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [showGreeting, setShowGreeting] = useState(false);
  const selfIdRef = useRef(null);
  const didRef = useRef(null);

  selfIdRef.current = selfId;
  didRef.current = localDid;

  // function for connecting to metamask account and loading profile
  const connect = async () => {
    const cdata = await webClient();
    const { id, selfId, error } = cdata;
    if (error) {
      console.log("error: ", error);
      return;
    }
    setDid(id);
    setSelfId(selfId);
    const data = await selfId.get("basicProfile", id);
    if (data) {
      setProfile(data);
    } else {
      setShowGreeting(true);
    }
    setLoaded(true);
    Router.push("/home");
  };

  // function to update a users profile
  async function updateProfile() {
    // don't allow user to submit nothing
    if (!pic && !name) {
      console.log("error... no profile information submitted");
      return;
    }
    // must connect if users Id isn't already found
    if (!selfId) {
      await connect();
    }
    // load profile
    const user = { ...profile };

    // update information
    if (pic) user.pic = pic;
    if (name) user.name = name;
    await selfIdRef.current.set("basicProfile", user);
    setLocalProfileData();
    console.log("profile updated...");
  }

  // function to read a users profile
  async function readProfile() {
    try {
      const { record } = await getRecord();
      if (record) {
        setProfile(record);
      } else {
        setShowGreeting(true);
      }
    } catch (error) {
      setShowGreeting(true);
    }
    setLoaded(true);
  }

  // function for loading local profile information
  async function setLocalProfileData() {
    try {
      const data = await selfIdRef.current.get(
        "basicProfile",
        didRef.current.id
      );
      if (!data) return;
      setProfile(data);
      setShowGreeting(false);
    } catch (error) {
      console.log("error", error);
    }
  }

  // return values accesible globally through context
  return (
    <AppContext.Provider
      value={{
        loaded,
        connect,
        profile,
        name,
        setName,
        pic,
        setPic,
        updateProfile,
        readProfile,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
export default MetaProvider;
