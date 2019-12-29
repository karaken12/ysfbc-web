import React from "react";
import Tweet from "./Tweet";

export function Tweets(props) {
  const meetings = props.meetings;

  return <>
    {Object.entries(meetings).map((entry) => {
      var meeting = entry[1];
      return <Tweet meeting={meeting}/>;
    })}
  </>;
}

export default Tweets;
